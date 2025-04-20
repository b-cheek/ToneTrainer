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

export const degreeLabels = [ // Used for feedback string
    "Root", "Minor 2nd", "Major 2nd", "Minor 3rd", "Major 3rd", "4th", "Diminished 5th", "5th", "Augmented 5th", "Major 6th", "Minor 7th", "Major 7th",
    "Octave", "b9", "9", "#9", "Major 3rd", "4th", "#11", "5th", "b13"
]

// May use this instead for all chords because of how tuning deviates from just intonation intervals

export const chords = [
    {
        title: "Diminished Triad",
        shape: [3, 6],
        tuning: []
    },
    {
        title: "Diminished Flat 6",
        shape: [3, 6, 8],
        tuning: []
    },
    {
        title: "Diminished 7",
        shape: [3, 6, 9],
        tuning: []
    },
    {
        title: "Half Diminished 7",
        shape: [3, 6, 10],
        tuning: []
    },
    {
        title: "Diminished Major 7",
        shape: [3, 6, 11],
        tuning: []
    },
    {
        title: "Minor Triad",
        shape: [3, 7],
        tuning: []
    },
    {
        title: "Minor 7",
        shape: [3, 7, 10],
        tuning: []
    },
    {
        title: "Minor 9",
        shape: [3, 7, 10, 14],
        tuning: []
    },
    {
        title: "Minor 11",
        shape: [3, 7, 10, 14, 17],
        tuning: []
    },
    {
        title: "Minor 13",
        shape: [3, 7, 10, 14, 17, 21],
        tuning: []
    },
    {
        title: "Minor 6",
        shape: [3, 7, 9],
        tuning: []
    },
    {
        title: "Minor Major 7",
        shape: [3, 7, 11],
        tuning: []
    },
    {
        title: "Minor Major 9",
        shape: [3, 7, 11, 14],
        tuning: []
    },
    {
        title: "Minor Major 11",
        shape: [3, 7, 11, 14, 17],
        tuning: []
    },
    {
        title: "Minor Major 13",
        shape: [3, 7, 11, 14, 17],
        tuning: []
    },
    {
        title: "Major Triad",
        shape: [4, 7],
        tuning: []
    },
    {
        title: "Dominant 7",
        shape: [4, 7, 10],
        tuning: []
    },
    {
        title: "Dominant 9",
        shape: [4, 7, 10, 14],
        tuning: []
    },
    {
        title: "Dominant 7 Flat 9",
        shape: [4, 7, 10, 13],
        tuning: []
    },
    {
        title: "Dominant 7 Sharp 9",
        shape: [4, 7, 10, 15],
        tuning: []
    },
    {
        title: "Dominant 11",
        shape: [4, 7, 10, 14, 17],
        tuning: []
    },
    {
        title: "Dominant 7 Sharp 11",
        shape: [4, 7, 10, 14, 18],
        tuning: []
    },
    {
        title: "Dominant 13",
        shape: [4, 7, 10, 14, 17, 21],
        tuning: []
    },
    {
        title: "Dominant 7 Flat 13",
        shape: [4, 7, 10, 14, 20],
        tuning: []
    },
    {
        title: "Major 6",
        shape: [4, 7, 9],
        tuning: []
    },
    {
        title: "Major 6/9",
        shape: [4, 7, 9, 14],
        tuning: []
    },
    {
        title: "Major 7",
        shape: [4, 7, 11],
        tuning: []
    },
    {
        title: "Major 9",
        shape: [4, 7, 11, 14],
        tuning: []
    },
    {
        title: "Major 11",
        shape: [4, 7, 11, 14, 17],
        tuning: []
    },
    {
        title: "Major 7 Sharp 11",
        shape: [4, 7, 11, 14, 18],
        tuning: []
    },
    {
        title: "Major 13",
        shape: [4, 7, 11, 14, 17, 21],
        tuning: []
    },
    {
        title: "Major 13 Sharp 11",
        shape: [4, 7, 11, 14, 18, 21],
        tuning: []
    },
    {
        title: "Augmented Triad",
        shape: [4, 8],
        tuning: []
    },
    {
        title: "Augmented 7",
        shape: [4, 8, 10],
        tuning: []
    },
    {
        title: "Augmented Major 7",
        shape: [4, 8, 11],
        tuning: []
    },
    {
        title: "Suspended 2",
        shape: [2, 7],
        tuning: []
    },
    {
        title: "Suspended 4",
        shape: [5, 7],
        tuning: []
    }
];

export const instrumentDisplayNames = {
    bassoon: "Bassoon",
    cello: "Cello",
    clarinet: "Clarinet",
    contrabass: "Bass",
    flute: "Flute",
    french_horn: "French Horn",
    piano: "Piano",
    saxophone: "Saxophone",
    synthesizer: "Synthesizer",
    trombone: "Trombone",
    trumpet: "Trumpet",
    tuba: "Tuba",
    violin: "Violin"
};

export const midiToAbc = [
    'C,,,,,', '_D,,,,,', 'D,,,,,', '_E,,,,,', 'E,,,,,', 'F,,,,,', '_G,,,,,', 'G,,,,,', '_A,,,,,', 'A,,,,,', '_B,,,,,', 'B,,,,,',
    'C,,,,', '_D,,,,', 'D,,,,', '_E,,,,', 'E,,,,', 'F,,,,', '_G,,,,', 'G,,,,', '_A,,,,', 'A,,,,', '_B,,,,', 'B,,,,',
    'C,,,', '_D,,,', 'D,,,', '_E,,,', 'E,,,', 'F,,,', '_G,,,', 'G,,,', '_A,,,', 'A,,,', '_B,,,', 'B,,,',
    'C,,', '_D,,', 'D,,', '_E,,', 'E,,', 'F,,', '_G,,', 'G,,', '_A,,', 'A,,', '_B,,', 'B,,',
    'C,', '_D,', 'D,', '_E,', 'E,', 'F,', '_G,', 'G,', '_A,', 'A,', '_B,', 'B,',
    'C', '_D', 'D', '_E', 'E', 'F', '_G', 'G', '_A', 'A', '_B', 'B',
    'c', '_d', 'd', '_e', 'e', 'f', '_g', 'g', '_a', 'a', '_b', 'b',
    "c'", "_d'", "d'", "_e'", "e'", "f'", "_g'", "g'", "_a'", "a'", "_b'", "b'",
    "c''", "_d''", "d''", "_e''", "e''", "f''", "_g''", "g''", "_a''", "a''", "_b''", "b''",
    "c'''", "_d'''", "d'''", "_e'''", "e'''", "f'''", "_g'''", "g'''", "_a'''", "a'''", "_b'''", "b'''",
    "c''''", "_d''''", "d''''", "_e''''", "e''''", "f''''", "_g''''", "g''''"
]

// Note midi range is 0-127 C-1 to G9