from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator, get_current_context
from airflow.utils.context import Context
from airflow.models import TaskInstance

with DAG(
    dag_id='basic-xcom',
    description='XCOM example',
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
    '''
    Example of XCOM usage
    NOTE: To access 'ti': use 'get_current_context', '**kwargs', or 'ti' param
    '''
    # Functions that read/write to xcom
    def get_message():
        ctx: Context = get_current_context()
        ti: TaskInstance = ctx['ti']  # pyright: ignore[reportTypedDictNotRequiredAccess]
        message = 'The inner machinations of my mind are an enigma.'
        ti.xcom_push(key='message', value=message)

    def uppercase():
        ctx = get_current_context()
        ti: TaskInstance = ctx['ti']  # pyright: ignore[reportTypedDictNotRequiredAccess]
        message: str = ti.xcom_pull(task_ids='get_message', key='message')
        res = message.upper()
        ti.xcom_push(key='message', value=res)

    def reverse():
        ctx = get_current_context()
        ti: TaskInstance = ctx['ti']  # pyright: ignore[reportTypedDictNotRequiredAccess]
        message: str = ti.xcom_pull(task_ids='uppercase', key='message')
        res = message[::-1]
        ti.xcom_push(key='message', value=res)

    def print_output():
        ctx = get_current_context()
        ti: TaskInstance = ctx['ti']  # pyright: ignore[reportTypedDictNotRequiredAccess]
        message: str = ti.xcom_pull(task_ids='reverse', key='message')
        print(message)

    # Functions -> tasks
    get_mesage_task = PythonOperator(task_id='get_message', python_callable=get_message)
    uppercase_task = PythonOperator(task_id='uppercase', python_callable=uppercase)
    reverse_task = PythonOperator(task_id='reverse', python_callable=reverse)
    print_output_task = PythonOperator(task_id='print_output', python_callable=print_output)

    # Task dependencies
    get_mesage_task >> uppercase_task >> reverse_task >> print_output_task  # pyright: ignore[reportUnusedExpression]
