export const development = false; // set to true for development

export const tuningSystems = [
    "Equal Temperament",
    "Just Intonation",
    "Harmonic Just Intonation",
    "Pythagorean Tuning",
    "Quarter-Comma Meantone Tuning",
    "Werckmeister III Tuning"
]

// TODO: these should be refactored into a single object, don't plan on it though
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

// Note that this is too similar to just intonation and only is applicable for higher complexities (TODO)
export const harmonicJustAdjustments = [
    0,
    11.7,
    3.91,
    15.6,
    -13.7,
    -1.95,
    -17.5,
    1.95,
    13.7,
    -15.6,
    -31.2,
    -11.7
]

export const pythagoreanAdjustments = [
    0,
    -9.77,
    3.91,
    -5.86,
    7.82,
    -1.95,
    11.7,
    1.95,
    -7.82,
    5.86,
    -3.91,
    9.77
]

export const quarterCommaMeantoneAdjustments = [
    0,
    -24,
    -6.8,
    10.3,
    -13.7,
    3.4,
    -20.5,
    -3.2,
    -27.4,
    -10.3,
    6.8,
    -17.1
]

export const werckmeisterIIIAdjustments = [
    0,
    -9.77,
    -7.82,
    -5.86,
    -9.77,
    -1.95,
    -11.7,
    -3.91,
    -7.82,
    -5.86,
    -3.91,
    -7.82
]

// TODO: replace with generating function
export const intervalDistances = [ // Used for feedback string, currently intervals up to 3 octaves
    "P1", "m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7",
    "P8", "m9", "M9", "m10", "M10", "P11", "TT", "P12", "m13", "M13", "m14", "M14",
    "P15", "m16", "M16", "m17", "M17", "P18", "TT", "P19", "m20", "M20", "m21", "M21"
]

export const degreeLabels = [ // Used for feedback string
    "Root", "Minor 2nd", "Major 2nd", "Minor 3rd", "Major 3rd", "4th", "Diminished 5th", "5th", "Augmented 5th", "Major 6th", "Minor 7th", "Major 7th",
    "Octave", "b9", "9", "#9", "Major 3rd", "4th", "#11", "5th", "b13"
]

export const sliderDisplayNames = {
    outOfTune: "Cents Out of Tune",
    size: "Size",
    range: "Range",
    complexity: "Notes in Chord"
}

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
