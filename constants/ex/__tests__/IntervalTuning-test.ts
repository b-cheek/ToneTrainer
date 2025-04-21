import { IntervalTuning } from "../IntervalTuning"
import { getRndInt, getRndSign } from '@/utils/Math'
import { justIntonationAdjustments, intervalDistances } from "../../Values"

test("generateFeedback returns correct feedback", () => {
    const centsOutOfTune = getRndInt(1, 49 - Math.max(...justIntonationAdjustments));
    const difficulty = intervalDistances.length - 1;
    const intervalWidth = getRndInt(0, difficulty);
    const noteOffset = getRndSign() * intervalWidth;
    const regex = /: ([^,]*), (.*)/;
    const inTune = IntervalTuning.generateFeedback({ centsOutOfTune: 0, note0: 0, note1: noteOffset }).match(regex);
    const tooNarrow = IntervalTuning.generateFeedback({ centsOutOfTune: -centsOutOfTune, note0: 0, note1: noteOffset }).match(regex);
    const tooWide = IntervalTuning.generateFeedback({ centsOutOfTune: centsOutOfTune, note0: 0, note1: noteOffset }).match(regex);
    const interval = intervalDistances[intervalWidth];
    expect(inTune).not.toBeNull();
    expect(tooNarrow).not.toBeNull();
    expect(tooWide).not.toBeNull();
    expect(inTune!.slice(1)).toEqual([interval, "In Tune"]);
    expect(tooNarrow!.slice(1)).toEqual([interval, `Too Narrow (${centsOutOfTune} cents)`]);
    expect(tooWide!.slice(1)).toEqual([interval, `Too Wide (${centsOutOfTune} cents)`]);
})