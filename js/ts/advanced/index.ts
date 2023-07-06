// ---
// Useful resources
// ---

// Conditional types: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
// Mapped types: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

// ---
// Basic generics
// ---

/** Generic function that returns its input */
function identity<T>(a: T): T {
  return a;
}

/** Generic array function that returns the first element or a fallback value */
function firstOr<T>(array: T[], fallback: T): T {
  return array.length ? array[0] : fallback;
}

/** Generic array map function */
function map<A, B>(array: A[], fn: (value: A) => B): B[] {
  return array.map(fn);
}

// ---
// Literals, Unions, Intersections
// ---

// There are types and subtypes
// Types occupy space (a set of values)
// Subtypes occupy space within a type's space (a subset of those values)

// Unknown is at the top of type hierarchy
// Never is at the bottom of every type set in the hierarchy

// Unions
// Any value in the union of type sets

// Intersections
// Any value in the intersection of type sets

// Literal
// Exact types -- the type set only has a single value
// Example: A const-declared primitive. `const a = 'A'`
// Not useful by itself, but can be very useful in unions
type LetterA = "A";

// Union (literals)
// Union of literals (subtype of string in this example)
// Useful for specifying a finite set of values
type PrimaryColors = "red" | "yellow" | "blue";

// Union (subtype/type)
// A union between a subtype and an encompassing type
// Not useful, as the type (string) already encompasses the subtype(s)
// Effectively `type str = string`
type Str = PrimaryColors | string;

// Union (types)
// Any value that could be within the union of type sets
// Will require type narrowing to use value as one of the union-ed types
type Result<T> = { data: T } | { error: Error };

// Intersection
// Any value that could be within the intersection of type sets
type GreenConstituents = "yellow" | "blue";
type PurpleConstituents = "blue" | "red";
type Blue = GreenConstituents & PurpleConstituents;

// Intersection (subtype/type)
// subtype is fully contained in type, the intersection IS the subtype
type Pc2 = PrimaryColors & string; // primaryColors

// Intersection (no overlap)
// There is no overlap between the type sets
// Never: empty type set
type StrNum = string & number; // never

// ---
// Objects & Records
// ---

// Objects
type Person = { name: string; age: number; address: string };
type Age = Person["age"];
type NameOrAge = Person["name"] | Person["age"];
// type NameOrAge = Person["name" | "age"]; // Same as above
type PersonKeys = keyof Person; // "name" | "age" | "address"
type PersonValues = Person[keyof Person]; // string | number
type ValueOf<T> = T[keyof T];
// type PersonValues = ValueOf<Person> // Same as above

// Intersection/union of objects
// keyof (A & B) = (keyof A) | (keyof B)
// keyof (A | B) = (keyof A) & (keyof B)
type AB = { a: string } & { b: string };
type ABKeys = keyof AB; // "a" | "b"

// Records
// { [key: string]: string }
// Record<string, boolean>
// Record<K, V> = { [Key in K]: V };

// Exclude key from object
// type RemoveId<T> = Omit<T, 'id'>
type RemoveId<T> = {
  [K in keyof T as Exclude<K, "id">]: T[K];
};

// Object assign example
// type Assign<A, B> = Omit<A, keyof B> & B;
type Assign<A, B> = {
  [K in keyof A as Exclude<K, keyof B>]: A[K];
} & B;

const assign = <A, B>(obj1: A, obj2: B): Assign<A, B> => ({
  ...obj1,
  ...obj2,
});

// ---
// Code branching with conditional types
// ---

// Extends
type IsMeaningOfLife<N> = N extends 42 ? true : false;
type OK = IsMeaningOfLife<42>; // => true
type KO = IsMeaningOfLife<41>; // => false
type IsArray<T> = T extends Array<unknown> ? true : false;

// Type-level if function
type If<A extends boolean, B, C> = A extends true ? B : C;
type a = If<true, number, string>; // number
type b = If<false, {}, []>; // []

// Infer (obj)
type GetRole<User> = User extends { name: string; role: infer Role }
  ? Role
  : never;
type GetRoleRes = GetRole<{ name: "Gabriel"; role: "admin" }>; // 'admin'

// Infer (tuple)
type Head<Tuple> = Tuple extends [infer First, ...any] ? First : never;
type HeadRes = Head<["alpha", "beta", "gamma"]>; // => "alpha"
type HeadResEmpty = Head<[]>; // => never

// infer (func)
type CheckFn = (name: string, id: number) => boolean;
type Params<F> = F extends (...params: infer P) => any ? P : never;
type ParamsRes = Params<CheckFn>; // => [name: string, id: number]
type RetType<F> = F extends (...params: any[]) => infer R ? R : never;
type RetTypeREs = ReturnType<CheckFn>;

// infer (generic)
type SetValue<S> = S extends Set<infer V> ? V : never;

// ---
// Iterating
// ---

type Column = {
  name: string;
  values: unknown[];
};

type Table = [Column, ...Column[]];

type UserTable = [
  { name: "firstName"; values: string[] },
  { name: "age"; values: number[] },
  { name: "isAdmin"; values: boolean[] }
];

