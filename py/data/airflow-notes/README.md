# Airflow

## Docs

- https://airflow.apache.org/docs/
- https://airflow.apache.org/docs/apache-airflow/stable/index.html
- https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html

## Docker

- https://airflow.apache.org/docs/docker-stack/index.html
- https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html#fetching-docker-compose-yaml

## Installation and setup

```bash
# Install airflow
pipenv install apache-airflow
# Set AIRFLOW_HOME (`~/airflow` by default)
echo "AIRFLOW_HOME=${PWD}/airflow" >> .env
# Initialize backing database (sqlite by default)
pipenv run airflow db init
# Keep DB up to date (after swapping/upgrading DB or upgrading airflow)
pipenv run airflow db upgrade
# Make directory for DAGs
mkdir -p ./airflow/dags
# Create user
pipenv run airflow users create \
  --role Admin \
  --username <user> \
  --password <password> \
  --email <email> \
  --firstname <firstname> \
  --lastname <lastname>
# Run airflow server (default port 8080)
# View at localhost:8080/admin
pipenv run airflow webserver
# Start scheduler
pipenv run airflow scheduler
```

## CLI Usage

```bash
# Run task
pipenv run airflow run tutorial sleep <yyyy-mm-dd>
# List DAGs
pipenv run airflow dags list
# List tasks
pipenv run airflow list_tasks tutorial
# Pause DAG
pipenv run airflow pause tutorial
# Unpause DAG
pipenv run airflow unpause tutorial
# Backfill DAG (run for past dates)
pipenv run airflow dags backfill tutorial -s <yyyy-mm-dd> -e <yyyy-mm-dd>
```
