# ---------
# psycopg2
# ---------

# ---
# imports
# ---

from typing import Union, List, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from pypika import Query, Table, Field, PostgreSQLQuery
import arrow

# ---
# docker
# ---

# docker-compose
'''
services:
  pg:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always

volumes:
  pgdata:
'''

# ---
# info
# ---

# docs
# https://www.psycopg.org/docs/connection.html
# https://www.psycopg.org/docs/cursor.html

# postgresql skills translate fairly well to other RDBMS
# ie -- Amazon redshitft, microsoft sql server, mysql, oracle db

# ---
# drivers
# ---

# sqlite -- sqlite3
# postgresql -- psycopg2
# mysql -- mysql.connector

# ---
# install
# ---

# installing psycopg2 with deps
# https://stackoverflow.com/a/46877364

'''
# install deps (mac)
brew install postgresql

# install deps (ubuntu)
sudo apt install libpq-dev python3-dev

# install psycopg2 driver
pip install psycopg2 # might not work
pip install psycopg2-binary

# install pypika
pip install pypika
'''

# ---
# connection class
# ---

# close() -- close connection
# cursor() -- create cursor
# commit() -- commit any pending transition to the db
# cancel() -- cancel current database operation
# reset() -- reset the connection to default (roll back pending transaction)

# connect (string) (user:pw@host:port/db)
conn_string = "postgresql://postgres:postgres@localhost:5432/postgres"


def get_conn_using_string(conn_string):
    conn = psycopg2.connect(conn_string)
    return conn


# connect (kwargs)
conn_kwargs = {
    'host': 'localhost',
    'database': 'postgres',
    'user': 'postgres',
    'password': 'postgres'
}


def get_conn_using_kwargs(conn_kwargs):
    conn = psycopg2.connect(**conn_kwargs)
    return conn


# connect (regular)
conn = psycopg2.connect(
    host="localhost",
    database="postgres",
    user="postgres",
    password="postgres"
)

# ---
# cursor
# ---

# close() -- close cursor
# execute(query, vars=None) -- execute query
# fetchone() -- fetch the next row of a query result set
# fetchMany(int) -- fetch next 'n' rows as list of tuples
# fetchall() -- fetch all/remaining rows as list of tuples
# query -- string of last query executed (including bound arguments)
# rowcount -- number of rows from last execution


def use_cursor(conn):
    # create
    cursor = conn.cursor()
    # use
    cursor.execute('SELECT version();')
    db_version = cursor.fetchone()
    print(f"PostgreSQL version: {db_version}")
    # close
    cursor.close()

# ---
# cursor (context)
# ---


def use_cursor_context(conn):
    with conn.cursor() as cursor:
        # cursor exists here
        cursor.execute('SELECT version();')
        db_version = cursor.fetchone()
        print(f"PostgreSQL version: {db_version}")

# cursor doesn't exist here

# ---
# cursor (dictionaries)
# ---

# https://stackoverflow.com/questions/21158033/query-from-postgresql-using-python-as-dictionary

# return rows as dictionaries (instead of tuples)


def select_returning_dict(conn, query):
    with conn.cursor(cursor_factory=RealDictCursor):
        cursor.execute(query)
        row = dict(cursor.fetchOne())
        print(row)


# ---
# pypika wrapper
# ---

# TODO -- fix soft_delete (table.deleted_at.notnull())
# TODO -- create own query builder
# TODO -- allow for chaining

