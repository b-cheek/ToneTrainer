import * as ExerciseModules from "./ex"
import { Exercise, ExerciseCategories } from "./Exercise"

export * from "./Exercise"

export const Exercises: Record<string, Exercise> = {
    "interval-tuning": ExerciseModules.IntervalTuning,
    "chord-tuning": ExerciseModules.ChordTuning
}

export const Categories: Record<ExerciseCategories, (Exercise & { id: string })[]> = Object.entries(Exercises).reduce(
    (accumulator, [id, exercise]) => {
        let category = exercise.category;
        if (!(category in accumulator)) {
            accumulator[category] = [];
        }
        accumulator[category].push({ ...exercise, id: id });
        return accumulator;
    },
    {} as Record<ExerciseCategories, (Exercise & { id: string })[]>
);