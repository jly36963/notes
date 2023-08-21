from datetime import datetime, timedelta
from textwrap import dedent
from airflow import DAG
from airflow.operators.bash import BashOperator

with DAG(
    'basic-bash-operator',
    description='Bash operator usage',
    default_args={
        'owner': 'airflow',
        'email': [],
        'email_on_failure': False,
        'email_on_retry': False,
        'retries': 2,
        'retry_delay': timedelta(minutes=5),
    },
    schedule='@daily',
    start_date=datetime(2020, 1, 1),
    catchup=False
) as dag:
    task1 = BashOperator(
        task_id='date',
        bash_command='date'
    )
    task2 = BashOperator(
        task_id='pwd',
        bash_command='pwd',
    )

    TEMPLATE_COMMAND = dedent('''
    {% for i in range(5) %}
        echo "{{ i }}"
    {% endfor %}
    ''')

    task3 = BashOperator(
        task_id='count',
        bash_command=TEMPLATE_COMMAND,
    )

    task1 >> task2 >> task3  # type: ignore[reportUnusedExpression]
