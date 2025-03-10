
export enum ExerciseGroupings {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}

export const Exercises = [
    {
        title: "A",
        grouping: ExerciseGroupings.Beginner,
        soundScript: `
        const synth = new Tone.Synth().toDestination();
        const now = Tone.now();
        synth.triggerAttackRelease("C4", "8n");
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