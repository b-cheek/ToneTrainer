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

export const soundScript = (notes: Note[]) => `
    const synths = [];

    ${notes.map((note, index) => `
        synths[${index}] = new Tone.Synth().toDestination();
        synths[${index}].detune.value = ${note.detune ?? 0};
        synths[${index}].triggerAttackRelease(Tone.Frequency(${note.midi}, "midi"), "2n");
    `).join("\n")}
`;

export type Note = {
    midi: number,
    detune?: number,
}

type Exercise = {
    title: string,
    grouping: ExerciseGroupings,
    generateFeedback: (args: Record<string, any>) => string,
    generateNotes: (inTune: Boolean, difficulties: {[key: string]: number }) => { notes: Note[], feedback: string },
    answerChoices: string[],
    getCorrectAnswer: (inTune: Boolean) => string,
    difficultyRanges: Record<string, number[]>,
}

export const Exercises: Exercise[] = [
    {
        title: "Interval Tuning",
        grouping: ExerciseGroupings.Beginner,
        generateNotes: function (inTune: Boolean, difficulties: { [key: string]: number }) {

            const { 
                range: rangeDifficulty, 
                size: sizeDifficulty, 
                outOfTune: outOfTuneDifficulty 
            } = difficulties;

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
                feedback: this.generateFeedback({centsOutOfTune, note0, note1})
                // centsOutOfTune is positive if interval is too wide, negative if too narrow
                // TODO: Refactor to simply return the computed feedback string instead of just the cents out of tune
                // Which will need adustment to account for intervals greater than an octave
            };
        },
        answerChoices: [
            'In Tune',
            'Out of Tune',
        ],
        getCorrectAnswer: (inTune: Boolean) => {
            return inTune ? 'In Tune' : 'Out of Tune';
        },
        generateFeedback: (args: Record<string, any>) => {
            const { centsOutOfTune, note0, note1 } = args;
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
    },
    {
        title: "Triad Tuning",
        grouping: ExerciseGroupings.Intermediate,
        generateNotes: function (inTune: Boolean, difficulties: { [key: string]: number }) {

            const { 
                range: rangeDifficulty, 
                size: sizeDifficulty, 
                outOfTune: outOfTuneDifficulty 
            } = difficulties;

            let notes = [
                {
                    // 56 is middle C - 1/2 avg triad size (7 semitones) since building up not either direction like interval
                    midi: getRndInt(56 - rangeDifficulty, 56 + rangeDifficulty),
                    detune: 0
                }
            ];

            for (let i = 1; i < 3; i++) {
                notes.push({
                    // Stack major/minor thirds
                    midi: notes[i - 1].midi + getRndInt(3, 4),
                    detune: 0
                });
                notes[i].detune += justIntonationAdjustments[modulo(notes[i].midi - notes[0].midi, 12)];
            }

            const centsOutOfTune = (inTune) 
                ? 0 
                : getRndInt(outOfTuneDifficulty, 49 - Math.max(...justIntonationAdjustments)) * getRndSign();

            const detuneNote = (inTune) ? -1 : getRndInt(0, 2);

            if (!inTune) notes[detuneNote].detune += centsOutOfTune;

            return {
                notes: notes,
                feedback: this.generateFeedback({detuneNote, centsOutOfTune, note0: notes[0].midi, note1: notes[1].midi, note2: notes[2].midi})
            };
        },
        // Same for now and will specify in feedback string
        answerChoices: [
            'In Tune',
            'Out of Tune',
        ],
        getCorrectAnswer: (inTune, ...notes: number[]) => {
            return inTune ? 'In Tune' : 'Out of Tune';
        },
        generateFeedback: (args: Record<string, any>) => {
            const { detuneNote, centsOutOfTune, note0, note1, note2 } = args;
            const quality = [["Diminished", "Minor"], ["Major", "Augmented"]]
                            [note1-note0-3][note2-note1-3];
            const degree = ["Root", "Third", "Fifth"]
                           [detuneNote];

            return `Previous Exercise: ${quality} Triad, ` +
                ((centsOutOfTune == 0)
                    ? "In Tune" 
                    : `${degree} ${Math.abs(centsOutOfTune)} cents ${(centsOutOfTune < 0) ? "Flat" : "Sharp"}`);
        },
        // Make this more customizable set by user or presets like this?
        difficultyRanges: {
            outOfTune: [30, 1],
            size: [11, 35],
            range: [0, 44] 
        },
    },
    {
        title: "Chord Tuning",
        grouping: ExerciseGroupings.Intermediate,
        generateNotes: function (inTune: Boolean, difficulties: { [key: string]: number }) {
            const { 
                range: rangeDifficulty, 
                size: sizeDifficulty, 
                complexity: complexityDifficulty, 
                outOfTune: outOfTuneDifficulty 
            } = difficulties;

            let notes = [
                {
                    // 56 is middle C - 1/2 avg triad size (7 semitones) since building up not either direction like interval
                    midi: getRndInt(56 - rangeDifficulty, 56 + rangeDifficulty),
                    detune: 0
                }
            ];

            for (let i = 1; i < complexityDifficulty; i++) {
                notes.push({
                    // Stack major/minor thirds
                    midi: notes[i - 1].midi + getRndInt(3, 4),
                    detune: 0
                });
                notes[i].detune += justIntonationAdjustments[modulo(notes[i].midi - notes[0].midi, 12)];
            }

            const centsOutOfTune = (inTune) 
                ? 0 
                : getRndInt(outOfTuneDifficulty, 49 - Math.max(...justIntonationAdjustments)) * getRndSign();

            const detuneNote = (inTune) ? -1 : getRndInt(0, complexityDifficulty - 1);

            if (!inTune) notes[detuneNote].detune += centsOutOfTune;

            return {
                notes: notes,
                feedback: this.generateFeedback({detuneNote, centsOutOfTune, ...notes.map(notes => notes.midi)})
            };
        },
        // Same for now and will specify in feedback string
        answerChoices: [
            'In Tune',
            'Out of Tune',
        ],
        getCorrectAnswer: (inTune, ...notes: number[]) => {
            return inTune ? 'In Tune' : 'Out of Tune';
        },
        generateFeedback: (args: Record<string, any>) => {
            const { detuneNote, centsOutOfTune, ...notes } = args;
            /* Note that using spread and rest in the way I did results in a notes object taking the shape
            {
                "0": 60,
                "1": 64,
                "2": 67
            }
            etc., couldn't find the relevant documentation to understand if this behavior is necessary 
            or if I did something weird, but it works
            */

            const [note0, note1, note2] = Object.values(notes);
            const quality = [["Diminished", "Minor"], ["Major", "Augmented"]]
                            [note1-note0-3][note2-note1-3];
            const degree = ["Root", "Third", "Fifth"]
                           [detuneNote];

            return `Previous Exercise: ${quality} Triad, ` +
                ((centsOutOfTune == 0)
                    ? "In Tune" 
                    : `${degree} ${Math.abs(centsOutOfTune)} cents ${(centsOutOfTune < 0) ? "Flat" : "Sharp"}`);
        },
        // Make this more customizable set by user or presets like this?
        difficultyRanges: {
            outOfTune: [30, 1],
            size: [11, 35],
            complexity: [3, 7], // Number of notes in chord
            range: [0, 44] 
        },
    }

]