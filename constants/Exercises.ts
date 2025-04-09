import { justIntonationAdjustments, intervalDistances } from "./Values"

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

// because js uses remainder not modulo :(
const modulo = (a: number, b: number) => {
    return ((a % b) + b) % b;
}

export type Note = {
    midi: number,
    detune?: number,
}

type Exercise = {
    title: string,
    grouping: ExerciseGroupings,
    generateNotes: (inTune: Boolean, difficulties: {[key: string]: number }) => { notes: Note[], feedback: string },
    soundScript: (notes: Note[]) => string,
    answerChoices: string[],
    getCorrectAnswer: (inTune: Boolean) => string,
    generateFeedback: (centsOutOfTune: number, ...notes: number[]) => string,
    difficultyRanges: Record<string, number[]>,
}

export const Exercises: Exercise[] = [
    {
        title: "Interval Tuning",
        grouping: ExerciseGroupings.Beginner,
        generateNotes: function (inTune: Boolean, difficulties: { [key: string]: number }) {
            // Extract difficulties
            // const { range, size, outOfTune } = difficulties;
            // const rangeDifficulty = this.difficultyLevels.range[range];
            // const sizeDifficulty = this.difficultyLevels.size[size];
            // const outOfTuneDifficulty = this.difficultyLevels.outOfTune[outOfTune];

            const rangeDifficulty = difficulties.range;
            const sizeDifficulty = difficulties.size;
            const outOfTuneDifficulty = difficulties.outOfTune;

            // 60 is middle C
            let note0 = getRndInt(60 - rangeDifficulty, 60 + rangeDifficulty);
            let note1 = note0 + getRndInt(-sizeDifficulty, sizeDifficulty);
            let note1Detune = 0;
            note1Detune += justIntonationAdjustments[modulo(note1-note0, 12)]; 
            // note that the modulo fn automatically accesses the INVERTED adjustment when note1 is lower than note0
            const centsOutOfTune = (inTune) 
                ? 0 
                : getRndInt(outOfTuneDifficulty, 49 - Math.max(...justIntonationAdjustments)) * getRndSign();
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
                // feedback: this.generateFeedback(inTune, centsOutOfTune * Math.sign(note1 - note0))
                feedback: this.generateFeedback(centsOutOfTune, note0, note1)
                // centsOutOfTune is positive if interval is too wide, negative if too narrow
                // TODO: Refactor to simply return the computed feedback string instead of just the cents out of tune
                // Which will need adustment to account for intervals greater than an octave
            };
        },
        soundScript: (notes: Note[]) => `
            const synths = [];

            /*
            ${notes.map((note, index) => `
                synths[${index}] = new Tone.Synth().toDestination();
                synths[${index}].detune.value = ${note.detune ?? 0};
                synths[${index}].triggerAttackRelease(Tone.Frequency(${note.midi}, "midi"), "2n");
            `).join("\n")}
            */
        
            tuba.triggerAttackRelease(Tone.Frequency(${notes[0].midi}, "midi"), "2n");
        `,
        answerChoices: [
            'In Tune',
            'Out of Tune',
        ],
        getCorrectAnswer: (inTune: Boolean) => {
            return inTune ? 'In Tune' : 'Out of Tune';
        },
        generateFeedback: (centsOutOfTune: number, ...notes: number[]) => {
            const [note0, note1] = notes;
            // Note different calculation than tuningAdjustments
            return `Previous Exercise: ${intervalDistances[Math.abs(note1-note0)]}, ` + 
                ((centsOutOfTune == 0) ? "In Tune" : 
                ((centsOutOfTune < 0) ? "Too Narrow" : "Too Wide") + ` (${Math.abs(centsOutOfTune)} cents)`);
        },
        difficultyRanges: {
            // Note that the order is reversed because more out of tune is easier
            outOfTune: [30, 1], // Note that a unison played 1 cent out of tune will "beat" at 1 Hz
            size: [11, 35], // 11 is up to maj7, 35 is 3 octaves
            // 0 range makes one of the notes always middle C
            range: [0, 44] // 44 in either direction approximates the complete range of a piano
        }
    }
]