type Dictionary<T> = Record<string, T>;
type NestedMap<T> = Dictionary<Dictionary<T>>;
type Option<T> = T | null;
type Maybe<T> = T | undefined;
type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;

/** Get the non-constructor methods from a class. */
type NonConstructorMethods<T> = {
  [P in keyof T]: T[P] extends new () => unknown ? never : P;
}[keyof T];

/** Maps a class to a type (excludes constructor). */
type InterfaceFromClass<T> = Pick<T, NonConstructorMethods<T>>;

type Extends<A, B> = A extends B ? true : false;
type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : [A, "should equal", B];

export type {
  Dictionary,
  Equal,
  Expect,
  Extends,
  InterfaceFromClass,
  Maybe,
  NestedMap,
  Option,
  Prettify,
};
