import { justIntonationAdjustments, outOfTuneDifficulty, IntervalSizeDifficulty, IntervalRangeDifficulty, DifficultyLevel } from "./Values"

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
    generateNotes: (inTune: Boolean, difficulties: {[key: string]: DifficultyLevel }) => { notes: Note[], centsOutOfTune: number },
    soundScript: (notes: Note[]) => string,
    answerChoices: string[],
    getCorrectAnswer: (inTune: Boolean) => string,
}

export const Exercises: Exercise[] = [
    {
        title: "Interval Tuning",
        grouping: ExerciseGroupings.Beginner,
        generateNotes: function (inTune: Boolean, difficulties: { [key: string]: DifficultyLevel }) {
            // 60 is middle C
            let note0 = getRndInt(60 - IntervalRangeDifficulty[difficulties.rangeDifficulty], 60 + IntervalRangeDifficulty[difficulties.rangeDifficulty]);
            let note1 = note0 + getRndInt(-IntervalSizeDifficulty[difficulties.sizeDifficulty], IntervalSizeDifficulty[difficulties.sizeDifficulty]);
            let note1Detune = 0;
            note1Detune += justIntonationAdjustments[(note1 - note0 + 12) % 12]; // Weird because js uses remainder not modulo :(
            // Also note that this automatically accesses the INVERTED adjustment when note1 is lower than note0
            const centsOutOfTune = (inTune) ? 0 : getRndInt(outOfTuneDifficulty[difficulties.outOfTuneDifficulty], 49 - Math.max(...justIntonationAdjustments)) * getRndSign();
            // Note that this imposes a theoretical upper limit on the value of outOfTuneDifficulty.easy
            // Note only up to 49 cents out of tune to avoid intervallic ambiguity (accounting for just intonation adjustments) 
            // (There is a more beautiful/correct solution that accounts for specific adjacent intervals and when exactly one interval becomes another in relation to another 
            // but I deemed it beyond the scope of this project)
            // TODO: explain this in app and other just intonation related stuff
            note1Detune += centsOutOfTune;
            // debugging
            // alert(`note0: ${note0}, note1: ${note1}, note1Detune: ${note1Detune}, interval: ${intervalDistances[(note1 - note0 + 12)%12]}`);
            return {
                notes: [
                    { midi: note0 },
                    { midi: note1, detune: note1Detune }
                ],
                centsOutOfTune: centsOutOfTune * Math.sign(note1 - note0)
                // centsOutOfTune is positive if interval is too wide, negative if too narrow
                // TODO: Refactor to simply return the computed feedback string instead of just the cents out of tune
                // Which will need adustment to account for intervals greater than an octave
            };
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
    }
]