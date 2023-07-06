// ---
// Typescript basics
// ---

// ---
// Declarations
// ---

const basicDeclarations = () => {
  const firstName: string = "Kakashi";
  const greeting: string = `Hello, ${firstName}!`;
  console.log(greeting);
};

// ---
// Types
// ---

const basicTypes = () => {
  // boolean
  const isPositive = (n: number): boolean => n > 0;
  const positive = isPositive(11);
  console.log(`bool example: ${positive}`);

  // number
  const getLength = (val: any): number => val?.length ?? 0;
  const len = getLength([1, 2, 3]);
  console.log(`number example: ${len}`);

  // string
  const clean = (s: string): string => s.toLowerCase().trim();
  const cleaned = clean(" Yamato ");
  console.log(`string example: ${cleaned}`);

  // array (Array<T> or T[])
  const getLast = function <T>(arr: T[]): T | null {
    return arr.length ? arr[arr.length - 1] : null;
  };
  const jonin: string[] = ["Kakashi", "Yamato", "Itachi"];
  const lastJonin = getLast(jonin);
  console.log(`array example: ${lastJonin}`);

  // tuple
  type personTuple = [string, string, number];
  const kakashi: personTuple = ["Kakashi", "Hatake", 27];
  console.log(`tuple example: ${kakashi}`);

  // object
  const readKeys = (obj: object): string[] => Object.keys(obj);
  const itachi: object = { firstName: "Itachi", lastName: "Uchiha" };
  const objKeys = readKeys(itachi);
  console.log(`object example: ${objKeys}`);
};

// ---
// Functions
// ---

const basicFunctions = () => {
  // Normal function declaration
  function greetPerson(person: string): string {
    return `Hello, ${person}`;
  }
  console.log("greet result", greetPerson("Kakashi"));

  // Anonymous
  const subtract = function (x: number, y: number): number {
    return x - y;
  };
  console.log("subtract result", subtract(11, 7));

  // Arrow
  const add = (x: number, y: number): number => x + y;
  console.log("add result", add(4, 7));

  // Void
  const say = (message: string): void => console.log(message); // no return value
  say("hello");
};

// ---
// Union types
// ---

// Type unions require type-narrowing to use type-specific properties/methods

const basicUnionTypes = () => {
  type nil = null | undefined;
  const greet = (name: string | nil) =>
    name ? `Hello ${name.trim()}!` : "Hello friend!";
  console.log(greet("Kakashi"));
};

// ---
// Literals
// ---

const basicLiterals = () => {
  type DayOfWeek = "Mon" | "Tues" | "Wed" | "Thur" | "Fri" | "Sat" | "Sun";
  const day: DayOfWeek = "Fri";
  console.log(`My favorite day of the week is ${day}`);
};

// ---
// Classes
// ---

const basicClasses = () => {
  // Define class
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

  // Instantiate class
  const kakashi = new Person("Kakashi", "Hatake");
  console.log(kakashi.greetFull());
};

// ---
// Interfaces
// ---

const basicInterfaces = () => {
  // Interface
  interface Person {
    firstName: string;
    lastName: string;
    age?: number; // Optional
  }
  const greetPerson = (person: Person) => {
    const { firstName, lastName } = person;
    return `Hello, ${firstName} ${lastName}!`;
  };
  const person = {
    firstName: "Kakashi",
    lastName: "Hatake",
    age: 27,
  };
  console.log(greetPerson(person));
};

// ---
// Helpers
// ---

const printSectionTitle = (title: string) => {
  console.log("\n" + title.toUpperCase() + "\n");
};

// ---
// Main
// ---

const main = () => {
  printSectionTitle("basic declarations");
  basicDeclarations();

  printSectionTitle("basic types");
  basicTypes();

  printSectionTitle("basic functions");
  basicFunctions();

  printSectionTitle("basic union types");
  basicUnionTypes();

  printSectionTitle("basic literals");
  basicLiterals();

  printSectionTitle("basic classes");
  basicClasses();

  printSectionTitle("basic interfaces");
  basicInterfaces();
};

main();
