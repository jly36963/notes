import type { Prettify } from "../types/index.ts";

// Nominal vs Structural typing

type Person1 = {
  name: string;
};
type P1 = Person1 & { age: number };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _P1Pretty = Prettify<P1>;

interface Person2 {
  name: string;
}
interface P2 extends Person2 {
  age: number;
}

class P3 {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

function main() {
  const p1: P1 = { name: "bob", age: 30 };
  const p3 = new P3("bob", 30);

  // Requires P2
  const greet = (person: P2) =>
    console.log(`I'm ${person.name} and I'm ${person.age}`);

  // I'm using P1 / P3, which is okay as they match P2 structurally
  greet(p1);
  greet(p3);
}

main();
