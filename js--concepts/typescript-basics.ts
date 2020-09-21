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
const yamato: string = 'Yamato';
// array
const jonin: string[] = ['Kakashi', 'Yamato', 'Itachi'];
const hokage: Array<string> = ['Hiruzen', 'Kakashi', 'Tsunade'];
// tuple
const answer: [boolean, boolean, boolean] = [true, true, true];
// enum
// ...
// any
const response: any = { data: { message: 'Hi!' }, error: null };
// null
const nothing: null = null;
// undefined
const notDefined: undefined = undefined;
// object
const itachi: object = { firstName: 'Itachi', lastName: 'Uchiha' };

// -----------
// functions
// -----------

// https://www.typescriptlang.org/docs/handbook/functions.html

// normal function declaration
function greetPerson(person: string): string {
  return `Hello, ${person}`;
}

// anonymous
const subtract = function (x: number, y: number): number { return x - y; };

// arrow
const add = (x: number, y: number): number => x + y

// void
const say = (message: string): void => console.log(message); // no return value

// object
const readKeys = (obj: object): string[] => Object.keys(obj);

// interface
interface Person {
  firstName: string;
  lastName: string;
}

const greet = (person: Person): string => {
  return `Hello, ${person.firstName} ${person.lastName}`;
}

// -----------
// classes
// -----------

class Person {
  fullName: string;
  constructor(public firstName: string, public lastName: string) {
    this.fullName = `${firstName} ${lastName}`;
  }
  greet(): string {
    return `Hello, my name is ${this.firstName}`
  }
  greetFull(): string {
    return `Hello, my name is ${this.fullName}`
  }
}

let kakashi = new Person("Kakashi", "Hatake")
kakashi.greetFull();

// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



