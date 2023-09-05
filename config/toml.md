# TOML

- Docs: https://toml.io
- Mime type: `application/toml`

## Types

Primitive:

- String
- Int
- Float
- Boolean
- Datetime

Collection:

- Array
- Table

Example:

```toml
# Strings
double-quote = "Finland!"
single-quote = 'Is mayonnaise an instrument?' # Literal
triple-quotes = """
No one can know.
Not even Squidward's house.""" # Supports single-/multi-line, first newline removed

# Numbers
int = 24
float = 3.5

# Boolean
boolean = true

# Datetime
dt = 2023-01-01T12:00:00.000Z # Timeone-aware
dtl = 2023-01-01T12:00:00     # Local (naive)
d = 2023-01-01
lt = 12:00:00

# Array
arr1 = [1, 2, 3]

# Table
[dependencies]
axum = "0.6.20"
hyper = { version = "0.14", features = ["full"] }
tokio = { version = "1.29", features = ["full"] }
tower = "0.4"
mime = "0.3.17"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
serde_derive = "1.0"

# Inline table
tab1 = { a = 1, b = 2, c = 3 }

# Table Array
# [{"a": 1, "b": 2}, {"a": 10, "b": 20}]
[[tables]]
a = 1
b = 2
[[tables]]
a = 10
b = 20
# Table Array (inline)
tables2 = [
    { a = 1, b = 2 },
    { a = 10, b = 20 },
    # ...
]
```