// Find
type GetColumn<List, Name> = List extends [infer First, ...infer Rest]
  ? First extends { name: Name; values: infer Values }
    ? Values
    : GetColumn<Rest, Name>
  : undefined;

// Map
type GetName<Obj> = Obj extends { name: infer Name } ? Name : undefined;
type ToNames<List> = List extends [infer First, ...infer Rest]
  ? [GetName<First>, ...ToNames<Rest>]
  : [];

// Filter
type FilterTable<Table, NameUnion> = Table extends [infer Col, ...infer Rest]
  ? Col extends { name: NameUnion }
    ? [Col, ...FilterTable<Rest, NameUnion>]
    : FilterTable<Rest, NameUnion>
  : [];

// Filter (numbers)
type OnlyNumbers<List> = List extends [infer First, ...infer Rest]
  ? First extends number
    ? [First, ...OnlyNumbers<Rest>]
    : OnlyNumbers<Rest>
  : [];

type OnlyNumbersRes = OnlyNumbers<[1, 2, "oops", 3, "hello"]>; // => [1, 2, 3]

// Reduce
type FromEntriesRecursive<Entries, Acc = {}> =
  // `Acc` is optional, with a `{}` default value
  Entries extends [infer Entry, ...infer Rest]
    ? FromEntriesRecursive<
        Rest,
        Entry extends [infer Key extends string, infer Value]
          ? Acc & { [K in Key]: Value }
          : Acc
      >
    : Acc;

type User = FromEntriesRecursive<[["name", "Gabriel"], ["age", 29]]>;
// => { name: "Gabriel"; age: 29 }

// Reduce (Take)
type Take<
  Tuple extends any[],
  N extends number,
  Output extends any[] = []
> = Tuple extends [infer First, ...infer Rest]
  ? Output["length"] extends N
    ? Output
    : Take<Rest, N, [...Output, First]>
  : Output;

type TakeRes = Take<[1, 2, 3], 2>;

// ---
// Template literal types
// ---

// Get first and last names
type GetLastWord<Str> = Str extends `${string} ${infer Rest}`
  ? GetLastWord<Rest>
  : Str;
type GetNameTuple<Name> = Name extends `${infer FirstName} ${infer Rest}`
  ? [FirstName, GetLastWord<Rest>]
  : never;
type AlbusDumbledore = GetNameTuple<"Albus Perceval Wulfric Brian Dumbledore">;

// To snake case (regular sentence)
type ToSnake<Str> = Str extends `${infer Start} ${infer Rest}`
  ? `${Start}_${ToSnake<Rest>}`
  : Str;
type Punctuation = "." | "!" | "?" | "," | "-";
type RemovePunctuation<
  Str,
  Output extends string = ""
> = Str extends `${infer First}${infer Rest}`
  ? First extends Punctuation
    ? RemovePunctuation<Rest, Output>
    : RemovePunctuation<Rest, `${Output}${First}`>
  : Output;
type TitleToSnake<Str extends string> = Lowercase<
  RemovePunctuation<ToSnake<Str>>
>;
type DidYouEnjoyThisChapter = TitleToSnake<"Do you enjoy this chapter?">;

// Snake to camel
type SnakeToCamel<Str> = Str extends `${infer First}_${infer Rest}`
  ? `${First}${SnakeToCamel<Capitalize<Rest>>}`
  : Str;
type helloWorld = SnakeToCamel<"hello_world">;

// To snake case (split, join)
type SpacesToUnderscores<Str> = Join<Split<Str, " ">, "_">;
type Split<
  Str,
  Sep extends string
> = Str extends `${infer First}${Sep}${infer Rest}`
  ? [First, ...Split<Rest, Sep>]
  : [Str];
type Join<List, Sep extends string> = List extends [infer First]
  ? First
  : List extends [infer First extends string, ...infer Rest extends string[]]
  ? `${First}${Sep}${Join<Rest, Sep>}`
  : "";
type ABCArray = Split<"a.b.c", ".">;
type ABC = Join<["a", "b", "c"], ".">;
type TLTS = SpacesToUnderscores<"type level typescript">;

// ---
// Mapped types
// ---

namespace mappedTypes {
  type ValueOf<T> = T[keyof T];
  type Entries<Obj> = ValueOf<{
    [Key in keyof Obj]: [Key, Obj[Key]];
  }>;
  type FromEntries<Entries extends [any, any]> = {
    [Entry in Entries as Entry[0]]: Entry[1];
  };
  type AnyFunction = (...args: any) => any;
  type OmitByValue<T, Omitted> = FromEntries<
    Exclude<Entries<T>, [any, Omitted]>
  >;
  type PickByValue<T, Keep> = FromEntries<Extract<Entries<T>, [any, Keep]>>;

  type OmitByValueRes = OmitByValue<
    { a: () => string; b: string },
    AnyFunction
  >;
  // { b: string }
  type PickByValueRes = PickByValue<{ a: () => string; b: string }, string>;
  // { b: string }
}
