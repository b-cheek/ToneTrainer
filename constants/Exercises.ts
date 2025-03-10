
export enum ExerciseGroupings {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}

function randomMidi() {
    return Math.floor(Math.random() * 128);
}

export const Exercises = [
    {
        title: "Interval Tuning",
        grouping: ExerciseGroupings.Beginner,
        soundScript: `
        const synth0 = new Tone.Synth().toDestination();
        const synth1 = new Tone.Synth().toDestination();
        note0 = getRndInt(48, 79);
        note1 = note0 + getRndInt(-12, 12);
        synth0.triggerAttackRelease(Tone.Frequency(note0, "midi"), "2n");
        synth1.detune.value = 20;
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