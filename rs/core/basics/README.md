# rust basics

## install rust

[docs](https://www.rust-lang.org/tools/install)

### unix install

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### update

```sh
rustup update
```

### using nightly build

- `rustup default nightly`
- `rustup update && cargo update`

### tools

- rustup -- rust toolchain installer (somewhat like nvm)
- rustc -- compiler
- cargo -- package manager

### troubleshooting

```sh
rustup --version
rustc --version
cargo --version
```

### deps

- Cargo.toml: similar to Pipfile
- Cargo.lock: similar to Pipfile.lock

### formatter

- install Rust vscode extension
- follow "format on save" instructions

## cargo (init)

### method 1 (don't use)

```sh
touch main.rs
rustc main.rs
```

### method 2a (create project in child directory)

```sh
cargo new <project-name> --bin
cargo new <project-name> --lib
```

### method 2b (create project in current directory)

```sh
cargo init
```

## cargo

[docs](https://doc.rust-lang.org/cargo/commands/cargo-install.html)

### install

```sh
cargo install <crate>
cargo update
```

### run

```sh
cargo check # check for errors
cargo build # dev build (target/debug)
cargo run # dev build + run
cargo build --release # prod build (target/release)
```

## about

- program must have entry point (main)
- variables hold primitive data or refs to data
- variables are immutable by default
- rust is block-scoped
- types must be known, (many can be inferred)

## ownership

[docs](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)

- owner
  - each value has a variable that's it's "owner"
  - there can only be one owner at a time
  - when the owner goes out of scope, the value will be dropped
- memory/allocation (traditional)
  - some languages have a garbage collector to clean up memory
  - some require manual garbage collection. this is difficult, and can cause memory leaks or bugs.
- memory/allocation (rust)
  - memory is returned once the variable that owns it is out of scope
  - when a variable goes out of scope (closing curly bracket of func), rust calls "drop" function.
  - this "drop" functionality is similar to C++ RAII
- types and traits
  - scalar and compound types behave differently when assigned to a different variable
  - scalar types have "Copy" trait. compound types don't. (tuples have "Copy" trait if all of their contents do)
  - passing a value to a function will move/copy like assignment does.

## references and borrowing

[docs](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)

- references allow for referring to a value without taking ownership (borrowing)
- you cannot modify a borrowed value, unless "mut" keyword is used
- at any given time, you can have either one mutable ref or any number of immutable refs
- refs must always be valid. rust compiler won't allow for dangling references

## types

- scalar types
  - int (i32 is default): i8, i16, i32, i64, i128
  - uint: u8, u16, u32, u64, u128
  - float (f64 is default): f32, f64
  - bool
  - char
- compound types
  - String (mutable),
  - str (immutable, fixed-length)
  - Tuple
  - Array
  - Vector
  - Struct

## code organization

- packages ([docs](https://doc.rust-lang.org/book/ch07-01-packages-and-crates.html)):
  - one or more crates that provide a set of functionality.
  - contains a Cargo.toml file (describes how to build those crates)
  - must contain at least one crate, can only have 0 or 1 library crate
  - created with `cargo new <package-name>`
- crates: A tree of modules that produces a library or executable
  - library or binary
  - crate root: a source file that the rust compiler starts from (and makes up the root module of the crate)
- modules ([docs](https://doc.rust-lang.org/book/ch07-02-defining-modules-to-control-scope-and-privacy.html))
  - modules let us organize code into groups for readability and reuse
  - mod: keyword that defines module
  - modules can be nested
  - modules are private by default
    - `pub` keyword exposes module path
    - `pub mod <module-name>` will make it public
    - parent module can't use private items in child modules.
    - child module can use private items from ancestor module.
    - gotchas
      - struct fields must have `pub` keyword to be exposed
      - enum variants are public by default
- paths ([docs](https://doc.rust-lang.org/book/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html))
  - paths are used to show Rust where to find an item in a module tree
  - paths can take two forms
    - absolute path: starts from the crate root (using crate name or literal `crate`)
    - relative path: starts from the current module (uses `self`, `super`, or an identifier)
  - path delimiter: `::`
  - `super`: access parent module in relative path
  - `use`: bring path into scope
    - basic examples
      - `use std::collections::HashMap;`
      - `use rand::Rng;`
    - nested paths examples
      - `use std::{cmp::Ordering, io};`
      - `use std::io::{self, Write};`
    - glob operator example (causes confusion in most cases):
      - `use std::collections::*;`
  - `as`: keyword for providing an alternative local name (alias)
    - example: `use std::io::Result as IoResult;`
  - `pub use`: re-exporting

## collections

[docs](https://doc.rust-lang.org/std/collections/index.html)

## strings

- str
  - Rust has only one string type in the core language: string slice.
  - type: `str`, borrowed form: `&str`
  - String literals are stored in the program’s binary and are therefore string slices.
  - immutable, must be known at compile time

- String
  - provided by Rust’s standard library rather than coded into the core language.
  - growable, mutable, owned, UTF-8 encoded string type.

## error handling

[Result docs](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)

- rust has two kinds of errors:
  - recoverable: `Result<T, E>`
  - unrecoverable: `panic!`
- `panic!`
  - used when there isn't a clear way to resolve/handle error
  - stops execution
    - print failure message, unwind / clean up stack, quit
- `Result<T, E>`

## traits

- [docs](https://doc.rust-lang.org/book/ch10-02-traits.html)

- traits tell the rust compiler about functionality a particular type has and can share with other types.
- We can use traits to define shared behavior in an abstract way.
- We can use trait bounds to specify that a generic can be any type that has certain behavior.

- Each type implementing a trait must provide its own custom behavior for the method signatures

## lifetimes

[docs](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html)

## testing

- [rust docs](https://doc.rust-lang.org/book/ch11-01-writing-tests.html#how-to-write-tests)
- [rust docs (beta)](https://doc.rust-lang.org/beta/rust-by-example/testing/unit_testing.html)
- [diesel's tests](https://github.com/diesel-rs/diesel/tree/master/diesel_tests/tests)
- [coverage](https://blog.rust-lang.org/inside-rust/2020/11/12/source-based-code-coverage.html)
- [tarpaulin (coverage tool)](https://github.com/xd009642/tarpaulin)
- [doc tests](https://doc.rust-lang.org/rustdoc/documentation-tests.html)

## attributes

- [docs](https://doc.rust-lang.org/reference/attributes.html)

## cargo & crates.io

- [docs](https://doc.rust-lang.org/book/ch14-00-more-about-cargo.html)

## smart pointers

- [docs](https://doc.rust-lang.org/book/ch15-00-smart-pointers.html)

## concurrency

- [docs](https://doc.rust-lang.org/book/ch16-01-threads.html)

- [channels](https://doc.rust-lang.org/book/ch16-02-message-passing.html)
- [atomic](https://doc.rust-lang.org/book/ch16-03-shared-state.html#atomic-reference-counting-with-arct)

## OOP

- [docs](https://doc.rust-lang.org/book/ch17-00-oop.html)

## macros

- [docs](https://doc.rust-lang.org/book/ch19-06-macros.html)