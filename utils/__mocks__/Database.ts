import { ExerciseData, Exercises } from '@/constants/Exercises';

export const loadDatabase = () => {}

export const getExercises = () => {
    return Object.fromEntries(Object.keys(Exercises).map(id => [id, { completed: 0, correct: 0 }]));
}

export const getExercise = (id: string) => {
    const exercises = getExercises();
    if (exercises === null) {
        return null;
    }
    return exercises[id];
}

export const updateExercise = async (_id: string, _data: Partial<ExerciseData>) => {}