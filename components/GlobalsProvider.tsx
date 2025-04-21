import React, { createContext, useReducer, PropsWithChildren, useEffect } from 'react';
import Storage from 'expo-sqlite/kv-store';
import { useAssets } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { ExerciseData, Exercises } from '@/constants/Exercises';

export interface Database {
    exercises: Record<string, ExerciseData>
}

export const initialGlobals = {
    loaded: false,
    db: {
        exercises: { }
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

const getAllData = async () => {
    const data = await Storage.multiGet(Storage.getAllKeysSync());
    return Object.fromEntries(data.map(([key, serialized]) => [key, serialized !== null ? JSON.parse(serialized) : null]));
}

export const updateExercise = async (id: string, data: Partial<ExerciseData>, dispatch: React.Dispatch<GlobalsAction>) => {
    const newData: Record<string, Partial<ExerciseData>> = {};
    newData[id] = data;
    await Storage.mergeItem("exercises", JSON.stringify(newData));
    dispatch({
        type: "updateExercise",
        id: id,
        data: data
    });
}

const GlobalsProvider = ({ children }: PropsWithChildren) => {
    const [database, dispatch] = useReducer(globalsReducer, initialGlobals);
    const [assets, error] = useAssets([
        require("../assets/trimmedSamples/bassoon/A3.mp3"),
        require("../assets/trimmedSamples/cello/A3.mp3"),
        require("../assets/trimmedSamples/clarinet/D4.mp3"),
        require("../assets/trimmedSamples/contrabass/A2.mp3"),
        require("../assets/trimmedSamples/flute/A5.mp3"),
        require("../assets/trimmedSamples/french_horn/A3.mp3"),
        require("../assets/trimmedSamples/piano/A4.mp3"),
        require("../assets/trimmedSamples/saxophone/A4.mp3"),
        require("../assets/trimmedSamples/trombone/C3.mp3"),
        require("../assets/trimmedSamples/trumpet/C4.mp3"),
        require("../assets/trimmedSamples/tuba/F2.mp3"),
        require("../assets/trimmedSamples/violin/A4.mp3")
    ]);

    useEffect(() => {
        if (assets !== undefined) {
            if (error !== undefined) {
                console.error("Error loading audio assets:", error);
            }
            getAllData().then(async (data) => {
                // Load database
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

                // Load instrument URIs
                const instrumentUris: Record<string, Record<string, string>> = {};
                for (const asset of assets) {
                    try {
                        const uri = asset.uri;
                        const note = uri.split("%2F").pop()?.split(".")[0] ?? "unknown";
                        const instrument = uri.split("%2F")[uri.split("%2F").length - 2];
                
                        await asset.downloadAsync(); // Ensure the asset is downloaded
                
                        // Convert to Base64
                        const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                
                        if (!instrumentUris[instrument]) {
                            instrumentUris[instrument] = {};
                        }
                
                        instrumentUris[instrument][note] = base64; // Store the Base64 string
                    } catch (error) {
                        console.error("Error loading audio asset:", error);
                    }
                }
                dispatch({
                    type: "set",
                    context: {
                        loaded: true,
                        db: data as Database,
                        instrumentUris: instrumentUris
                    }
                });
            });
        }
    }, [assets]);

    return (
        <GlobalsContext.Provider value={database}>
            <GlobalsDispatchContext.Provider value={dispatch}>
                { children }
            </GlobalsDispatchContext.Provider>
        </GlobalsContext.Provider>
    );
}

export default GlobalsProvider;