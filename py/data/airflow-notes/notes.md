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
- Tags: given to DAGs to be used for filtering in the ui
- Dynamic DAG Generation
  - Generate DAG structure dynamically (with static number of tasks)

Task:

- Each node in a DAG is a task
- Individual unit of code
- Can have upstream/downstream dependencies
  - `task1 >> task2 >> task3`
  - `task2.set_upstream(task1)` or `task1.set_downstream(task1)`
  - also `cross_downstream`, `chain`
- Can get context in task func using:
  - `**kwargs` param
    - Eg: `ti = kwargs['ti']`
  - `ti` param
  - `get_current_context` function
- Control Flow
  - Branching:
    - Conditional choice of task
  - Trigger rules:
    - Conditions for DAG running task
    - Eg: `all_success`, `none_failed`
  - Setup/Teardown:
    - Set setup/teardown relationships
    - `as_setup`, `as_teardown` methods
    - Eg: `task1.as_setup() >> task2 >> task3.as_teardown()`
  - Latest Only:
    - Only run task when DAG runs against the present
- Dynamic Task Mapping
  - Runtime creation of a variable number of tasks
  - ie: Mapping a task to multiple inputs

Operator:

- Templates for predefined tasks
- Operator tutorial
  - https://airflow.apache.org/docs/apache-airflow/stable/howto/operator/index.html
- Examples
  - BashOperator: executes a bash command or template
  - PythonOperator: executes a python function
  - DummyOperator: does nothing (never processed by executor)
  - SimpleHttpOperator: makes a network request
  - ShortCircuitOperator: continue if truthy, exit if falsy
  - TriggerDagRunOperator: triggers another DAG (specified `dag_id`)
  - BranchPythonOperator: choose downstream task(s) to execute
    - return task_id (or list) from `python_callable` (the others are skipped)
  - SQL
    - PostgresOperator: executes a sql script
    - MySqlOperator: executes a sql script
  - AWS
    - S3: S3CopyObjectOperator, S3ListOperator, etc
  - EmailOperator: sends an email
  - SlackAPIOperator: sends a slack message

XComs (Cross communications):

- A system for communication between tasks
- Eg: push metadata (in task1) then pull data (in task2)
- For relatively small data
  - If large data, store in s3 (or similar) and pass bucket/key via XCom

TaskFlow:

- Abstraction to simplify python-only DAGs
- Define a DAG using python decorators (Eg: `@dag`, `@task`)
- Task inputs/outputs are piped/handled appropriately

Scheduling:

- DAGs are scheduled using `start_date`, `schedule_interval`, `end_date`
- Accepts datetime object, CRON string, preset string, None (manual)
  - presets: `@hourly`, `@daily`, etc
- Historical runs: catchup (DAG param) or backfill (CLI command)
- Timetables: pythonic alternative to cron

Connections/Hooks:

- Connections
  - Abstraction for DAL connection
  - Stores connection url, creds, etc
  - UI: Admin > Connections > fill form
- Hooks
  - High-level interface for external platform operations
  - Used to build custom Operators

Executor:

- How/where the tasks should be executed
- Eg: Local, Celery, Kubernetes, CeleryKubernetes, Debug

Providers:

- provider packages for communicating with services

Sensors:

- Wait for something to happen
- Great for blocking downstream tasks until something is ready
- Examples
  - PythonSensor: Waits (pokes) until `python_callable` returns `True`
  - HttpSensor: Waits (pokes) using http GET statement
    - By default, uses response status to determine success/fail/error
    - Can use `response_check` func instead

Variables:

- Adding variables
  - ui (Admin -> Variables)
  - env vars (like `AIRFLOW_VAR_{VARIABLE_NAME}`)
  - CLI (`airflow variables <sub-cmd>`)
- Getting variables
  - Eg: `foo = Variable.get("foo") # airflow.models.Variable`
  - Args: `deserialize_json`, `default_var`

## Airflow & Python

DAG:

- class in dag files for orchestrating tasks
- can be used in 3 ways
  - context manager, class as operator param, decorator

default_args:

- DAG param
- dictionary of default params as kwargs for initializing operators
- operator `default_args` will override DAG default_params

## DAG Best practices

Astronomer:

- https://docs.astronomer.io/learn/dag-best-practices

General:

- Idempotency
- Atomicity
- Support incremental operations
- Avoid top-level code
- Avoid complexity

## Underlying technologies

- Can leverage Jinja templating
- Uses Flask server
- Uses sql-alchemy for DB logic
- Uses sqlite by default, recommends postgres/mysql for prod
