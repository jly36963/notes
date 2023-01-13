# Github Actions

Github actions are typically used to automate CI/CD on incoming code changes.

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
  - shell script or action
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

### Workflow file basics

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
      # Multiline script
      - name: Greeting
        run: |
          echo "Hello friend!"
          echo "How have you been?"
```

### Simple workflow triggers (events)

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

```yml
name: My Workflow 2
on:
  push:
    branches:
      - main
      - develop
  pull_request:
    types: [ assigned, opened ]
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
