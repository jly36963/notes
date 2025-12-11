# Airflow

## Docs

- Docs
  - https://airflow.apache.org/docs/
  - https://airflow.apache.org/docs/apache-airflow/stable/index.html
- Core concepts
  - https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/index.html
- Best practices
  - https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html
- Tutorial
  - https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html

## Manual local setup

### Installation and setup

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
```

Customizing `airflow.cfg`:

- Update `dags_folder` for custom path to dags folder
- Reflect DAG file changes in ui
  - Update `min_file_process_interval` and `dag_dir_list_interval`
  - [Triggering dags after changes](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html#triggering-dags-after-changes)
- Hide examples: `load_examples = False`

### Start servers

```bash
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

## Docker local setup

### Docs

- Airflow/docker docs:
  - https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html
- Docker compose yaml
  - https://airflow.apache.org/docs/apache-airflow/2.7.0/docker-compose.yaml
- Docker airflow image docs
  - https://airflow.apache.org/docs/docker-stack/index.html

### Notes

- Several directories are mounted
  - dags, logs, config, plugins
- Needs at least 4GB RAM, preferably >8GB.

- Running CLI Commands:
  - `docker compose run airflow-worker airflow info`

### Setup

```bash
# Create user
docker compose run airflow-worker airflow users create \
  --role Admin \
  --username <user> \
  --password <password> \
  --email <email> \
  --firstname <firstname> \
  --lastname <lastname>
```

- Turn off examples
  - `AIRFLOW__CORE__LOAD_EXAMPLES: 'false'`
