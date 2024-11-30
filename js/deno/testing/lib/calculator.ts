import { delay } from "async";

export default class Calculator {
  /** Add two numbers */
  add(a: number, b: number): number {
    return a + b;
  }
  /** Subtract two numbers */
  subtract(a: number, b: number): number {
    return a - b;
  }
  /** Multiply two numbers */
  multiply(a: number, b: number): number {
    return a * b;
  }
  /** Divide two numbers */
  divide(a: number, b: number): number {
    return a / b;
  }

  /** Get the sum of the provided numbers */
  getSum(numbers: number[]): number {
    return numbers.reduce((acc, curr) => acc + curr, 0);
  }
  /** Get the product of the provided numbers */
  getProduct(numbers: number[]): number {
    return numbers.reduce((acc, curr) => acc * curr, 1);
  }
  /** Get the mean of the provided numbers */
  getMean(numbers: number[]): number {
    return numbers?.length ? this.getSum(numbers) / numbers.length : Number.NaN;
  }
  /** Get the standard deviation of the provided numbers */
  getStd(numbers: number[], completeSample = false): number {
    const n = numbers?.length;
    if (!n) {
      return Number.NaN;
    }
    const mean = this.getMean(numbers);
    const sumOfSquaredDiffs = numbers.reduce(
      (acc, curr) => acc + (curr - mean) ** 2,
      0,
    );
    const populationSize = completeSample ? n : n - 1;
    const std = Math.sqrt(sumOfSquaredDiffs / populationSize);
    return std;
  }

  /** Pretend to get a random integer asynchronously */
  async randInt(max: number): Promise<number> {
    await delay(10);
    return Math.ceil(Math.random() * max);
  }
}
