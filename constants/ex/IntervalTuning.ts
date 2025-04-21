import { Exercise } from "../Exercise"
import { justIntonationAdjustments, intervalDistances } from "../Values"
import { ExerciseCategories, ExerciseDifficulties } from "../Exercise"
import { getRndInt, getRndSign, modulo } from '@/utils/Math'

export const IntervalTuning: Exercise = {
    title: "Interval Tuning",
    category: ExerciseCategories.Intervals,
    difficulty: ExerciseDifficulties.Beginner,
    generateNotes: function (inTune: Boolean, tuningSystem: string, difficulties: { [key: string]: number }) {

        const { 
            range: rangeDifficulty, 
            size: sizeDifficulty, 
            outOfTune: outOfTuneDifficulty 
        } = difficulties;

        // 64 is E4, middle of midi range
        let note0 = getRndInt(64 - rangeDifficulty, 64 + rangeDifficulty);
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
        };
    },
    answerChoices: [
        'In Tune',
        'Out of Tune',
    ],
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
        range: [0, 63] // range fills complete midi range
    }
}