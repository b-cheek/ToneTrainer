import { Exercise } from "../Exercise";
import { justIntonationAdjustments, chords, degreeLabels } from "../Values"
import { ExerciseCategories, ExerciseDifficulties } from "../Exercise"
import { getRndInt, getRndSign, modulo } from '@/utils/Math'

export const ChordTuning: Exercise = {
    title: "Chord Tuning",
    category: ExerciseCategories.Chords,
    difficulty: ExerciseDifficulties.Intermediate,
    generateNotes: function (inTune: Boolean, tuningSystem: string, difficulties: { [key: string]: number }) {
        const { 
            range: rangeDifficulty, 
            size: sizeDifficulty, // to be implemented, change octaves of certain notes / inversions?
            complexity: complexityDifficulty, // number of notes in the chord
            outOfTune: outOfTuneDifficulty 
        } = difficulties;

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
            notes[i+1].detune += justIntonationAdjustments[modulo(notes[i+1].midi - notes[0].midi, 12)];
        }

        const centsOutOfTune = (inTune) 
            ? 0 
            : getRndInt(outOfTuneDifficulty, 49 - Math.max(...justIntonationAdjustments)) * getRndSign();

        const detuneNote = (inTune) ? -1 : getRndInt(0, complexityDifficulty - 1);

        if (!inTune) notes[detuneNote].detune += centsOutOfTune;

        return {
            notes: notes,
            feedback: this.generateFeedback({
                detuneDegree: detuneNote == -1 ? -1 : degreeLabels[notes[detuneNote].midi-notes[0].midi], 
                centsOutOfTune, 
                title: chord.title
            })
        };
    },
    // Same for now and will specify in feedback string
    answerChoices: [
        'In Tune',
        'Out of Tune',
    ],
    generateFeedback: (args: Record<string, any>) => {
        const { detuneDegree, centsOutOfTune, title } = args;

        return `Previous Exercise: ${title}, ` +
            ((centsOutOfTune == 0)
                ? "In Tune" 
                : `${detuneDegree} ${Math.abs(centsOutOfTune)} cents ${(centsOutOfTune < 0) ? "flat" : "sharp"}`);
    },
    // Make this more customizable set by user or presets like this?
    difficultyRanges: {
        outOfTune: [30, 1],
        size: [11, 35],
        complexity: [3, 7], // Number of notes in chord
        range: [0, 63] 
    },
}