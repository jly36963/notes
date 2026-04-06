# Typescript

### References

[docs](https://www.typescriptlang.org/)
[playground](https://www.typescriptlang.org/play/index.html)
[tsconfig docs](https://www.typescriptlang.org/tsconfig/)
[cheatsheets](https://www.typescriptlang.org/cheatsheets)

### Command line

```sh
# Install dev dependencies (ts, node type annotations)
npm i -D typescript @types/node
# Create tsconfig
tsc --init
# Compile
tsc helloworld.ts
```

## Syntax and usage

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

### Objects

Types alias vs interface:

- interface
  - describe the shape of objects
  - extending: `extends` keyword
  - declaration merge when defined multiple times
  - `implements` typically used with interface
    - eg: class implements interface
  - `extends` typically used with class or interface
    - eg: interface extends interface, class extends class
  - typically used for object literals or functions
- type alias
  - alias for a type (or combination of types)
  - extending: `&`
  - implements/extends can't be used with union type
  - can't be declared multiple times
  - typically used for primitives, literals, union, tuple, array, or funcs

#### Type Aliases

```ts
type nil = null | undefined;
const n: nil = null;
```

#### Interface

```ts
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

### Type narrowing

- typeof guards
- truthiness guards
- equality narrowing
- narrowing with "in" operator
- instanceof narrowing
- type predicates
- discriminated union
  - literal property (discriminant) to switch against

### Generics

[docs](https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions)

### Interfaces (in-depth)

Eg: extends, readonly, extra properties, indexable types

[docs](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Functions (in-depth)

Eg: hybrid types (object type with call signature)

[docs](https://www.typescriptlang.org/docs/handbook/2/functions.html)
[hybrid types](https://www.typescriptlang.org/docs/handbook/interfaces.html#hybrid-types)

### Type declarations

[docs](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html)

### Typescript modules

[docs](https://www.typescriptlang.org/docs/handbook/modules.html)

### Implements and Extends

[implements docs](https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses)
[extends docs](https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses)
[implements vs extends](https://stackoverflow.com/a/38834997)

Extends signifies inheritance.\
Implements signifies matching shape.

### Satisfies

[docs](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)

## Webpack and React

[webpack docs](https://webpack.js.org/guides/typescript/)\
[ts & react docs](https://www.typescriptlang.org/docs/handbook/react.html)
