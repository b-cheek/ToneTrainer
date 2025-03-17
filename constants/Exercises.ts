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

export type Note = {
    midi: number,
    detune?: number,
}

type Exercise = {
    title: string,
    grouping: ExerciseGroupings,
    generateNotes: (inTune: Boolean) => { notes: Note[], centsOutOfTune: number },
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
            let note0 = getRndInt(60 - IntervalRangeDifficulty.easy, 60 + IntervalRangeDifficulty.easy);
            let note1 = note0 + getRndInt(-IntervalSizeDifficulty.easy, IntervalSizeDifficulty.easy);
            let note1Detune = 0;
            note1Detune += justIntonationAdjustments[(note1 - note0 + 12)%12]; // Weird because js usses remainder not modul0 :(
            const centsOutOfTune = (inTune) ? 0 : getRndInt(outOfTuneDifficulty.easy, 49) * getRndSign();
            // Note only up to 49 cents out of tune to avoid intervallic ambiguity (ignoring existing just intonation adjustments)
            // TODO: explain this in app and other just intonation related stuff
            note1Detune += centsOutOfTune;
            // debugging
            // alert(`note0: ${note0}, note1: ${note1}, note1Detune: ${note1Detune}, interval: ${intervalDistances[(note1 - note0 + 12)%12]}`);
            return {
                notes: [
                    { midi: note0 },
                    { midi: note1, detune: note1Detune }
                ],
                centsOutOfTune: centsOutOfTune * Math.sign(note1-note0)
                // centsOutOfTune is positive if interval is too wide, negative if too narrow
            }
        },
        soundScript: (notes: Note[]) => `
            const synths = [];

            ${notes.map((note, index) => `
                synths[${index}] = new Tone.Synth().toDestination();
                synths[${index}].detune.value = ${note.detune ?? 0};
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