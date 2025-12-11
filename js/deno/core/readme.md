# Deno

- Docs

  - [Manual](https://deno.land/manual)
  - [Landing](https://deno.land/)
  - [Repo](https://github.com/denoland/deno)
  - [Deno Doc](https://doc.deno.land/deno/stable)
  - [Std Lib](https://deno.land/std)
  - Runtime APIs
    - [Deno](https://deno.land/api?s=Deno)
    - [All](https://deno.land/api)
  - [Node to Deno cheatsheet](https://deno.land/manual/node/cheatsheet)

- Install
  - [Install page](https://github.com/denoland/deno#install)
  - Run command
  - Use output to add deno to path

## CLI

TODO: replace `bundle` usage as it is deprecated

- [CLI](https://deno.land/manual/getting_started/command_line_interface)
- [Additional tools](https://deno.land/manual/tools)

```zsh
# Common
deno run <filepath-or-url>
deno run [permissions..] <filepath-or-url> [args..]
deno task <task-name>
deno test
deno lint
deno fmt
deno bundle [options] <entry> <dist>

# Watch (run, test, bundle, fmt)
deno run --watch
```

## Permissions

| permission | flag            |
| ---------- | --------------- |
| fs read    | `--allow-read`  |
| fs write   | `--allow-write` |
| env        | `--allow-env`   |
| network    | `--allow-net`   |
| subprocess | `--allow-run`   |
| all        | `--allow-all`   |

## Configuration

Configure the compiler, formatter, and linter.\
https://deno.land/manual/getting_started/configuration_file

## VSCode

- install deno plugin
- settings.json
  - `"deno.enable": true,`
- mixed-deno projects
  - https://github.com/denoland/vscode_deno/blob/main/docs/workspaceFolders.md
- vscode_deno
  - https://deno.land/manual/vscode_deno

## Filename Conventions

- mod.ts
  - similar to index.js in node
- deps.ts & dev_deps.ts
  - central store for external deps
  - [Managing deps](https://deno.land/manual/examples/manage_dependencies)

## Dependencies

### Import maps

If application code, use import maps

### Deps pattern

If library code, use deps pattern

```ts
// deps.ts
export { delay } from "https://deno.land/std@0.140.0/async/mod.ts";
```

```ts
// mod.ts
import { delay } from "./deps.ts";
```
