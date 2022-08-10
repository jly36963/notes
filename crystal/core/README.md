# crystal

https://crystal-lang.org/\
https://github.com/crystal-lang/crystal\
https://crystal-lang.org/api/1.5.0/

## install

https://crystal-lang.org/install/

```zsh
brew update
brew install crystal
```

## command line

```zsh
# initialize crystal project
crystal init app <name>
crystal init lib <name>
# build executable
crystal build <src-file>
crystal build <src-file> -o <output-file>
crystal build <src-file> --release # optimized
# gen docs
crystal docs <src-file>
# run program
crystal run <src-file>
# format
crystal tool format
# playground
crystal play
```

```zsh
# initialize shard.yml
shards init
# install deps (in 'lib' folder)
shards
shards install
# list deps
shards list
# update deps
shards update
# check deps
shards check

# deps must be manually added to shard.yml (?)
```

## style

- Variables are snake-case
- Methods are snake-case
- Types are pascal-case
- Constants are screaming-snake-case
- Libs all have 'Lib' prefix
- indentation is 2 spaces (namespaces, methods, blocks, etc)
- directories
  - '/' contains config, readme, docs
  - 'src/' contains source code
  - 'spec/' contains spec
  - 'bin/' contains executables

## lint

https://github.com/crystal-lang-tools/vscode-crystal-lang/

### ameba

vscode extension only does syntax highlighting.\
to get static code analyis, install ameba.

https://github.com/crystal-ameba/ameba#os-x

### experimental/unstable vscode linting

https://github.com/crystal-lang-tools/vscode-crystal-lang/wiki/Settings

```jsonc
// crystal
"crystal-lang.implementations": true,
"crystal-lang.completion": true,
"crystal-lang.hover": true,
```

## assignment

https://crystal-lang.org/reference/1.5/syntax_and_semantics/assignment.html

## scope

- top-level scope: not in any other namespace
  - top-level variables are not visible in method bodies
  - `::` prefix denotes top-level scope variable

## comments / docs

https://crystal-lang.org/reference/1.5/syntax_and_semantics/documenting_code.html

## types

- types
  - https://crystal-lang.org/reference/1.5/syntax_and_semantics/literals/index.html
- type grammar
  - https://crystal-lang.org/reference/1.5/syntax_and_semantics/type_grammar.html

- integers
  - https://crystal-lang.org/reference/1.5/syntax_and_semantics/literals/integers.html
- floats
  - https://crystal-lang.org/reference/1.5/syntax_and_semantics/literals/floats.html
- strings
  - https://crystal-lang.org/reference/1.5/syntax_and_semantics/literals/string.html

## requiring files

https://crystal-lang.org/reference/1.5/syntax_and_semantics/requiring_files.html

- `require "filename"`
  - look in lib directory or standard library
- `require "./filename"`
  - look up relative to current file
- `require "foo/*"
  - all files below "foo" directory
- `require "foo/**"
  - all files below "foo" directory and subdirectories (recursive)

## classes

- https://crystal-lang.org/reference/1.5/syntax_and_semantics/types_and_methods.html
- https://crystal-lang.org/reference/1.5/syntax_and_semantics/modules.html
  - Modules: a way to together methods, classes, constants under a namespace.

## unions, reflection, type casting

https://crystal-lang.org/reference/1.5/syntax_and_semantics/union_types.html

## arguments

https://crystal-lang.org/reference/1.5/syntax_and_semantics/default_values_named_arguments_splats_tuples_and_overloading.html

## operators

https://crystal-lang.org/reference/1.5/syntax_and_semantics/operators.html

## structs

https://crystal-lang.org/reference/1.5/syntax_and_semantics/structs.html

## macros

https://crystal-lang.org/reference/1.5/syntax_and_semantics/macros/index.html
