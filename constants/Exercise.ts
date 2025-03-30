export enum ExerciseCategories {
    Intervals = "Intervals",
    Chords = "Chords"
}

export enum ExerciseDifficulties {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}

export const getRndInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRndSign = () => {
    return Math.random() < 0.5 ? -1 : 1;
}

// because js uses remainder not modulo :(
export const modulo = (a: number, b: number) => {
    return ((a % b) + b) % b;
}

export type Note = {
    midi: number,
    detune?: number,
}

export type Exercise = {
    title: string,
    category: ExerciseCategories,
    difficulty: ExerciseDifficulties,
    generateNotes: (inTune: Boolean, difficulties: {[key: string]: number }) => { notes: Note[], feedback: string },
    soundScript: (notes: Note[]) => string,
    answerChoices: string[],
    getCorrectAnswer: (inTune: Boolean) => string,
    generateFeedback: (centsOutOfTune: number, ...notes: number[]) => string,
    difficultyRanges: Record<string, number[]>
}