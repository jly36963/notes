# ----------------
# sql / postgesql
# ----------------

# postgresql skills translate fairly well to Amazon redshitft, microsoft sql server, mysql, oracle db

# python/sql libraries
    # sqlite -- sqlite3
    # postgresql -- psycopg2
    # mysql -- mysql.connector

# installation
    # postgresql
    # pgadmin (3 -- in program, 4 -- in browser)
    # psycopg2

# ----------------
# docker
# ----------------

# persisting data
  # windows and OSX can't mount local volumes
  # use named volume

'''
docker volume create pgdata
'''

# docker-compose
'''
services:
  pg:
    container_name: pg
    build:
      context: ./postgres
      dockerfile: Dockerfile
    ports: 
      - "5432:5432"
    environment:
      POSTGRES_USER: 'postgres'
      POSTGRES_PASSWORD: 'postgres'
      POSTGRES_DB: 'excalnet'
    volumes:
      - ./postgres:/postgres
      - pgdata:/var/lib/postgresql/data
    restart: always

volumes:
  pgdata:
    external: true

'''


# ----------------
# commands (overview)
# ----------------

'SELECT' # extracts data from a database
'UPDATE' # updates data in a database
'DELETE' # deletes data from a database
'INSERT INTO' # inserts new data into a database
'CREATE DATABASE' # creates a new database
'ALTER DATABASE' # modifies a database
'CREATE TABLE' # creates a new table
'ALTER TABLE' # modifies a table
'DROP TABLE' # deletes a table
'CREATE INDEX' # creates an index (search key)
'DROP INDEX' # deletes an index

# ----------------
# where operators
# ----------------

'=' # equal
'<>' # not equal (some versions of SQL accept '!=')
'>' '<' '>=' '<='
'BETWEEN' # between an inclusive range
'LIKE' # search for a pattern
'IN' # specify multiple possible values for a column
'AND'
'OR'
'NOT'
'AND' 'OR' # Condition 'AND' (Condition 'OR' Condition)

# ----------------
# commands (db)
# ----------------

'CREATE DATABASE db_name;' # create db
'DROP DATABASE db_name;' # drop db

# ----------------
# commands (table)
# ----------------

# create table
'''
CREATE TABLE table_name (
  column1   data_type,
  column2   data_type,
  column3   data_type
  );
'''
# drop table 
'DROP TABLE table_name;'

# ----------------
# commands (insert)
# ----------------

# insert row into table 
"INSERT INTO t1 VALUES ('value1', 'value2', 'value3');"
# insert row into table (flexible, can skip rows or go out of order)
"INSERT INTO t1 (column1, column2, column3) VALUES ('value1', 'value2', 'value3');"

# ----------------
# commands (select)
# ----------------

# select (all columns from table)
"SELECT * FROM table1;"
# select (condition)
'SELECT * FROM table1 WHERE name="ax0n";'
'SELECT * FROM table1 WHERE name IN ("axon", "tesseract", "mandlebrot);'
# select specific columns
"SELECT col1, col2, col3 FROM table1;"
# group by (group by c1, find max c2 in each group)
'SELECT c1, max(c2) FROM t1 GROUP BY c1;'
# having (like 'where' clause, but after grouping/aggregating)
'SELECT c1, max(c2) FROM t1 GROUP BY c1 HAVING c1 IN ("A1", "A2", "A3");'
# order by
"SELECT vendor_id, vendor_name FROM vendors ORDER BY vendor_name"
# get unique (distinct) values 
'SELECT DISTINCT col1 FROM table1;'

# ----------------
# commands (alter/delete/update)
# ----------------

