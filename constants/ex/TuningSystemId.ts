import { Exercise } from "../Exercise"
import { justIntonationAdjustments, harmonicJustAdjustments, pythagoreanAdjustments, quarterCommaMeantoneAdjustments, werckmeisterIIIAdjustments } from "../Values"
import { chords, tuningSystems } from "../Values"
import { ExerciseCategories, ExerciseDifficulties } from "../Exercise"
import { getRndInt, modulo } from '@/utils/Math'

export const TuningSystemId: Exercise = {
    title: "Tuning System Identification",
    category: ExerciseCategories.Chords,
    difficulty: ExerciseDifficulties.Advanced,
    generateNotes: function (inTune: Boolean, tuningSystem: string, difficulties: { [key: string]: number }) {
        const { 
            range: rangeDifficulty, 
            size: sizeDifficulty, // to be implemented, change octaves of certain notes / inversions?
            complexity: complexityDifficulty, // number of notes in the chord
        } = difficulties;

        const tuningSystemAdjustments = (() => {
            switch (tuningSystem) {
                case "Equal Temperament":
                    return Array(12).fill(0);
                case "Just Intonation":
                    return justIntonationAdjustments;
                case "Harmonic Just Intonation":
                    return harmonicJustAdjustments;
                case "Pythagorean Tuning":
                    return pythagoreanAdjustments;
                case "Quarter-Comma Meantone Tuning":
                    return quarterCommaMeantoneAdjustments;
                case "Werckmeister III Tuning":
                    return werckmeisterIIIAdjustments;
                default:
                    throw new Error("Invalid tuning system selected");
            }
        })()

        const validChords = chords.filter(chord => chord.shape.length + 1 <= complexityDifficulty)
        const chord = validChords[getRndInt(0, validChords.length - 1)]
        const chordCenter = 64 - Math.floor(chord.shape[chord.shape.length - 1] / 2);

        let notes = [
            {
                // 56 is middle C - 1/2 avg triad size (7 semitones) since building up not either direction like interval
                midi: getRndInt(chordCenter - rangeDifficulty, chordCenter + rangeDifficulty),
                detune: 0
            }
        ];

        for (let i = 0; i < chord.shape.length; i++) {
            notes.push({
                midi: notes[0].midi + chord.shape[i],
                detune: 0
            });
            notes[i+1].detune += tuningSystemAdjustments[modulo(notes[i+1].midi - notes[0].midi, 12)];
        }

        return {
            notes: notes,
            feedback: this.generateFeedback({
                title: chord.title,
                tuningSystem: tuningSystem
            })
        };
    },

    // Same for now and will specify in feedback string
    answerChoices: [
        'Equal Temperament',
        'Just Intonation',
        'Harmonic Just Intonation',
        'Pythagorean Tuning',
        'Quarter-Comma Meantone Tuning',
        'Werckmeister III Tuning'
    ],
    generateFeedback: (args: Record<string, any>) => {
        const { tuningSystem, title } = args;

        return `Previous Exercise: ${title}, ` +
            `Tuning System: ${tuningSystem}`;
    },
    difficultyRanges: {
        range: [0, 63],
        size: [11, 35],
        complexity: [3, 7], // Number of notes in chord
    },
}