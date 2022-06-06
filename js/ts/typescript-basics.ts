// ---
// typescript basics
// ---

// page
// https://www.typescriptlang.org/

// playground
// https://www.typescriptlang.org/play/index.html

// install
// npm i -g typescript

// compile
// tsc helloworld.ts

// ---
// declarations
// ---

const basicDeclarations = () => {
  const firstName: string = "Kakashi";
  const greeting: string = `Hello, ${firstName}!`;
  console.log(greeting);
}

// ---
// types
// ---

const basicTypes = () => {
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
}

// ---
// functions
// ---

// https://www.typescriptlang.org/docs/handbook/functions.html
const basicFunctions = () => {
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
}

// ---
// classes
// ---

// https://www.typescriptlang.org/docs/handbook/interfaces.html#class-types

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
  kakashi.greetFull();
}

// ---
// union types
// ---

// type unions require type-narrowing to use type-specific properties/methods

const basicUnionTypes = () => {
  type nil = null | undefined
  const greet = (name: string | nil) => name 
    ? `Hello ${name.trim()}!`
    : "Hello friend!"

}

// ---
// interfaces
// ---

const basicInterfaces = () => {
  interface Person {
    firstName: string;
    lastName: string;
    age?: number; // optional
  }

  const greetPerson = (person: Person) => {
    const { firstName, lastName } = person;
    return `Hello, ${firstName} ${lastName}!`;
  };

  // Extends
  interface Ninja extends Person {
    village: string;
  }

  // Read only (prevents re-assignment)
  interface Student {
    readonly firstName: string;
    readonly lastName?: string;
  }

  const greetStudent = (person: Student) => {
    const { firstName, lastName } = person;
    return lastName ? `Hello, ${firstName} ${lastName}!` : `Hello, ${firstName}!`;
  };

  // Extra properties
  interface Friend {
    firstName: string;
    lastName?: string;
    [propName: string]: any; // Allow additional properties
  }

  // Interface as function (use as a type for a callback param)
  interface SearchFunc {
    (source: string, subString: string): boolean;
  }

  // Indexable types
  interface ArrayOfStrings {
    [index: number]: string; // an index of type number will return a string value.
  }

  // Hybrid types (function and object)
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
}

