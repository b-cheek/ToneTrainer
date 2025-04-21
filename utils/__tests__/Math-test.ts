import { getRndNum, getRndInt, getRndSign, modulo } from "../Math"

test("getRndNum(1, 10) returns number in [1, 10)", () => {
    const num = getRndNum(1, 10);
    expect(num).toBeGreaterThanOrEqual(1);
    expect(num).toBeLessThan(10);
})

test("getRndInt(1, 10) returns integer in [1, 10]", () => {
    const int = getRndInt(1, 10);
    expect(int).toBeGreaterThanOrEqual(1);
    expect(int).toBeLessThanOrEqual(10);
});

test("getRndSign returns sign", () => {
    expect([1, -1]).toContain(getRndSign());
})

test("modulo returns valid remainder", () => {
    // From the conditions of Euclidean division
    const dividend = getRndNum(-10, 10);
    const divisor = getRndSign() * getRndNum(1, 10);
    const remainder = modulo(dividend, divisor);
    expect(Math.abs(remainder)).toBeLessThan(Math.abs(divisor));
    const quotient = (dividend - remainder) / divisor;
    expect(quotient).toBeCloseTo(Math.round(quotient));
});