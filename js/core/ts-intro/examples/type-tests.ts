import assert from "node:assert";
import type { Equal, Expect } from "../types/index.ts";

// ---
// Functional programming
// ---

// Concepts
// Cons list (head :: tail)
// Recursion (drain input and populate output, exit when complete. ie: fold/reduce)
// Immutability
// Pure
// Expression based

const mapRec = <T, U>(
  values: Array<T>,
  func: (v: T) => U,
  results: Array<U> = [],
): Array<U> => {
  if (!values.length) {
    return results;
  }
  const [head, ...tail] = values;
  return mapRec(tail, func, [...results, func(head)]);
};

/** Map an array of elements (T) to another array of elements (U). */
const map = <T, U>(values: Array<T>, func: (v: T) => U): Array<U> =>
  mapRec(values, func);

function simpleFP() {
  const values = [1, 2, 3, 4, 5];
  const result = map(values, (v) => v ** 2);
  const expected = [1, 4, 9, 16, 25];
  assert.deepStrictEqual(result, expected);

  console.log(`values: ${values}`);
  console.log(`result: ${result}`);
}

// ---
// Complex generics
// ---

/**
 * Reverses a string.
 * - `T` The string to reverse.
 */
type Reverse<
  T extends string,
  _acc extends string = "",
> = T extends `${infer Head}${infer Tail}`
  ? Reverse<Tail, `${Head}${_acc}`>
  : _acc extends ""
    ? T
    : `${T}${_acc}`;

/**
 * A strongly-typed function to reverse a string.
 * @param str the string to reverse.
 * @returns the reversed string in both type level and runtime.
 * @example reverse('hello world') // 'dlrow olleh'
 */
function reverse<T extends string>(str: T) {
  return str.split("").reverse().join("") as Reverse<T>;
}

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars */
namespace _ReverseTests {
  type _test1 = Expect<Equal<Reverse<"hello">, "olleh">>;
  type _test2 = Expect<Equal<Reverse<"123">, "321">>;
  type _test3 = Expect<
    Equal<Reverse<"I love TypeScript!">, "!tpircSepyT evol I">
  >;
  type _test4 = Expect<Equal<Reverse<string>, string>>;
  type _test5 = Expect<Equal<Reverse<Uppercase<string>>, Uppercase<string>>>;

  // Template strings
  type _testTS1 = Expect<Equal<Reverse<`abc${string}`>, `${string}cba`>>;
  type _testTS2 = Expect<Equal<Reverse<`abc${string}xyz`>, `zyx${string}cba`>>;
  type _testTS3 = Expect<Equal<Reverse<`${string}xyz`>, `zyx${string}`>>;
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars */

function complexGenerics() {
  const input = "hello";
  const output = reverse(input);
  const expected = "olleh";
  assert(output === expected);
  console.log(`The reverse of "${input}" is "${output}"`);
}

// ---
// Main
// ---

function main() {
  simpleFP();
  complexGenerics();
}

main();
