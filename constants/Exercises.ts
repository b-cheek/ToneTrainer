
export enum ExerciseGroupings {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}

export const Exercises = [
    {
        title: "Interval Tuning",
        grouping: ExerciseGroupings.Beginner,
        soundScript: `
        const sampler = new Tone.Sampler({
            urls: {
                A4: "A4.mp3",
                C3: "C3.mp3",
                C4: "C4.mp3",
                C5: "C5.mp3",
                E4: "E4.mp3",
                G2: "G2.mp3",
                G3: "G3.mp3",
                G4: "G4.mp3",
                A2: "A2.mp3",
                A3: "A3.mp3"
            },
            baseUrl: "https://github.com/nbrosowsky/tonejs-instruments/blob/master/samples/bassoon/",
            onload: () => {
                sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
            }
        }).toDestination();
        /*
        const synth0 = new Tone.Synth().toDestination();
        const synth1 = new Tone.Synth().toDestination();
        note0 = getRndInt(48, 79);
        note1 = note0 + getRndInt(-12, 12);
        synth0.triggerAttackRelease(Tone.Frequency(note0, "midi"), "2n");
        synth1.detune.value = 20;
        synth1.triggerAttackRelease(Tone.Frequency(note1, "midi"), "2n");
        */
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