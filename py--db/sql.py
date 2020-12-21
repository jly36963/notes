
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