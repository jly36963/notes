import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from 'node:test';
import { expect } from "chai";
import { expect as jestExpect } from "expect";
import sinon from "sinon";
import Calculator from "../lib/calculator.js";

// Two syntaxes:
// "test" & "t" (test module)
// "describe" & "it" (mocha-like)

describe("Calculator", () => {
  let c;

  beforeEach(() => {
    // Setup
    c = new Calculator();
    // Stub method
    sinon.stub(c, "randInt").resolves(27);
  });

  afterEach(() => {
    // Restore stub
    c.randInt.restore && c.randInt.restore();
  });

  it("add", () => {
    const result = c.add(1, 2);
    const expected = 3;
    assert.strictEqual(result, expected);
    expect(result).to.equal(expected);
    jestExpect(result).toBe(expected);
  });
  it("subtract", () => {
    const result = c.subtract(1, 2);
    const expected = -1;
    assert.strictEqual(result, expected);
    expect(result).to.equal(expected);
    jestExpect(result).toBe(expected);
  });
  it("multiply", () => {
    const result = c.multiply(1, 2);
    const expected = 2;
    assert.strictEqual(result, expected);
    expect(result).to.equal(expected);
    jestExpect(result).toBe(expected);
  });
  it("divide", () => {
    const result = c.divide(1, 2);
    const expected = .5;
    assert.strictEqual(result, expected);
    expect(result).to.equal(expected);
    jestExpect(result).toBe(expected);
  });
  it("getSum", () => {
    const result = c.getSum([1, 2, 3, 4]);
    const expected = 10;
    assert.strictEqual(result, expected);
    expect(result).to.equal(expected);
    jestExpect(result).toBe(expected);
  });
  it("getProduct", () => {
    const result = c.getProduct([1, 2, 3, 4]);
    const expected = 24;
    assert.strictEqual(result, expected);
    expect(result).to.equal(expected);
    jestExpect(result).toBe(expected);
  });
  it("getMean", () => {
    const result = c.getMean([1, 2, 3, 4]);
    const expected = 2.5;
    assert.strictEqual(result, expected);
    expect(result).to.equal(expected);
    jestExpect(result).toBe(expected);
  });
  describe("getStd", () => {
    it("incomplete sample", () => {
      const result = c.getStd([1, 2, 3, 4]);
      const expected = 1.2909944487358056;
      assertAlmostEquals(result, expected);
      expect(result).to.be.closeTo(expected, .0001);
      jestExpect(result).toBeCloseTo(expected, 4);
    });
    it("complete sample", () => {
      const result = c.getStd([1, 2, 3, 4], true);
      const expected = 1.118033988749895;
      assertAlmostEquals(result, expected);
      expect(result).to.be.closeTo(expected, .0001);
      jestExpect(result).toBeCloseTo(expected, 4);
    });
  });
  it("randInt", async () => {
    const result = await c.randInt(100);
    const expected = 27;
    assert.strictEqual(result, expected);
    expect(result).to.equal(expected);
    jestExpect(result).toBe(expected);
  });
});

/** Assert to floats are equal to n decimal places */
function assertAlmostEquals(a, b, precision = 7) {
  const diff = a - b;
  diff.toFixed(precision);
  if (diff !== 0) {
    throw new Error("Values are not equal");
  }
}
