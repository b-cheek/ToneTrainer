import { justIntonationAdjustments, outOfTuneDifficulty, IntervalSizeDifficulty, IntervalRangeDifficulty } from "./Values"

export enum ExerciseGroupings {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}

const getRndInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRndSign = () => {
    return Math.random() < 0.5 ? -1 : 1;
}

type Note = {
    midi: number,
    detune?: number,
}

type Exercise = {
    title: string,
    grouping: ExerciseGroupings,
    generateNotes: (inTune: Boolean) => Note[],
    soundScript: (notes: Note[]) => string,
    answerChoices: string[],
    getCorrectAnswer: (inTune: Boolean) => string,
}

export const Exercises: Exercise[] = [
    {
        title: "Interval Tuning",
        grouping: ExerciseGroupings.Beginner,
        generateNotes: (inTune: Boolean) => {
            // 60 is middle C
            // let note0 = 60; // debugging
            let note0 = getRndInt(60 - IntervalRangeDifficulty.easy, 60 + IntervalRangeDifficulty.easy);
            // note1 = 60; // debugging
            let note1 = note0 + getRndInt(-IntervalSizeDifficulty.easy, IntervalSizeDifficulty.easy);
            let note1Detune = justIntonationAdjustments[(note1 - note0 + 12)%12] ?? 0; // Weird because js usses remainder not modul0 :(
            if (!inTune) {
                note1Detune += getRndInt(outOfTuneDifficulty.easy, 50) * getRndSign();
            }
            // debugging
            // alert(`note0: ${note0}, note1: ${note1}, note1Detune: ${note1Detune}`);
            return [
                { midi: note0 },
                { midi: note1, detune: note1Detune }
            ]
        },
        // soundScript: (notes: Note[]) => `
        // const synth0 = new Tone.Synth().toDestination();
        // synth0.detune = ${notes[0].detune ?? 0};
        // const synth1 = new Tone.Synth().toDestination();
        // synth1.detune = ${notes[1].detune ?? 0};
        // synth0.triggerAttackRelease(Tone.Frequency(${notes[0].midi}, "midi"), "2n");
        // synth1.triggerAttackRelease(Tone.Frequency(${notes[1].midi}, "midi"), "2n");
        // `,
        soundScript: (notes: Note[]) => `
            const synths = [];
            
            ${notes.map((note, index) => `
                synths[${index}] = new Tone.Synth().toDestination();
                synths[${index}].detune = ${note.detune ?? 0};
                synths[${index}].triggerAttackRelease(Tone.Frequency(${note.midi}, "midi"), "2n");
            `).join("\n")}
        `,
        answerChoices: [
            'In Tune',
            'Out of Tune',
        ],
        getCorrectAnswer: (inTune: Boolean) => {
            return inTune ? 'In Tune' : 'Out of Tune';
        }
    },
]