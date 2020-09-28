// -----------
// typescript basics
// -----------

// page
// https://www.typescriptlang.org/

// playground
// https://www.typescriptlang.org/play/index.html

// install
// npm i -g typescript

// compile
// tsc helloworld.ts

// -----------
// declarations
// -----------

const firstName: string = "Kakashi";
const greeting: string = `Hello, ${firstName}!`;
console.log(greeting);

// -----------
// types
// -----------

// boolean
const isDone: boolean = true;
// number
const n: number = 6;
// string
const yamato: string = "Yamato";
// array
const jonin: string[] = ["Kakashi", "Yamato", "Itachi"];
const hokage: Array<string> = ["Hiruzen", "Kakashi", "Tsunade"];
// tuple
const answer: [boolean, boolean, boolean] = [true, true, true];
// enum
// ...
// any
const response: any = { data: { message: "Hi!" }, error: null };
// null
const nothing: null = null;
// undefined
const notDefined: undefined = undefined;
// object
const itachi: object = { firstName: "Itachi", lastName: "Uchiha" };

// -----------
// functions
// -----------

// https://www.typescriptlang.org/docs/handbook/functions.html

// normal function declaration
function greetPerson(person: string): string {
  return `Hello, ${person}`;
}

// anonymous
const subtract = function (x: number, y: number): number {
  return x - y;
};

// arrow
const add = (x: number, y: number): number => x + y;

// void
const say = (message: string): void => console.log(message); // no return value

// object
const readKeys = (obj: object): string[] => Object.keys(obj);

// -----------
// classes
// -----------

class Person {
  fullName: string;
  constructor(public firstName: string, public lastName: string) {
    this.fullName = `${firstName} ${lastName}`;
  }
  greet(): string {
    return `Hello, my name is ${this.firstName}`;
  }
  greetFull(): string {
    return `Hello, my name is ${this.fullName}`;
  }
}

let kakashi = new Person("Kakashi", "Hatake");
kakashi.greetFull();

// -----------
// interfaces
// -----------

// basic

interface Person {
  firstName: string;
  lastName: string;
}

const greet = (person: Person) => {
  const { firstName, lastName } = person;
  return `Hello, ${firstName} ${lastName}!`;
};

// optional

interface Person {
  firstName: string;
  lastName?: string;
}

const greet = (person: Person) => {
  const { firstName, lastName } = person;
  return lastName ? `Hello, ${firstName} ${lastName}!` : `Hello, ${firstName}!`;
};

// read only (prevents re-assignment)

interface Person {
  readonly firstName: string;
  readonly lastName?: string;
}

const greet = (person: Person) => {
  const { firstName, lastName } = person;
  return lastName ? `Hello, ${firstName} ${lastName}!` : `Hello, ${firstName}!`;
};

// extra properties

interface Person {
  firstName: string;
  lastName?: string;
  [propName: string]: any; // allow additional properties
}

// describe a function (specify params and return type)

interface SearchFunc {
  (source: string, subString: string): boolean;
}

// extends

interface Person {
  id: number;
  name: string;
}

interface Ninja extends Person {
  village: string;
}

// indexable types
interface ArrayOfStrings {
  [index: number]: string; // an index of type number will return a string value.
}

// classes
// https://www.typescriptlang.org/docs/handbook/interfaces.html#class-types

// hybrid types (function and object)
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function (start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