# update (update values for specific row)
"UPDATE t1 SET name = 'Soca', age = 2, WHERE id = 101;"
# delete row (delete rows that meet condition)
'DELETE FROM t1 WHERE c1 = "unassigned";'
# alter table (add column)
'ALTER TABLE t1 ADD COLUMN c1 data_type;'
# alter table (drop column)
'ALTER TABLE t1 DROP COLUMN c1;'
# alter table (rename table)
'ALTER TABLE t1 RENAME TO t_1;'
# alter table (rename column)
'ALTER TABLE t1 RENAME COLUMN c1 TO c_1;'
# alter table (data type)
'ALTER TABLE t1 ALTER COLUMN c1 TYPE data_type;'
# set default value
'ALTER TABLE t1 ALTER COLUMN c1 SET DEFAULT some_value;'
# unset default value
'ALTER TABLE t1 ALTER COLUMN c1 DROP DEFAULT;'


# ----------------
# transactions (all or nothing, rolls back if it can't complete)
# ----------------
'''
BEGIN;
UPDATE accounts SET balance = balance - 100.00
    WHERE name = 'Alice';
UPDATE branches SET balance = balance - 100.00
    WHERE name = (SELECT branch_name FROM accounts WHERE name = 'Alice');
UPDATE accounts SET balance = balance + 100.00
    WHERE name = 'Bob';
UPDATE branches SET balance = balance + 100.00
    WHERE name = (SELECT branch_name FROM accounts WHERE name = 'Bob')
COMMIT;
'''

# ----------------
# connect (postgres/psycopg2)
# ----------------

# import
import psycopg2

# connection string
conn = psycopg2.connect("dbname=suppliers user=postgres password=postgres")
# connection named arguments
conn = psycopg2.connect(host="localhost",database="suppliers", user="postgres", password="postgres")
# connection kwargs
params = {'host': 'localhost', 'database': 'db_name', 'user': 'postgres', 'password':'postgres'}
conn = psycopg2.connect(**params)

# cursor
cursor = conn.cursor()

# print version
cursor.execute('SELECT version();')
db_version = cursor.fetchone()
print(f"PostgreSQL version: {db_version}")

# close connection
cursor.close()

# ----------------
# create tables (more detailed example)
# ----------------

import psycopg2
from config import config


def create_tables():
    """ create tables in the PostgreSQL database"""
    commands = (
        """
        CREATE TABLE vendors (
            vendor_id SERIAL PRIMARY KEY,
            vendor_name VARCHAR(255) NOT NULL
        )
        """,
        """ 
        CREATE TABLE parts (
            part_id SERIAL PRIMARY KEY,
            part_name VARCHAR(255) NOT NULL
        )
        """,
        """
        CREATE TABLE part_drawings (
            part_id INTEGER PRIMARY KEY,
            file_extension VARCHAR(5) NOT NULL,
            drawing_data BYTEA NOT NULL,
            FOREIGN KEY (part_id)
            REFERENCES parts (part_id)
            ON UPDATE CASCADE ON DELETE CASCADE
        )
        """,
        """
        CREATE TABLE vendor_parts (
            vendor_id INTEGER NOT NULL,
            part_id INTEGER NOT NULL,
            PRIMARY KEY (vendor_id , part_id),
            FOREIGN KEY (vendor_id)
                REFERENCES vendors (vendor_id)
                ON UPDATE CASCADE ON DELETE CASCADE,
            FOREIGN KEY (part_id)
                REFERENCES parts (part_id)
                ON UPDATE CASCADE ON DELETE CASCADE
        )
        """
    )
    conn = None
    try:
        # read the connection parameters
        params = {'host': 'localhost', 'database': 'db_name', 'user': 'postgres', 'password':'postgres'}
        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)
        cursor = conn.cursor()
        # create table one by one
        for command in commands:
            cursor.execute(command)
        # close communication with the PostgreSQL database server
        cursor.close()
        # commit the changes
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()


if __name__ == '__main__':
    create_tables()


# ----------------
# add to table (continuation of above example)
# ----------------

# insert one
def insert_vendor(vendor_name):
    """ insert a new vendor into the vendors table """
    sql = "INSERT INTO vendors(vendor_name) VALUES(%s) RETURNING vendor_id;"
    conn = None
    vendor_id = None
    try:
        # read database configuration
        params = {'host': 'localhost', 'database': 'db_name', 'user': 'postgres', 'password':'postgres'}
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cursor = conn.cursor()
        # execute the INSERT statement
        cursor.execute(sql, (vendor_name,))
        # get the generated id back
        vendor_id = cursor.fetchone()[0]
        # commit the changes to the database
        conn.commit()
        # close communication with the database
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

    return vendor_id

