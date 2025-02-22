import { randomUUID } from "node:crypto";
import {
  add,
  get_person,
  greet,
  optional_greet,
  range,
  simple_greet,
  timed_operation,
} from "./pkg/node_wasm_notes.js";

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

  printSectionTitle("using console log");
  usingConsoleLog();

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

function usingConsoleLog() {
  simple_greet("Kakashi");
}

function optionalArgs() {
  optional_greet();
  optional_greet("Kakashi");
}

function useConsoleTime() {
  const value = timed_operation(100);
  console.log(value);
}

function structArgument() {
  const person: Person = { firstName: "Kakashi", lastName: "Hatake", age: 27 };
  const greeting = greet(person);
  console.log(greeting);

  try {
    // Will fail, structural mismatch of JsValue (not a Person)
    greet({ a: 1, b: 2 });
  } catch (err) {
    console.log(err);
  }
}

function structReturn() {
  const id = randomUUID();
  const person: Person = get_person(id);
  console.log(person);

  try {
    // Will fail, invalid uuid
    get_person("abcde");
  } catch (err) {
    console.log(err);
  }
}

// ---
// Run
// ---

main();
