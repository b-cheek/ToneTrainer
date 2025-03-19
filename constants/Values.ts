export const justIntonationAdjustments = [
    0,
    11.7,
    3.91,
    15.6,
    -13.7,
    -1.95,
    -9.78,
    1.95,
    13.7,
    -15.6,
    -3.91,
    -11.7,
] // Note mirrored after TT inverting intervals

export const intervalDistances = [ // Currently for debugging maybe more later
    "P1",
    "m2",
    "M2",
    "m3",
    "M3",
    "P4",
    "TT",
    "P5",
    "m6",
    "M6",
    "m7",
    "M7",
]

export type DifficultyLevel = 'easy' | 'intermediate' | 'advanced';

export const difficultyLevelString: Record<DifficultyLevel, DifficultyLevel> = {
    easy: "easy",
    intermediate: "intermediate",
    advanced: "advanced"
} as const;
