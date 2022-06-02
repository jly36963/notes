# Deno

- docs
  - https://deno.land/
  - https://github.com/denoland/deno
  - https://doc.deno.land/deno/stable

- install
  - https://github.com/denoland/deno#install
  - run command
  - use output to add deno to path
  
- install dvm
  - https://github.com/justjavac/dvm

## notes

### cli

```zsh
# basics
deno run <filepath-or-url>
deno run [permissions..] <filepath-or-url> [args..]
deno test
deno lint
deno fmt
deno bundle [options] <entry> <dist>

# watch (run, test, bundle, fmt)
deno run --watch
```

### permissions

- fs (read)
  - `--allow-read`
- fs (write)
  - `--allow-write`
- env
  - `--allow-env`
- network
  - `--allow-net`
- subprocess
  - `--allow-run`
- all
  - `--allow-all`

### basics

https://deno.land/manual/examples

### testing

https://deno.land/manual/testing

### configuration

configure:
- ts compiler
- linting/formatting

https://deno.land/manual/getting_started/configuration_file

### vscode

- install deno plugin
- settings.json 
  - `"deno.enable": true,`
- mixed-deno projects
  - https://github.com/denoland/vscode_deno/blob/main/docs/workspaceFolders.md
- vscode_deno 
  - https://deno.land/manual/vscode_deno

### filenames

entry point -- mod.ts
deps.ts & dev_deps.ts -- centralized store for external (dev) dependencies

### deps

https://deno.land/manual/examples/manage_dependencies

### std

https://deno.land/manual/standard_library
https://deno.land/std@0.140.0

### tooling

https://deno.land/manual/tools

### contributing

https://deno.land/manual/contributing

### web platform APIs (eg: fetch)

https://deno.land/manual/runtime/web_platform_apis

### node compatibility

https://deno.land/manual/node/compatibility_mode

### node to deno

https://deno.land/manual/node/cheatsheet

### useful packages

- oak (server) (like koa)
- opine (server) (like express)

