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
    difficultyRanges: Record<string, [number, number]>,
}

export type ExerciseData = {
    completed: number,
    correct: number
}

//TODO: create duplicate samplers/synths for duplicate active instruments
export const soundScript = (notes: Note[], instruments: string[]) => `
    
    ${notes.map((note, index) => `
        ${instruments[Math.min(index, instruments.length-1)]}.triggerAttackRelease(Tone.Frequency(Tone.mtof(${note.midi}) * ${Math.pow(2, Math.abs(note.detune || 0) / 1200)}), "2n");
    `).join("\n")}

    //synthesizer.triggerAttackRelease(Tone.Frequency(Tone.mtof(60) * 1.0022610), "2n"); // Example note to ensure synthesizer is initialized

    true;
`;