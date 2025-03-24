export const justIntonationAdjustments = [
    0,
    11.7,
    3.91,
    15.6,
    -13.7,
    -1.95,
    -9.78,
    1.95,
    13.7,
    -15.6,
    -3.91,
    -11.7,
] // Note mirrored after TT inverting intervals

export const intervalDistances = [ // Used for feedback string, currently intervals up to 3 octaves
    "P1", "m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7",
    "P8", "m9", "M9", "m10", "M10", "P11", "TT", "P12", "m13", "M13", "m14", "M14",
    "P15", "m16", "M16", "m17", "M17", "P18", "TT", "P19", "m20", "M20", "m21", "M21"
]

export type DifficultyLevel = 'easy' | 'intermediate' | 'advanced';

export const difficultyLevelString: Record<DifficultyLevel, DifficultyLevel> = {
    easy: "easy",
    intermediate: "intermediate",
    advanced: "advanced"
} as const;

// May use this instead for all chords because of how tuning deviates from just intonation intervals
export const chords = {
    diminished: {
        title: "Diminished Triad",
        shape: [3, 6],
        tuning: []
    },

    diminishedFlat6: {
        title: "Diminished Flat 6",
        shape: [3, 6, 8],
        tuning: []
    },

    diminished7: {
        title: "Diminished 7",
        shape: [3, 6, 9],
        tuning: []
    },
    halfDiminished7: {
        title: "Half Diminished 7",
        shape: [3, 6, 10],
        tuning: []
    },

    diminishedMajor7: {
        title: "Diminished Major 7",
        shape: [3, 6, 11],
        tuning: []
    },

    minor: {
        title: "Minor Triad",
        shape: [3, 7],
        tuning: []
    },

    minor7: {
        title: "Minor 7",
        shape: [3, 7, 10],
        tuning: []
    },
    minor9: {
        title: "Minor 9",
        shape: [3, 7, 10, 14],
        tuning: []
    },
    minor11: {
        title: "Minor 11",
        shape: [3, 7, 10, 14, 17],
        tuning: []
    },
    minor13: {
        title: "Minor 13",
        shape: [3, 7, 10, 14, 17, 21],
        tuning: []
    },

    minor6: {
        title: "Minor 6",
        shape: [3, 7, 9],
        tuning: []
    },

    minorMajor7: {
        title: "Minor Major 7",
        shape: [3, 7, 11],
        tuning: []
    },
    minorMajor9: {
        title: "Minor Major 9",
        shape: [3, 7, 11, 14],
        tuning: []
    },
    minorMajor11: {
        title: "Minor Major 11",
        shape: [3, 7, 11, 14, 17],
        tuning: []
    },
    minorMajor13: {
        title: "Minor Major 13",
        shape: [3, 7, 11, 14, 17],
        tuning: []
    },

    major: {
        title: "Major Triad",
        shape: [4, 7],
        tuning: []
    },

    dominant7: {
        title: "Dominant 7",
        shape: [4, 7, 10],
        tuning: []
    },
    dominant9: {
        title: "Dominant 9",
        shape: [4, 7, 10, 14],
        tuning: []
    },
    dominant7Flat9: {
        title: "Dominant 7 Flat 9",
        shape: [4, 7, 10, 13],
        tuning: []
    },
    dominant7Sharp9: {
        title: "Dominant 7 Sharp 9",
        shape: [4, 7, 10, 15],
        tuning: []
    },
    dominant11: {
        title: "Dominant 11",
        shape: [4, 7, 10, 14, 17],
        tuning: []
    },
    dominant7Sharp11: {
        title: "Dominant 7 Sharp 11",
        shape: [4, 7, 10, 14, 18],
        tuning: []
    },
    dominant13: {
        title: "Dominant 13",
        shape: [4, 7, 10, 14, 17, 21],
        tuning: []
    },
    dominant7Flat13: {
        title: "Dominant 7 Flat 13",
        shape: [4, 7, 10, 14, 20],
        tuning: []
    },

    major6: {
        title: "Major 6",
        shape: [4, 7, 9],
        tuning: []
    },
    major69: {
        title: "Major 6/9",
        shape: [4, 7, 9, 14],
        tuning: []
    },

    major7: {
        title: "Major 7",
        shape: [4, 7, 11],
        tuning: []
    },
    major9: {
        title: "Major 9",
        shape: [4, 7, 11, 14],
        tuning: []
    },
    major11: {
        title: "Major 11",
        shape: [4, 7, 11, 14, 17],
        tuning: []
    },
    major7Sharp11: {
        title: "Major 7 Sharp 11",
        shape: [4, 7, 11, 14, 18],
        tuning: []
    },
    major13: {
        title: "Major 13",
        shape: [4, 7, 11, 14, 17, 21],
        tuning: []
    },
    major13Sharp11: {
        title: "Major 13 Sharp 11",
        shape: [4, 7, 11, 14, 18, 21],
        tuning: []
    },

    augmented: {
        title: "Augmented Triad",
        shape: [4, 8],
        tuning: []
    },

    augmented7: {
        title: "Augmented 7",
        shape: [4, 8, 10],
        tuning: []
    },
    augmentedMajor7: {
        title: "Augmented Major 7",
        shape: [4, 8, 11],
        tuning: []
    },

    sus2: {
        title: "Suspended 2",
        shape: [2, 7],
        tuning: []
    },
    sus4: {
        title: "Suspended 4",
        shape: [5, 7],
        tuning: []
    }
};
