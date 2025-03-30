
import * as ExerciseModules from "./ex"
import { Exercise, ExerciseCategories, ExerciseDifficulties } from "./Exercise"

export * from "./Exercise"

export const Exercises: Record<string, Exercise> = {
    "interval-tuning": ExerciseModules.IntervalTuning,
    "chord-tuning": ExerciseModules.ChordTuning
}

export const categorizedExerciseData: Record<ExerciseCategories, { id: string, title: string, difficulty: ExerciseDifficulties }[]> = Object.entries(Exercises).reduce(
    (accumulator, [id, exercise]) => {
        let category = exercise.category;
        if (!(category in accumulator)) {
            accumulator[category] = [];
        }
        accumulator[category].push({ id: id, title: exercise.title, difficulty: exercise.difficulty });
        return accumulator;
    },
    {} as Record<ExerciseCategories, { id: string, title: string, difficulty: ExerciseDifficulties }[]>
);
