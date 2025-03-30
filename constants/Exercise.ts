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
    answerChoices: string[],
    getCorrectAnswer: (inTune: Boolean) => string,
    generateFeedback: (args: Record<string, any>) => string,
    difficultyRanges: Record<string, number[]>
}

export const soundScript = (notes: Note[]) => `
    const synths = [];

    ${notes.map((note, index) => `
        synths[${index}] = new Tone.Synth().toDestination();
        synths[${index}].detune.value = ${note.detune ?? 0};
        synths[${index}].triggerAttackRelease(Tone.Frequency(${note.midi}, "midi"), "2n");
    `).join("\n")}
`;