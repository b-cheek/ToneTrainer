export const justIntonationAdjustments = {
    0: 0,
    1: 11.7,
    2: 3.91,
    3: 15.6,
    4: -13.7,
    5: -1.95,
    6: -9.78,
    7: 1.95,
    8: -9.78
} // Note mirrored after TT inverting intervals

export const outOfTuneDifficulty = { // Walues are minimum cent difference played when answer is out of tune
    easy: 20,
    intermediate: 10,
    advanced: 1
} // Note that a unison played 1 cent out of tune will "beat" at 1 Hz

export const IntervalSizeDifficulty = {
    easy: 12,
    intermediate: 24,
    advanced: 36
}

export const IntervalRangeDifficulty = { // Values represent distance from middle C
    easy: 0,
    intermediate: 22,
    advanced: 44
} // Note that 44 is used to be roughly the complete range of a piano
