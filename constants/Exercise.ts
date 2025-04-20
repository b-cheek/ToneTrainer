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
    generateNotes: (inTune: Boolean, tuningSystem: string, difficulties: {[key: string]: number }) => { notes: Note[], feedback: string },
    answerChoices: string[],
    generateFeedback: (args: Record<string, any>) => string,
    difficultyRanges: Record<string, [number, number]>,
}

export type ExerciseData = {
    completed: number,
    correct: number
}

export const soundScript = (notes: Note[], instruments: string[]) => {

    const instrumentNotes = notes.reduce((acc, note, index) => {
        const instrument = instruments[Math.min(index, instruments.length - 1)];
        (acc[instrument] ||= []).push(note);
        return acc;
    }, {} as Record<string, Note[]>);

    return `
        ${Object.entries(instrumentNotes).map(([instrument, notes]) => `
            ${instrument}.triggerAttackRelease([${notes.map(({midi, detune}) => `Tone.Frequency(Tone.mtof(${midi}) * ${Math.pow(2, Math.abs(detune || 0) / 1200)})`).join(", ")}], "2n");
        `).join("\n")}
        // piano.triggerAttackRelease([440, 880], "2n"); // Debugging
        true;
    `;
}