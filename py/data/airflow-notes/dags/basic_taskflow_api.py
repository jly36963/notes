from datetime import datetime, timedelta
from airflow.decorators import dag, task


@dag(
    dag_id='basic-taskflow-api',
    description='Taskflow API example',
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
    '''Example of Taskflow API usage'''
    @task()
    def get_message() -> str:
        return 'The inner machinations of my mind are an enigma.'

    @task()
    def uppercase(message: str) -> str:
        return message.upper()

    @task()
    def reverse(message: str) -> str:
        return message[::-1]

    @task()
    def print_output(message: str) -> None:
        print(message)

    message = get_message()
    upper_message = uppercase(message)
    reversed_message = reverse(upper_message)
    print_output(reversed_message)


make_dag()
