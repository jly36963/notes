# napi-rs

## Learning resources

- [napi-rs](https://napi.rs/docs/introduction/getting-started)

## Setup

```sh
# Update rust
rustup update
# Install napi-rs
pnpm add -g @napi-rs/cli
# New project
napi new
# Build
pnpm run build
```

## Notes

- Generated code is cjs, it won't work with ESM
  - add `"type": "commonjs"` to its `package.json`.
