from datetime import datetime, timedelta
from typing import List
from airflow.decorators import dag, task


@dag(
    dag_id='basic-dynamic-task-mapping',
    description='Dynamic task mapping example',
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
)
def make_dag():
    '''Example of dynamic task mapping'''
    @task()
    def get_messages() -> List[str]:
        return [
            "No one can know, not even Squidward's house!",
            'FINLAND!',
            "Where's the leak, ma'am?",
            "Did you try setting it to Wumbo?",
        ]

    @task()
    def lower(message: str) -> str:
        return message.lower()

    @task()
    def print_message(message: str) -> None:
        print(message)

    messages = get_messages()
    lower_messages = lower.expand(message=messages)
    print_message.expand(message=lower_messages)


make_dag()
