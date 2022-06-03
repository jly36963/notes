import {
  assertAlmostEquals,
  // testing/asserts
  assertEquals,
  afterEach,
  beforeEach,
  // testing/bdd
  describe,
  it,
  // testing/mock
  stub,
  returnsNext,
} from "../../deps.ts";
import Calculator from "../../lib/calculator.ts";

describe("Calculator", () => {
  let c = new Calculator();
  let randIntStub = stub(c, "randInt", returnsNext([Promise.resolve(27)]));

  beforeEach(() => {
    // Reset calculator
    c = new Calculator();
    // Stubs
    randIntStub = stub(c, "randInt", returnsNext([Promise.resolve(27)]));
  });

  afterEach(() => {
    // Restore stubs
    randIntStub.restore()
  })

  it("add", () => {
    const result = c.add(1, 2);
    assertEquals(result, 3);
  });
  it("subtract", () => {
    const result = c.subtract(1, 2);
    assertEquals(result, -1);
  });
  it("multiply", () => {
    const result = c.multiply(1, 2);
    assertEquals(result, 2);
  });
  it("divide", () => {
    const result = c.divide(1, 2);
    assertEquals(result, .5);
  });
  it("getSum", () => {
    const result = c.getSum([1, 2, 3, 4]);
    assertEquals(result, 10);
  });
  it("getProduct", () => {
    const result = c.getProduct([1, 2, 3, 4]);
    assertEquals(result, 24);
  });
  it("getMean", () => {
    const result = c.getMean([1, 2, 3, 4]);
    assertEquals(result, 2.5);
  });
  describe("getStd", () => {
    it("incomplete sample", () => {
      const result = c.getStd([1, 2, 3, 4]);
      assertAlmostEquals(result, 1.2909944487358056);
    });
    it("complete sample", () => {
      const result = c.getStd([1, 2, 3, 4], true);
      assertAlmostEquals(result, 1.118033988749895);
    });
  });
  it("randInt", async () => {
    const result = await c.randInt(100);
    assertEquals(result, 27)
  });
});
