# Airflow notes

Airflow: a tool for automating/scheduling tasks/workflows

## Terms

DAG: Directed Acyclic Graph:

- Series of tasks in a workflow
- Can specify relationship/dependencies between tasks
- Uses dag_id
  - must be unique per airflow environment
- Uses `.py` files
- Specify `execution_date` (CRON) to schedule
- Operators: TODO

Task:

- Each node in a DAG is a task
- Individual unit of code
- Can have upstream/downstream dependencies
  - `task1 >> task2 >> task3`

Operator:

- Templates for predefined tasks
  - BashOperator: execuets any bash command
  - PythonOperator: executes a python function
  - DummyOperator: Does nothing (never processed by executor)
  - SimpleHttpOperator: makes a network request
  - SQL
    - PostgresOperator: executes a sql script
    - MySqlOperator: executes a sql script
  - AWS
    - S3: S3CopyObjectOperator, S3ListOperator, etc
  - TriggerDagRunOperator: triggers another DAG
  - EmailOperator: sends an email
  - SlackAPIOperator: sends a slack message

XComs (Cross communications):

- communication between tasks
- Eg: push metadata (in task1) then pull data (in task2)

TaskFlow:

- Abstraction to simplify python-only DAGs
- Define a DAG using python decorators (Eg: `@dag`, `@task`)
- Task inputs/outputs are piped/handled appropriately

Scheduling:

- DAGs are scheduled using `start_date`, `schedule_interval`, `end_date`
- Accepts datetime object, CRON string, preset string, None (manual)
  - presets: `@hourly`, `@daily`, etc
- Historical runs: catchup (DAG param) or backfill (CLI command)

Connections/Hooks:

- Connections
  - Abstraction for DAL connection
  - Stores connection url, creds, etc
- Hooks
  - High-level interface for external platform operations
  - Used to build custom Operators

Executor:

- How/where the tasks should be executed
- Eg: Local, Celery, Kubernetes, CeleryKubernetes, Debug

## DAG Best practices

- Idempotency
- Atomicity
- Support incremental operations
- Avoid top-level code
- Avoid complexity

## About

- Can leverage Jinja templating
- Uses Flask server
- Uses sql-alchemy for DB logic
- Uses sqlite by default, recommends postgres/mysql for prod

## Hide examples

In `airflow.cfg`:

```
load_examples = False
```

## Dependency example

```py
from airflow.models import DAG
from airflow.utils.dates import days_ago
from airflow.operators.dummy_operator import DummyOperator

with DAG(
    "my_dag",
    start_date=days_ago(1),
    schedule_interval=None,
) as dag:
    # Create tasks from operators
    task_a = DummyOperator(task_id="task_a")
    task_b = DummyOperator(task_id="task_b")
    task_c = DummyOperator(task_id="task_c")
    task_d = DummyOperator(task_id="task_d")
    # Define dependency graph
    task_a >> [task_b, task_c]
    task_c >> task_d
```