# insert many
def insert_vendor_list(vendor_list):
    """ insert multiple vendors into the vendors table  """
    sql = "INSERT INTO vendors(vendor_name) VALUES(%s)"
    conn = None
    try:
        # read database configuration
        params = {'host': 'localhost', 'database': 'db_name', 'user': 'postgres', 'password':'postgres'}
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cursor = conn.cursor()
        # execute the INSERT statement
        cursor.executemany(sql,vendor_list)
        # commit the changes to the database
        conn.commit()
        # close communication with the database
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

    return vendor_id

# update
def update_vendor(vendor_id, vendor_name):
    """ update vendor name based on the vendor id """
    sql = "UPDATE vendors SET vendor_name = %s WHERE vendor_id = %s"
    conn = None
    updated_rows = 0
    try:
        # read database configuration
        params = {'host': 'localhost', 'database': 'db_name', 'user': 'postgres', 'password':'postgres'}
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cursor = conn.cursor()
        # execute the UPDATE  statement
        cursor.execute(sql, (vendor_name, vendor_id))
        # get the number of updated rows
        updated_rows = cursor.rowcount
        # Commit the changes to the database
        conn.commit()
        # Close communication with the PostgreSQL database
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

    return updated_rows

# ----------------
# read from table (continuation of above example)
# ----------------

# fetchone
def get_vendors():
    """ query data from the vendors table """
    conn = None
    try:
        params = {'host': 'localhost', 'database': 'db_name', 'user': 'postgres', 'password':'postgres'}
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute("SELECT vendor_id, vendor_name FROM vendors ORDER BY vendor_name")
        print("The number of parts: ", cur.rowcount)
        row = cur.fetchone()

        while row is not None:
            print(row)
            row = cur.fetchone()

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    get_vendors()

# fetchall
def get_parts():
    """ query parts from the parts table """
    conn = None
    try:
        params = {'host': 'localhost', 'database': 'db_name', 'user': 'postgres', 'password':'postgres'}
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute("SELECT part_id, part_name FROM parts ORDER BY part_name")
        rows = cur.fetchall()
        print("The number of parts: ", cur.rowcount)
        for row in rows:
            print(row)
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    get_parts()

# fetchmany
def iter_row(cursor, size=10):
    while True:
        rows = cursor.fetchmany(size)
        if not rows:
            break
        for row in rows:
            yield row

def get_part_vendors():
    """ query part and vendor data from multiple tables"""
    conn = None
    try:
        params = {'host': 'localhost', 'database': 'db_name', 'user': 'postgres', 'password':'postgres'}
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute("""
            SELECT part_name, vendor_name
            FROM parts
            INNER JOIN vendor_parts ON vendor_parts.part_id = parts.part_id
            INNER JOIN vendors ON vendors.vendor_id = vendor_parts.vendor_id
            ORDER BY part_name;
        """)
        for row in iter_row(cur, 10):
            print(row)
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    get_part_vendors()

# ----------------
# delete from table (continuation of above example)
# ----------------


def delete_part(part_id):
    """ delete part by part id """
    conn = None
    rows_deleted = 0
    try:
        # read database configuration
        params = {'host': 'localhost', 'database': 'db_name', 'user': 'postgres', 'password':'postgres'}
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()
        # execute the UPDATE  statement
        cur.execute("DELETE FROM parts WHERE part_id = %s", (part_id,))
        # get the number of updated rows
        rows_deleted = cur.rowcount
        # Commit the changes to the database
        conn.commit()
        # Close communication with the PostgreSQL database
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

    return rows_deleted

# ----------------
#
# ----------------



# ----------------
#
# ----------------



# ----------------
#
# ----------------



# ----------------
#
# ----------------



# ----------------
#
# ----------------



# ----------------
#
# ----------------



# ----------------
#
# ----------------



# ----------------
#
# ----------------



