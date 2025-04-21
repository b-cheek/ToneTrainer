import { justIntonationAdjustments } from "../Values"

test("justIntonationAdjustments are mirrored after tritone", () => {
    expect(justIntonationAdjustments.slice(7)).toEqual(justIntonationAdjustments.slice(1, 6).reverse().map(adjustment => -adjustment));
})