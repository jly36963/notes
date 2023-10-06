# Bun

[Site](https://bun.sh/)

## Install

```sh
curl -fsSL https://bun.sh/install | bash
```

## CLI

```sh

# Setup
bun init # Initialize project
bun install yargs # Install a package

# Run
bun run index.ts # Run a file
bun run start # Run a script (package.json)
bunx cowsay "Hello, world!" # Execute package

# Test
bun test # Run tests

# Package manager
bun pm bin # Print location of package manager binary
bun pm ls # List project deps (with versions)
```
