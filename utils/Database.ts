import Storage from 'expo-sqlite/kv-store';
import { ExerciseData, Exercises } from '@/constants/Exercises';

export const loadDatabase = () => {
    const exercises = getExercises() ?? {};
    // Default-initialize entries for missing exercises
    for (const exerciseId of Object.keys(Exercises)) {
        if (!exercises.hasOwnProperty(exerciseId)) {
            exercises[exerciseId] = { completed: 0, correct: 0 };
        }
    }
    Storage.setItemSync("exercises", JSON.stringify(exercises));
}

export const getExercises = () => {
    const exercisesSerialized = Storage.getItemSync("exercises");
    if (exercisesSerialized === null) {
        return null;
    } else {
        return JSON.parse(exercisesSerialized) as Record<string, ExerciseData>;
    }
}

export const getExercise = (id: string) => {
    const exercises = getExercises();
    if (exercises === null) {
        return null;
    }
    return exercises[id];
}

export const updateExercise = async (id: string, data: Partial<ExerciseData>) => {
    const newData: Record<string, Partial<ExerciseData>> = {};
    newData[id] = data;
    await Storage.mergeItem("exercises", JSON.stringify(newData));
}