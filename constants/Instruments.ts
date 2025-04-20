export type Instrument = {
    display_name: string
}

export const Instruments: Record<string, Instrument> = {
    "bassoon": { display_name: "Bassoon" },
    "cello": { display_name: "Cello" },
    "clarinet": { display_name: "Clarinet" },
    "contrabass": { display_name: "Bass" },
    "flute": { display_name: "Flute" },
    "french_horn": { display_name: "French Horn" },
    "piano": { display_name: "Piano" },
    "saxophone": { display_name: "Saxophone" },
    "trombone": { display_name: "Trombone" },
    "trumpet": { display_name: "Trumpet" },
    "tuba": { display_name: "Tuba" },
    "violin": { display_name: "Violin" }
};