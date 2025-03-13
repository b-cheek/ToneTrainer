import { justIntonationAdjustments, outOfTuneDifficulty, IntervalSizeDifficulty, IntervalRangeDifficulty } from "./Values"

export enum ExerciseGroupings {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}

export const Exercises = [
    {
        title: "Interval Tuning",
        grouping: ExerciseGroupings.Beginner,
        soundScript: (inTune: Boolean) => `
        const synth0 = new Tone.Synth().toDestination();
        const synth1 = new Tone.Synth().toDestination();
        // 60 is middle C
        note0 = 60; // debugging
        note0 = getRndInt(${60 - IntervalRangeDifficulty.easy}, ${60 + IntervalRangeDifficulty.easy});
        note1 = 60; // debugging
        note1 = note0 + getRndInt(${-IntervalSizeDifficulty.easy}, ${IntervalSizeDifficulty.easy});
        synth1.detune.value = (${!inTune}) ? 0 : getRndInt(${outOfTuneDifficulty.easy}, 50) * getRndSign();
        synth0.triggerAttackRelease(Tone.Frequency(note0, "midi"), "2n");
        synth1.triggerAttackRelease(Tone.Frequency(note1, "midi"), "2n");
        `,
        answerChoices: [
            'In Tune',
            'Out of Tune',
        ]
    },
    {
        title: "B",
        grouping: ExerciseGroupings.Beginner,
    },
    {
        title: "C",
        grouping: ExerciseGroupings.Beginner,
    },
    {
        title: "D",
        grouping: ExerciseGroupings.Intermediate,
    },
    {
        title: "E",
        grouping: ExerciseGroupings.Intermediate,
    },
    {
        title: "F",
        grouping: ExerciseGroupings.Intermediate,
    },
    {
        title: "G",
        grouping: ExerciseGroupings.Advanced,
    },
    {
        title: "H",
        grouping: ExerciseGroupings.Advanced,
    },
    {
        title: "I",
        grouping: ExerciseGroupings.Advanced,
    },
]