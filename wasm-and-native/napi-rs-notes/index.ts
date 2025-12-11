// import * as thing from "./pkg/index.js";
import { randomUUID } from "node:crypto";
import {
  add,
  getPerson,
  greet,
  optionalGreet,
  range,
  simpleGreet,
  timedOperation,
} from "./pkg/index.js";

// import {
//   add,
//   getPerson,
//   greet,
//   optional_greet,
//   range,
//   simple_greet,
//   timedOperation,
// } from "./index.js";

// ---
// Types
// ---

interface Person {
  firstName: string;
  lastName: string;
  age: number;
}

// ---
// Main
// ---

async function main() {
  printSectionTitle("simple numeric arguments");
  simpleNumericArguments();

  printSectionTitle("vec return type");
  vecReturnType();

  printSectionTitle("logging");
  logging();

  printSectionTitle("optional args");
  optionalArgs();

  printSectionTitle("use console time");
  useConsoleTime();

  printSectionTitle("struct args");
  structArgument();

  printSectionTitle("struct return");
  structReturn();
}

// ---
// Utils
// ---

function printSectionTitle(title: string): void {
  console.log(`\n${title.toUpperCase()}\n`);
}

// ---
// Examples
// ---

function simpleNumericArguments() {
  const addResult = add(24, 24);
  console.log(addResult);
}

function vecReturnType() {
  const rangeResult = range(0, 11, 2);
  console.log(rangeResult);
}

function logging() {
  simpleGreet("Kakashi");
}

function optionalArgs() {
  optionalGreet();
  optionalGreet("Kakashi");
}

function useConsoleTime() {
  const value = timedOperation(100);
  console.log(value);
}

function structArgument() {
  const person: Person = { firstName: "Kakashi", lastName: "Hatake", age: 27 };
  const greeting = greet(person);
  console.log(greeting);

  try {
    // Will fail, structural mismatch of JsValue (not a Person)
    // @ts-expect-error: Intentional mistake
    greet({ a: 1, b: 2 });
  } catch (err) {
    console.log(err);
  }
}

function structReturn() {
  const id = randomUUID();
  const person: Person = getPerson(id);
  console.log(person);

  try {
    // Will fail, invalid uuid
    getPerson("abcde");
  } catch (err) {
    console.log(err);
  }
}

// ---
// Run
// ---

main();
