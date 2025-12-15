# JSON

## Types

Primitive:

- String
- Number (double-precision floating-point)
- Boolean
- Null

Collection:

- Array
- Object

## Constraints

- Strings are double-quoted
- Comma-separated arrays/objects, no trailing comma
- Arrays/Objects can be nested

## Example

Primitive types:

```json
{
  "string": "Finland!",
  "boolean": true,
  "number": 24,
  "null": null
}
```

Collection types:

```json
[
  {
    "quote": "Did you try W for Wumbo?",
    "character": "Patrick"
  },
  {
    "quote": "My cleats are stuck in your corneas",
    "character": "Spongebob"
  },
  {
    "quote": "MY LEG!",
    "character": "Fred"
  },
  {
    "quote": "Dudes, he made me experience high tide!",
    "character": "Scooter"
  }
]
```

## jsonc

JSONC can have comments

```jsonc
{
  // Pylance type checking
  "python.analysis.typeCheckingMode": "basic"
}
```
