import React, { createContext, useReducer, PropsWithChildren, useEffect } from 'react';
import Storage from 'expo-sqlite/kv-store';
import { ExerciseData, Exercises } from '@/constants/Exercises';

export interface Database {
    exercises: Record<string, ExerciseData>
}

export const initialDatabase = {
    exercises: { "sentinel": { completed: 0, correct: 0 } }
}

export type DatabaseAction = {
    type: "set",
    data: Database
} | {
    type: "updateExercise",
    id: string,
    data: Partial<ExerciseData>
}

export const DatabaseContext = createContext<Database>(initialDatabase);
export const DatabaseDispatchContext = createContext<React.Dispatch<DatabaseAction>>(() => {});

export const databaseReducer = (database: Database, action: DatabaseAction) => {
    switch (action.type) {
        case "set": {
            return action.data;
        }
        case "updateExercise": {
            const currentData = database.exercises[action.id];
            database.exercises[action.id] = {...currentData, ...action.data};
            return database;
        }
    }
}

export const getAllData = async () => {
    const data = await Storage.multiGet(Storage.getAllKeysSync());
    return Object.fromEntries(data.map(([key, serialized]) => [key, serialized !== null ? JSON.parse(serialized) : null]));
}

export const updateExercise = async (id: string, data: Partial<ExerciseData>, dispatch: React.Dispatch<DatabaseAction>) => {
    const newData: Record<string, Partial<ExerciseData>> = {};
    newData[id] = data;
    await Storage.mergeItem("exercises", JSON.stringify(newData));
    dispatch({
        type: "updateExercise",
        id: id,
        data: data
    });
}

const DatabaseProvider = ({ children }: PropsWithChildren) => {
    const [database, dispatch] = useReducer(databaseReducer, initialDatabase);

    useEffect(() => {
        getAllData().then(async (data) => {
            if (!data.hasOwnProperty("exercises")) {
                data.exercises = {};
            }
            // Default-initialize entries for missing exercises
            for (const exerciseId of Object.keys(Exercises)) {
                if (!data.exercises.hasOwnProperty(exerciseId)) {
                    data.exercises[exerciseId] = { completed: 0, correct: 0 };
                }
            }
            await Storage.multiMerge(Object.entries(data).map(([key, value]) => [key, JSON.stringify(value)]));
            dispatch({
                type: "set",
                data: data as Database
            });
        });
    }, []);

    return (
        <DatabaseContext.Provider value={database}>
            <DatabaseDispatchContext.Provider value={dispatch}>
                { children }
            </DatabaseDispatchContext.Provider>
        </DatabaseContext.Provider>
    );
}

export default DatabaseProvider;