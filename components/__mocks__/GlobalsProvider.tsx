import React, { createContext, useReducer, PropsWithChildren } from 'react';
import { ExerciseData, Exercises } from '@/constants/Exercises';

export interface Database {
    exercises: Record<string, ExerciseData>
}

export const initialGlobals = {
    loaded: true,
    db: {
        exercises: Object.fromEntries(Object.keys(Exercises).map(id => [id, { completed: 0, correct: 0 }]))
    },
    instrumentUris: { }
}

export type Globals = {
    loaded: boolean,
    db: Database,
    instrumentUris: Record<string, Record<string, string>>
}

export type GlobalsAction = {
    type: "set",
    context: Globals
} | {
    type: "updateExercise",
    id: string,
    data: Partial<ExerciseData>
}

export const GlobalsContext = createContext<Globals>(initialGlobals);
export const GlobalsDispatchContext = createContext<React.Dispatch<GlobalsAction>>(() => {});

export const globalsReducer = (globals: Globals, action: GlobalsAction) => {
    switch (action.type) {
        case "set": {
            return action.context;
        }
        case "updateExercise": {
            const currentData = globals.db.exercises[action.id];
            globals.db.exercises[action.id] = {...currentData, ...action.data};
            return globals;
        }
    }
}


export const updateExercise = async (id: string, data: Partial<ExerciseData>, dispatch: React.Dispatch<GlobalsAction>) => {
    const newData: Record<string, Partial<ExerciseData>> = {};
    newData[id] = data;
    dispatch({
        type: "updateExercise",
        id: id,
        data: data
    });
}

const GlobalsProvider = ({ children }: PropsWithChildren) => {
    const [database, dispatch] = useReducer(globalsReducer, initialGlobals);

    return (
        <GlobalsContext.Provider value={database}>
            <GlobalsDispatchContext.Provider value={dispatch}>
                { children }
            </GlobalsDispatchContext.Provider>
        </GlobalsContext.Provider>
    );
}

export default GlobalsProvider;