class PypikaExecutor:

    def __init__(self, conn):
        self.conn = conn

    @staticmethod
    def get_dicts_from_cursor(cursor) -> Union[List[Dict[str, Any]], None]:
        columns = [desc[0] for desc in cursor.description]
        values_list = cursor.fetchall()
        rows = []
        for values in values_list:
            row = dict(zip(columns, values))
            rows.append(row)
        return rows

    def raw(self, query: str) -> Union[Any, None]:
        print(query)
        conn = self.conn
        result = None
        try:
            with conn.cursor() as cursor:
                result = cursor.execute(query)
            conn.commit()
            return result
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)

    def execute_query(self, query: str) -> Union[Any, None]:
        print(query)
        conn = self.conn
        rows = None
        try:
            with conn.cursor() as cursor:
                cursor.execute(query)
                rows = self.get_dicts_from_cursor(cursor)
            conn.commit()
            return rows
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)

    def insert_one(
        self, 
        table_name: str, 
        entry: dict
    ) -> Union[Dict[str,Any], None]:
        table = Table(table_name)
        qb = (
            PostgreSQLQuery
            .into(table)
            .columns(*entry.keys())
            .insert(*entry.values())
            .returning('*')
        )
        sql = str(qb)
        rows = self.execute_query(sql)
        return rows[0] if (rows and len(rows)) else None

    def insert_many(
        self, 
        table_name: str, 
        entries: List[Dict[str, Any]]
    ) -> Union[List[Dict[str,Any]], None]:
        # TODO -- one query, rather than iteration
        rows = []
        for entry in entries:
            row = self.insert_one(table_name, entry)
            rows.append(row)
        return rows

    def find_one_by_id(
        self, 
        table_name: str, 
        row_id: int
    ) -> Union[Dict[str,Any], None]:
        table = Table(table_name)
        qb = (
            PostgreSQLQuery
            .from_(table)
            .select('*')
            .where(table.id == row_id)
            # .where(table.deleted_at.notnull())
        )
        sql = str(qb)
        rows = self.execute_query(sql)
        return rows[0] if (rows and len(rows)) else None

    def find_one(
        self, 
        table_name: str, 
        predicate: Dict[str, Any]
    ) -> Union[Dict[str,Any], None]:
        rows = self.find(table_name, predicate)
        return rows[0] if (rows and len(rows)) else None

    def find(
        self, 
        table_name: str, 
        predicate: Dict[str, Any]
    ) -> Union[List[Dict[str,Any]], None]:
        table = Table(table_name)
        qb = (
            PostgreSQLQuery
            .from_(table)
            # .where(table.deleted_at.notnull())
            .select('*')
        )
        for k, v in predicate.items():
            qb = qb.where(table[k] == v)
        sql = str(qb)
        rows = self.execute_query(sql)
        return rows

    def update_one_by_id(
        self, 
        table_name: str, 
        row_id: int, 
        updates: Dict[str,Any]
    ) -> Union[Dict[str,Any], None]:
        table = Table(table_name)
        qb = (
            PostgreSQLQuery
            .update(table)
            .where(table.id == row_id)
            # .where(table.deleted_at.notnull())
            .returning('*')
        )
        for k, v in updates.items():
            qb = qb.set(table[k], v)
        sql = str(qb)
        rows = self.execute_query(sql)
        return rows[0] if (rows and len(rows)) else None

    def delete_one_by_id(
        self, 
        table_name: str,
        row_id: int
    ) -> Union[Dict[str,Any], None]:
        self.update_one_by_id(
            table_name,
            row_id,
            {'deleted_at': str(arrow.utcnow())}
        )

    def hard_delete_one_by_id(
        self, 
        table_name: str, 
        row_id: int,
    ) -> Union[Dict[str,Any], None]:
        table = Table(table_name)
        qb = (
            PostgreSQLQuery
            .from_(table)
            .delete()
            .where(table.id == row_id)
            .returning('*')
        )
        sql = str(qb)
        rows = self.execute_query(sql)
        return rows[0] if (rows and len(rows)) else None


ppkx = PypikaExecutor(conn)


# ---
# create table
# ---

create_table_query = '''
CREATE TABLE IF NOT EXISTS ninjas(
    id SERIAL PRIMARY KEY,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
)
'''

ppkx.raw(create_table_query)


# ---
# insert
# ---

# insert one
inserted_row = ppkx.insert_one('ninjas', {
    'first_name': 'Kakashi',
    'last_name': "Hatake",
    'created_at': str(arrow.utcnow())
})

# insert many
inserted_rows = ppkx.insert_many('ninjas', [
    {
        'first_name': 'Kakashi',
        'last_name': "Hatake",
        'created_at': str(arrow.utcnow())
    },
    {
        'first_name': 'Hiruzen',
        'last_name': "Sarutobi",
        'created_at': str(arrow.utcnow())
    },
    {
        'first_name': 'Itachi',
        'last_name': "Uchiha",
        'created_at': str(arrow.utcnow())
    },
    {
        'first_name': 'Iruka',
        'last_name': "Umino",
        'created_at': str(arrow.utcnow())
    },
    {
        'first_name': 'Tenzo',
        'last_name': "Yamato",
        'created_at': str(arrow.utcnow())
    }
])

assert isinstance(inserted_row, dict)
assert isinstance(inserted_rows, list)

# ---
# select
# ---
    
print("row_id", inserted_row['id'])
# find one by id
row_found_by_id = ppkx.find_one_by_id('ninjas', inserted_row['id'])
# find one
row_found = ppkx.find_one('ninjas', {'id': inserted_row['id']})
# find
rows_found = ppkx.find('ninjas', {'id': inserted_row['id']})

# ---
# update
# ---

updated_row = ppkx.update_one_by_id('ninjas', inserted_row['id'], {
    'first_name': "Kaka Sensei",
    'updated_at': str(arrow.utcnow())
})

# ---
# delete
# ---

# soft delete
soft_deleted_row = ppkx.delete_one_by_id('ninjas', inserted_row['id'])

# hard delete
hard_deleted_row = ppkx.hard_delete_one_by_id('ninjas', inserted_row['id'])

# ---
# drop table
# ---

drop_table_query = '''
DROP TABLE IF EXISTS ninjas
'''

ppkx.raw(drop_table_query)

# ---
# results
# ---

print(
    "inserted_row", inserted_row,
    "inserted_rows", inserted_rows,
    "row_found_by_id", row_found_by_id,
    "row_found", row_found,
    "rows_found", rows_found,
    "updated_row", updated_row,
    "soft_deleted_row", soft_deleted_row,
    "hard_deleted_row", hard_deleted_row,
    sep='\n'
)
    
