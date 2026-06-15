import { kebabCase } from "string-ts";
import type { Equal, Expect, Extends } from "./types/index.ts";

// ---
// Types
// ---

function basicTypes() {
  const addOne = (n: number) => n + 1;
  const toUpper = (s: string) => s.toUpperCase() as Uppercase<string>;
  const coinToss = () => Math.random() < 0.5;

  const num = addOne(5);
  const str = toUpper("hello");
  const bool = coinToss();
  console.log({ num, str, bool });
}

// ---
// Generics
// ---

/** Find an element in an array, given a predicate. */
function find<T>(values: Array<T>, pred: (v: T) => boolean): T | undefined {
  for (const value of values) {
    if (pred(value)) {
      return value;
    }
  }
  return;
}

function basicGenerics() {
  const maybeNum = find([1, 2, 3, 4, 5], (n) => n > 3);
  console.log(maybeNum);
}

// ---
// Type Theory
// ---

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars */
namespace _TypeTheory {
  // Type A represents a set of 3 possible values
  type A = 1 | 2 | 3;
  // Type B represents a set of 3 possible values
  type B = 3 | 4 | 5;
  // The union of A and B is a type with 5 possible (unique) values
  type UnionResult = A | B;
  type _UnionTest = Expect<Equal<UnionResult, 1 | 2 | 3 | 4 | 5>>;
  // The intersection of A and B is a type with one possible value
  type IntersectionResult = A & B;
  type _IntersectionTest = Expect<Equal<IntersectionResult, 3>>;
  // Extends (A must be a subset of B)
  type _ExpectTestA1 = Expect<Extends<1, A>>;
  type _ExpectTestA2 = Expect<Extends<1 | 2, A>>;
  type _ExpectTestB1 = Expect<Extends<4, B>>;
  type _ExpectTestB2 = Expect<Extends<4 | 5, B>>;
  // Type hierarchy (type A must extend type B to fulfill type requirements)
  type _ExpectTest1 = Expect<Extends<never, "a">>;
  type _ExpectTest2 = Expect<Extends<"a", "a" | "b">>;
  type _ExpectTest3 = Expect<Extends<"a" | "b", Lowercase<string>>>;
  type _ExpectTest4 = Expect<Extends<Lowercase<string>, string>>;
  type _ExpectTest5 = Expect<Extends<string, string | null>>;
  type _ExpectTest6 = Expect<Extends<string | null, unknown>>;
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars */

// ---
// Narrowing (if/else, ternaries, early return, throw)
// ---

function basicTypeNarrowing() {
  // Cannot safely use as a number until type narrowed
  const maybeNum = find([1, 2, 3, 4, 5], (n) => n > 3);
  if (maybeNum) {
    // Type has been narrowed, safe to use as number
    const squared = Math.pow(maybeNum, 2);
    console.log(squared);
  } else {
    console.log("oops, no number");
  }
}

// ---
// Assertion functions
// ---

// Don't use TS Enums, use unions of literals instead
// TS Enums are not valid JS, you can restrict them with `erasableSyntaxOnly`

const STARTERS = ["squirtle", "charmander", "bulbasaur"] as const;
// type Starter = "squirtle" | "charmander" | "bulbasaur"
type Starter = (typeof STARTERS)[number];

function assertIsStarter(value: string): asserts value is Starter {
  if (!(STARTERS as ReadonlyArray<string>).includes(value)) {
    throw new Error(`${value} is not a valid starter`);
  }
}
function useStarter(starter: Starter): void {
  console.log(starter);
}

function basicLiteralUnions() {
  const starter: string = "squirtle";
  // @ts-expect-error: `string` can't be used as `Starter`
  useStarter(starter);

  // I'm using `as` to narrow the type (ie: "Trust me bro")
  useStarter(starter as Starter);

  // Type has been narrowed from `string` to `starter`
  assertIsStarter(starter);
  useStarter(starter);
}

// ---
// Mapped types
// ---

type Team = "Team1" | "Team2" | "Team3";
type Ticket = `${Team}-${number}`;
type Repo = "server-repo" | "pipelines-repo" | "queue-repo";
type Database = "postgres" | "mongo" | "redis";
type Service = Repo | Database;
type Client = "app-ui" | "dashboard-ui" | "internal-ui";

interface EnvConfig {
  name: string;
  ticket: Ticket;
  services: {
    [service in Service]?: string;
  };
  clients: {
    [client in Client]?: string;
  };
  env: {
    [service in Service]?: {
      [envVar: string]: string;
    };
  };
}

function basicMappedTypes() {
  const config: EnvConfig = {
    name: "my-testing-env",
    ticket: "Team1-12893",
    services: { "server-repo": "2.113.2" },
    clients: { "app-ui": "3.12.2" },
    env: { "server-repo": { SOME_VAR: "some-value" } },
  };
  console.log(config);
}

// ---
// Objects
// ---

// `createdAt?: Date` -- the key might not exist on the object
// `createdAt: Date | undefined` -- the key is required, but the value might be `undefined`
// `createdAt?: Date | undefined` -- the key might not be set, and the value might be undefined

interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserInput = Pick<User, "id" | "name" | "email">;

function basicObjects() {
  const userInput: UserInput = {
    id: "abcde",
    name: "bob",
    email: "superuser@test.com",
  };
  console.log(userInput);

  const user: User = {
    id: "abcde",
    name: "bob",
    email: "superuser@test.com",
  };
  console.log(user);
}

// ---
// Main
// ---

function printSectionTitle(title: string): void {
  console.log(`\n${title.toUpperCase()}\n`);
}

async function main() {
  const examples: Record<string, () => void> = {
    basicTypes,
    basicGenerics,
    basicTypeNarrowing,
    basicLiteralUnions,
    basicMappedTypes,
    basicObjects,
  };

  for (const [title, fn] of Object.entries(examples)) {
    printSectionTitle(kebabCase(title));
    fn();
  }
}

main();
