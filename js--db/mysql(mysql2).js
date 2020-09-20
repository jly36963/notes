// ------------
// mysql
// ------------

// mysql -- mysql client (like psycopg2)
  // https://github.com/mysqljs/mysql

// mysql2 -- mysql client (works with sequelize) (mostly compatible with mysql)
  // https://www.npmjs.com/package/mysql2
// sequelize -- mysql ORM (like SQLAlchemy)
  // https://sequelize.org/master/manual/getting-started
  // https://sequelize.readthedocs.io/en/1.7.0/docs/usage/

// ------------
// docker 
// ------------

// persisting data
  // windows and OSX can't mount local volumes
  // use named volume

'docker volume create mysqldata'

// docker-compose
`
services:
  mysql:
    container_name: mysql
    image: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 'example'
      MYSQL_DATABASE: 'db'
      MYSQL_USER: 'user'
      MYSQL_PASSWORD: 'password'
    ports:
      - "3306:3306"
    volumes:
      - mysqldata:/var/lib/mysql
    
volumes:
  mysqldata:
    external: true
`

// ------------
// npm (mysql nodejs drivers)
// ------------

'npm install --save mysql' // no sequelize support
'npm install --save mysql2' // yes sequelize support

// ------------
// connection
// ------------

// imports
  // const mysql = require('mysql');
const mysql = require('mysql2'); 
// connection
const connection = mysql.createConnection({
  host: 'http://mysql:3306',
  user: 'user',
  password: 'password',
  database: 'db1'
});

// async CRUD
  // https://www.codementor.io/joanvasquez/a-simple-crud-using-mysql-and-node-js-p2xvvt6q8
// async connection/query
  // https://stackoverflow.com/questions/44004418/node-js-async-await-using-with-mysql
  // https://stackoverflow.com/questions/51985396/node-js-using-async-await-with-mysql
// transaction
  // https://dev.mysql.com/doc/refman/8.0/en/commit.html
  // can't be rolled back -- create/drop databases, create/drop/alter tables

const runQuery = async (config, sqlQuery, useTransactions = true) => {
  let connection;
  try {
    // create connection
    connection = await mysql.createConnection(config);
    // run query
    if (useTransactions) await connection.query('START TRANSACTION');
    const result = await connection.query(sqlQuery);
    if (useTransactions) await connection.query('COMMIT');
    return result;
  } catch (err) {
    if (connection && useTransactions) await connection.query('ROLLBACK');
    console.error(err.message);
  } finally {
    if (connection && connection.end) connection.end();
  }
}

let config = { host: 'http://mysql:3306', user: 'user', password: 'password', database: 'db1' };
let sqlQuery = 'SELECT * FROM table1 WHERE name="Kakashi";'
runQuery(config, sqlQuery);

// ------------
// connection (pooling)
// ------------

// imports
const mysql = require('mysql');

// pool.query (shortcut for pool.getConnection(), connection.query(), connection.release())
const runQuery = async (config, sqlQuery) => {
  let pool;
  try {
    pool = await mysql.createPool(config);
    const result = await pool.query(sqlQuery);
    return result;
  } catch (err) {
    console.error(err.message);
  }
}
// pool.getConnection()
const runQuery = async (config, sqlQuery) => {
  let pool;
  let connection;
  try {
    pool = await mysql.createPool(config);
    connection = await pool.getConnection();
    const result = await connection.query(sqlQuery);
    return result;
  } catch (err) {
    console.error(err.message);
  } finally {
    if (connection && connection.release) connection.release();
    // close -- connection.release() connection.destroy() pool.end()
  }
}

let config = { 
  connectionLimit: 10, // maximum connections at once
  host: 'http://mysql:3306', 
  user: 'user', 
  password: 'password',
  database: 'db1',
  waitForConnections: true // connection limit reached, keep connection requests queued
};
let sqlQuery = 'SELECT * FROM table1 WHERE name="Kakashi";'
runQuery(config, sqlQuery);


// ----------------
// commands(db)
// ----------------

'CREATE DATABASE db_name;' // create db
'SHOW databases;' // list databases
'DROP DATABASE db_name;' // drop db

// ----------------
// commands(use database)
// ----------------

// specify which database to work on
  // postgres does not have this -- database is specified in connection
'USE db_name;' // specify the context (database) to work in
'SELECT database();' // return which db is currently being used

// ----------------
// commands(table)
// ----------------

// types (case-insensitive)
  // common types -- VARCHAR, INT, DECIMAL, DATETIME, TIMESTAMP, 
  // less common -- CHAR, DATE, TIME, BIGINT, FLOAT/DOUBLE (approximate), etC
// constraints (NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT)
  // first_name VARCHAR(30) NOT NULL
    // if no value provided, default INT is 0, default VARCHAR is ''
  // age INT CHECK (age > 0)
  // created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  // user_id INT AUTO_INCREMENT PRIMARY KEY

// create table
`
CREATE TABLE t1(
  c1   data_type,
  c2   data_type,
  c3   data_type,
  PRIMARY KEY(c1)
  FOREIGN KEY(c2)
    REFERENCES t2(col_from_t2)
);
`
// example
`
CREATE TABLE jonin(
  jonin_id INT NOT NULL AUTO_INCREMENT,
  village_id INT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  age INT,
  weight DECIMAL,
  PRIMARY KEY(jonin_id)
  FOREIGN KEY(village_id)
    REFERENCES villages(village_id),
);
`
// example insert
`
INSERT INTO jonin (village_id, first_name, last_name, age, weight)
VALUES (1, "Kakashi", "Hatake", 46, 160.5);
`
// describe table (get column names)
'DESC t1';
// drop table
'DROP TABLE t1;'

