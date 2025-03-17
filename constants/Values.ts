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

export const intervalDistances = [ // Currently for debugging maybe more later
    "P1",
    "m2",
    "M2",
    "m3",
    "M3",
    "P4",
    "TT",
    "P5",
    "m6",
    "M6",
    "m7",
    "M7",
]

export const outOfTuneDifficulty = { // Walues are minimum cent difference played when answer is out of tune
    easy: 30,
    intermediate: 15,
    advanced: 1
} // Note that a unison played 1 cent out of tune will "beat" at 1 Hz

export const IntervalSizeDifficulty = {
    easy: 11, // Intervals < 1 octave
    intermediate: 23,
    advanced: 35
}

export const IntervalRangeDifficulty = { // Values represent distance from middle C
    easy: 0, // Means one note in interval will always be middle C
    intermediate: 22,
    advanced: 44
} // Note that 44 is used to be roughly the complete range of a piano
