# Typescript

## About

### Notes

[docs](https://www.typescriptlang.org/)
[playground](https://www.typescriptlang.org/play/index.html)
[tsconfig docs](https://www.typescriptlang.org/tsconfig/)
[cheatsheets](https://www.typescriptlang.org/cheatsheets)

### Making it work

[ts-node and mocha](https://stackoverflow.com/a/35661569)
[ts, esm, and mocha](https://github.com/mochajs/mocha-examples/issues/47#issuecomment-952339528)

### Install

Install:

```sh
# install dev dependencies (ts, node type annotations)
npm i -D typescript @types/node
```

## Compiling

```sh
# Compile
tsc helloworld.ts
```

## Usage

### Basic types

```ts
// boolean
const b: boolean = true;
// number
const num: number = 5;
// string
const s: string = "hello";
// array
const arr: number[] = [1, 2, 3];
// tuple
const t: [string, number] = ["col1", 1];
// null
const n: null = null;
// undefined
const u: undefined = undefined;
// enum
// ...
// any
const a: any = { data: { message: "Hi!" }, error: null };
// object
const o: object = { data: { message: "Hello!" } };
```

### Unions

Unions require type narrowing

```ts
const first: string | undefined = [1, 2, 3].find((x) => x > 5);
console.log(first ? `found one: ${first}` : "didn't find one");
```

### Functions

Types specified for params and return value

```ts
function greetPerson(person: string): string {
  return `Hello, ${person}`;
}
```

### Type

Type aliases

```ts
type nil = null | undefined;
const n: nil = null;
```

### Interface

```ts
// ---
// Interface
// ---

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

// ---
// Extends
// ---

interface Ninja extends Person {
  village: string;
}
const ninja: Ninja = { ...person, village: "hidden leaf" };
console.log(greetPerson(ninja));

// ---
// Read only (prevents re-assignment)
// ---

interface Student {
  readonly firstName: string;
  readonly lastName?: string;
}
const greetStudent = (person: Student) => {
  const { firstName, lastName } = person;
  return lastName ? `Hello, ${firstName} ${lastName}!` : `Hello, ${firstName}!`;
};
console.log(greetStudent({ firstName: "Iruka" }));

// ---
// Extra properties
// ---

interface Friend {
  firstName: string;
  lastName?: string;
  [propName: string]: any; // Allow additional properties
}

// ---
// Indexable types
// ---

interface ArrayOfStrings {
  [index: number]: string; // an index of type number will return a string value.
}

// ---
// Interface as function (use as a type for a callback param)
// ---

interface SearchFunc {
  (source: string, subString: string): boolean;
}

// ---
// Hybrid types (function and object)
// ---

// TODO

interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}
```

### Utility Types

```ts
interface Ninja {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  createdAt: string;
  updatedAt: string | null;
  jutsus?: Array<Jutsu>;
}

interface Jutsu {
  id: string;
  name: string;
  chakraNature: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  ninjas?: Array<Ninja>;
}

type partialNinja = Partial<Ninja>; // All properties optional
type requiredNinja = Required<Ninja>; // All properties required
type readonlyNinja = Readonly<Ninja>; // All properties cannot be reassigned
type ninjaMap = Record<string, Ninja>; // Generic Key/Type map type
type pickedNinja = Pick<Ninja, "firstName" | "lastName" | "age">; // Pick props
type omittedNinja = Omit<Ninja, "jutsus">; // Omit props

type excluded = Exclude<"null" | "undefined", "null">; // Exclude from union
type extracted = Extract<"null" | "undefined", "null">; // Extract from union
type nonNullable = NonNullable<"string" | "undefined">; // Remove nil from union
type params = Parameters<(string) => string>; // Param types of func
type output = ReturnType<(string) => string>; // Return type of func
```

### Generics

TODO

### Type narrowing

- typeof guards
- truthiness guards
- equality narrowing
- narrowing with "in" operator
- instanceof narrowing
- type predicates
- discriminated union
  - literal property (discriminant) to switch against

### Type declarations

TODO

### Typescript modules

TODO

### Modules and import/export

TODO

### Webpack

TODO

### React

TODO
