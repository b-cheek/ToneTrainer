export enum ExerciseCategories {
    Intervals = "Intervals",
    Chords = "Chords"
}

export enum ExerciseDifficulties {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced"
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

export const soundScript = (notes: Note[], instruments: string[], staggered: boolean) => {

    const instrumentNotes = notes.reduce((acc, note, index) => {
        const instrument = instruments[Math.min(index, instruments.length - 1)];
        (acc[instrument] ||= []).push(note);
        return acc;
    }, {} as Record<string, Note[]>);

    return (staggered) 
        ? `
            ${notes.map(({midi, detune}) => `Tone.Frequency(Tone.mtof(${midi}) * ${Math.pow(2, Math.abs(detune || 0) / 1200)})`)
                .map((note, index) => `
                    ${instruments[Math.min(index, instruments.length - 1)]}.triggerAttackRelease(${note}, 0.5, "+${index * 0.5}");
                `).join("\n")
            }
            // piano.triggerAttackRelease(440, 0.5, 0); // Debugging
            // piano.triggerAttackRelease(880, 0.5, 0.5); // Debugging
            true;
        `
        : `
            ${Object.entries(instrumentNotes).map(([instrument, notes]) => `
                ${instrument}.triggerAttackRelease([${notes.map(({midi, detune}) => `Tone.Frequency(Tone.mtof(${midi}) * ${Math.pow(2, Math.abs(detune || 0) / 1200)})`).join(", ")}], "2n");
            `).join("\n")}
            // piano.triggerAttackRelease([440, 880], "2n"); // Debugging
            true;
        `;
    
}