# Solid basics

[Solid Website](https://solidjs.com)\
[Docs](https://www.solidjs.com/docs/latest)

## Setup

```bash
# Clone template
npx degit solidjs/templates/ts <name>
# Install deps
cd <name>
npm i
```

## Additional tools

[router](https://github.com/solidjs/solid-router)

```bash
npm i @solidjs/router
```

## Scripts

- `npm run dev`
- `npm start`
- `npm run build`

## Props helpers

Keep props reactive by not destructuring them

- mergeProps
- splitProps

## Functions

Note: signals need to be called to read value

- createSignal
  - primitive reactivity
- createEffect
  - state-change side-effects
- createMemo
  - derived state
- createResource
  - async/fetch state
- createStore
  - nested reactivity

## Lifecycle methods

- onMount
- onCleanup
- onError
