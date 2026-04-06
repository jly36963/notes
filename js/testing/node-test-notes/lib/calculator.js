export default class Calculator {
  // ---
  // Basic
  // ---

  /** Add two numbers */
  add(a, b) {
    return a + b;
  }
  /** Subtract two numbers */
  subtract(a, b) {
    return a - b;
  }
  /** Multiply two numbers */
  multiply(a, b) {
    return a * b;
  }
  /** Divide two numbers */
  divide(a, b) {
    return a / b;
  }

  // ---
  // Aggregations
  // ---

  /** Get the sum of the provided numbers */
  getSum(numbers) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
  }
  /** Get the product of the provided numbers */
  getProduct(numbers) {
    return numbers.reduce((acc, curr) => acc * curr, 1);
  }
  /** Get the mean of the provided numbers */
  getMean(numbers) {
    return numbers?.length ? this.getSum(numbers) / numbers.length : Number.NaN;
  }
  /** Get the standard deviation of the provided numbers */
  getStd(numbers, completeSample = false) {
    const n = numbers?.length;
    if (!n) {
      return Number.NaN;
    }
    const mean = this.getMean(numbers);
    const sumOfSquaredDiffs = numbers.reduce(
      (acc, curr) => acc + Math.pow(curr - mean, 2),
      0,
    );
    const populationSize = completeSample ? n : n - 1;
    const std = Math.sqrt(sumOfSquaredDiffs / populationSize);
    return std;
  }

  // ---
  // Random
  // ---

  /** Pretend to get a random integer asynchronously */
  async randInt(max) {
    await new Promise((r) => setTimeout(r, 10));
    return Math.ceil(Math.random() * max);
  }
}
