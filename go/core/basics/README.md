# Go (golang)

## Installation

TODO

### Path

Add go to path

In `.zprofile`:

````sh
# Set $GOPATH and add to PATH
export GOPATH="$HOME/go"
PATH="$GOPATH/bin:$PATH"```
````

## Types

- bool
- byte (alias: uint8)
- complex: complex64, complex128
- error
- floats: float32, float64
- ints: int, int8, int16, int32, int64, uint, uint8, uint32, uint64
- rune (alias: int32)
- string

## Operators

- math: `+` `-` `*` `/` `%`
- assignment: `=` `:=` `-=` `+=` `*=` `/+` `%=` `&=` `^=` `|=`
- increment: `++` `--`
- bitwise: `>>` `<<` `&` `|` `^` `&^`
- logical: `&&` `||` `!`
- comparison: `==` `!=` `<=` `>=`
