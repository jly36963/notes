# Github Actions

Github actions are typically used to automate CI/CD on incoming code changes.

## Setup

- Access tokens must have workflow permissions
  - Settings > Developer settings (bottom) > Personal access tokens
  - token must have "workflows" checked (in order to update workflows)
  - token must have "repo" access (in order to push to repo)

## Resources

- [learn](https://docs.github.com/en/actions/learn-github-actions)
- [sdras/awesome-actions](https://github.com/sdras/awesome-actions)
- [building/testing node](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)

## Basics

- workflows
  - triggered by events
  - contains one or more jobs
- jobs
  - needs a runner (execution env)
  - contain one or more steps
  - run in parallel by default
  - can be conditional
- steps
  - shell command/script or action
  - sequential
  - can be conditional

## Pricing

- public: free
- private: limited free usage, paid beyond that

## Setting up workflows

### Managing actions docs

https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository

### Create workflow

- Go to repo "Actions" tab
- Create workflow
  - From scratch
    - opens an editor for `<repo>/.github/workflows/main.yml`
  - Choose from existing workflows:
    - suggested, deployment, security, CI, automation, pages, etc

## Workflow file basics

This is a manual job.\
It can be run from the "Actions" page.

```yml
# Name of workflow
name: My Workflow
# Trigger
on: workflow_dispatch # Manual
# Jobs
jobs:
  # Job name
  my-job:
    # Runner (env)
    runs-on: ubuntu-latest
    # Steps to run
    steps:
      # Step name and command to run
      - name: Hello World
        run: echo "Hello World!"
      # Multiline script command
      - name: Greeting
        run: |
          echo "Hello friend!"
          echo "How have you been?"
```

## Runners

- Ubuntu
  - ubuntu-latest
  - ubuntu-22.04
- Mac
  - macos-latest
  - macos-12
- Windows
  - windows-latest
  - windows-2022

Runners list their installed software.\
[Ubuntu example](https://github.com/actions/runner-images/blob/main/images/linux/Ubuntu2204-Readme.md)

## Workflow triggers (events)

docs:
https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows

- repo-related triggers:
  - push
  - pull_request
  - create
  - fork
- other
  - workflow_dispatch: manual trigger
  - repository_dispatch: REST API request trigger
  - schedule: CRON-ish
  - workflow_call: called by other workflows

Eg: `on: push` or `on: [push, workflow_dispatch]`

### Triggers example

```yml
name: My Workflow 2
on:
  push:
    branches:
      - main
      - develop
  pull_request:
    types: [assigned, opened]
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - name: On Push
        run: echo "Pushed!"
```

## Filter patterns

cheat sheet:
https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet

## Actions

Actions vs commands:

- Action:
  - An app that performs a frequently-repeated task
  - `uses` keyword
  - official or community
- Command:
  - A user-defined shell command
  - `run` keyword

### Actions example

```yaml
name: Test Node Project
on:
  pull_request:
    types: [assigned, opened]
jobs:
  test:
    runs-on: ubuntu-22.04
    steps:
      - name: Pull code
        uses: actions/checkout@v3
      - name: Install Node
        uses: actions/setup-node@v3
        with:
          node-version: 19
      - name: Install deps
        run: npm ci
      - name: Test code
        run: npm test
```

### Popular actions

- checkout
  - https://github.com/actions/checkout
- set up node
  - https://github.com/actions/setup-node

## Jobs

Multiple jobs are run in parallel by default.\
To run sequentially, use `needs` keyword.\
Eg: `needs: test` or `needs: [lint, test]`

```yaml
name: Deploy Node Project
on:
  push:
    branches:
      - master
jobs:
  test:
    runs-on: ubuntu-22.04
    steps:
      - name: Pull code
        uses: actions/checkout@v3
      - name: Install Node
        uses: actions/setup-node@v3
        with:
          node-version: 19
      - name: Install deps
        run: npm ci
      - name: Test code
        run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-22.04
    steps:
      - name: Pull code
        uses: actions/checkout@v3
      - name: Install Node
        uses: actions/setup-node@v3
        with:
          node-version: 19
      - name: Install deps
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Deploy
        run: echo "TODO add deploy logic"
```

## Expressions, Functions, Context Objects

- [Contexts](https://docs.github.com/en/actions/learn-github-actions/contexts)
- [Expressions](https://docs.github.com/en/actions/learn-github-actions/expressions)

```yaml
run: echo "${{ toJSON(github) }}
```

## Artifacts and Outputs

Artifacts for making files available to later steps.\
Outputs for making output values available to later steps.

- [Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)
- [Outputs](https://docs.github.com/en/actions/using-jobs/defining-outputs-for-jobs)

## Caching dependencies

Cache frequently-used files (eg: deps) to reduce network utilization, runtime,
and cost.

- [Caching](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)

## Variables and Secrets

- [Variables](https://docs.github.com/en/actions/learn-github-actions/variables)
- [Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## Control flow

- [Expressions](https://docs.github.com/en/actions/learn-github-actions/expressions)
- [Matrix](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)

## Reusing workflows

- [Reuse](https://docs.github.com/en/actions/using-workflows/reusing-workflows)

## Security

- [Permissions](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs)
- [Hardening security](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