// ----------------
// commands(insert)
// ----------------

// insert row into table
"INSERT INTO t1 VALUES ('value1', 'value2', 'value3');"
// insert row into table(flexible, can skip rows or go out of order)
"INSERT INTO t1 (column1, column2, column3) VALUES ('value1', 'value2', 'value3');"
// multiple inserts
`
INSERT INTO t1
  (c1, c2, c3)
VALUES
  (v1, v2, v3),
  (v1, v2, v3),
  (v1, v2, v3);
`

// ----------------
// commands(select)
// ----------------

// select(all columns from table)
'SELECT * FROM table1;'
// select(condition)
'SELECT * FROM table1 WHERE name = "Itachi";'
'SELECT * FROM table1 WHERE name IN ("Kakashi", "Konohamaru", "Iruka);'
// select specific columns
'SELECT col1, col2, col3 FROM table1;'
// group by(group by c1, find max c2 in each group)
'SELECT c1, max(c2) FROM t1 GROUP BY c1;'
// having(like 'where' clause, but after grouping / aggregating)
'SELECT c1, max(c2) FROM t1 GROUP BY c1 HAVING c1 IN ("A1", "A2", "A3");'
// order by
'SELECT vendor_id, vendor_name FROM vendors ORDER BY vendor_name;'
// get unique(distinct) values
'SELECT DISTINCT col1 FROM table1;'
// select with alias
'SELECT column1 AS c1, column2 as c2 FROM t1;'

// ----------------
// commands (delete/update records)
// ----------------

// update (update values for rows that match condition)
  // try selecting first, then updating (make sure you're updating the desired records)
'UPDATE t1 SET name = "Konohamaru", age = 28, WHERE id = 101;'
// delete row (delete rows that meet condition)
'DELETE FROM t1 WHERE c1 = "unassigned";'

// ----------------
// commands (alter table)
// ----------------

// alter table (add column)
'ALTER TABLE t1 ADD COLUMN c1 data_type;'
// alter table (drop column)
'ALTER TABLE t1 DROP COLUMN c1;'
// alter table (rename table)
'ALTER TABLE t1 RENAME TO t_1;'
// alter table (rename column)
'ALTER TABLE t1 RENAME COLUMN c1 TO c_1;'
// alter table (data type)
'ALTER TABLE t1 ALTER COLUMN c1 TYPE data_type;'
// set default value
'ALTER TABLE t1 ALTER COLUMN c1 SET DEFAULT some_value;'
// unset default value
'ALTER TABLE t1 ALTER COLUMN c1 DROP DEFAULT;'

// ----------------
// commands (create tables)
// ----------------

`
CREATE TABLE vendors(
  vendor_id SERIAL PRIMARY KEY,
  vendor_name VARCHAR(255) NOT NULL
)
CREATE TABLE parts(
  part_id SERIAL PRIMARY KEY,
  part_name VARCHAR(255) NOT NULL
)
CREATE TABLE part_drawings(
  part_id INTEGER PRIMARY KEY,
  file_extension VARCHAR(5) NOT NULL,
  drawing_data BYTEA NOT NULL,
  FOREIGN KEY(part_id)
    REFERENCES parts(part_id)
    ON UPDATE CASCADE ON DELETE CASCADE
)
CREATE TABLE vendor_parts(
  vendor_id INTEGER NOT NULL,
  part_id INTEGER NOT NULL,
  PRIMARY KEY(vendor_id, part_id),
  FOREIGN KEY(vendor_id)
    REFERENCES vendors(vendor_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(part_id)
    REFERENCES parts(part_id)
    ON UPDATE CASCADE ON DELETE CASCADE
)
`



// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------






// ------------
// faker (populate db with fake info)
// ------------

// install
'npm install faker --save'

// imports
const faker = require('faker');
// populate function
const addFakeUsers = async (n) => {
  // exit if 'n' is not positive
  if (n < 1) return null;
  // connection config
  let config = {
    host: 'http://mysql:3306',
    user: 'user',
    password: 'password',
    database: 'db1',
  };
  // create user strings
  let userStrings = [];
  for (var i = 0; i < n; i++) {
    const userString = `(
      ${faker.name.findName()}, 
      ${faker.internet.email()}, 
      ${faker.address.streetAddress()}, 
      ${faker.address.city()}, 
      ${faker.address.state()},
      ${faker.date.past()}
    )`;
    userStrings.push(userString);
  }
  // join userStrings
  let userStringsJoined = userStrings.join(',\n');
  // prepare query
  let sqlQuery = `
    INSERT INTO users (name, email, address, city, state, create_date)
    VALUES 
      ${userStringsJoined}
    ;
  `;
  // declare connection
  let connection;
  try {
    // create connection
    connection = await mysql.createConnection(config);
    // run query
    await connection.query('START TRANSACTION');
    const result = await connection.query(sqlQuery);
    await connection.query('COMMIT');
    return result;
  } catch (err) {
    await connection.query('ROLLBACK');
    console.error(err.message);
  } finally {
    if (connection && connection.end) connection.end();
  }
}




