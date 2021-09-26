// ----------
// knex
// ----------

// knex -- 'batteries included' SQL query builder 
  // supports postgres, mssql, mysql, mariadb, sqlite, oracle, and redshift

// docs
  // http://knexjs.org/

// install knex
`
npm i knex --save
`
// install drivers
`
npm i pg --save
npm i sqlite3 --save
npm i mysql --save
npm i mysql2 --save
npm i oracledb --save
npm i mssql --save
`
// date / time
`
npm i moment --save
`

// ----------
// imports
// ----------

const moment = require('moment');

// ----------
// initialize library
// ----------

// only initialize once (initialization creates connection pool)

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'postgres',
    database: 'db1'
  },
  migrations: {
    tableName: 'migrations'
  }
});

module.exports = knex;

// ----------
// create table
// ----------

module.exports = async (knex) => {
  await knex.schema.createTable('people', (table) => {
    table.increments(); // id (primary key)
    table.string('first_name'); // first name (string)
    table.string('last_name'); // first name (string)
    table.timestamps(); // created_at & updated_at (?????)
  })
}

// CREATE TABLE `users` (
// `id` int unsigned not null auto_increment primary key, 
// `first_name` varchar(255), 
// `last_name` varchar(255), 
// `created_at` datetime, 
// `updated_at` datetime
// );

// ----------
// rename table
// ----------

module.exports = async (knex) => {
  await knex.schema.renameTable('people', 'users')
}

// RENAME TABLE 'people' to 'users';

// ----------
// drop table
// ----------

module.exports = async (knex) => {
  await knex.schema.dropTable('users')
}

// DROP TABLE `users`;

// ----------
// insert
// ----------

module.exports = async (knex) => {
  const personId = await knex('people')
    .insert({
      first_name: 'Kakashi',
      last_name: 'Hatake',
      created_at: moment(),
      updated_at: moment(),
    })
    .returning('id')
  console.log(personId)
}

// INSERT INTO 'users' (
// 'first_name', 'last_name'
// ) 
// VALUES (
// 'Kakashi', 'Hatake'
// );

// ----------
// update
// ----------

// version 1 -- pass an object of values to update

module.exports = async (knex) => {
  const personId = await knex('people')
    .where({
      id: 1
    })
    .update({
      first_name: 'Tenzo',
      last_name: 'Yamato',
      updated_at: moment(),
    })
    .returning('id')
  console.log(personId)
}

// version 2
  // get object, update properties, use as input for update command

module.exports = async (knex) => {
  // get
  const person = await knex('people')
    .where({ id: 2 })
    .first();
  console.log(person);
  // update properties on user object
  person.first_name = 'Kakashi'
  person.last_name = 'Hatake'
  person.updated_at = moment()
  // update (using updated user object)
  const personId = await knex('people')
    .where({ id: 2 })
    .update(person)
    .returning('id')
  console.log(personId);
}

// ----------
//  del
// ----------

// return empty array if no match

module.exports = async (knex) => {
  const personId = await knex('people')
    .where({ id: 3 })
    .returning('id')
    .del()
  console.log(personId);
}


// ----------
// select
// ----------

module.exports = async (knex) => {
  const result = await knex
    .select(["first_name", "last_name"]) // default to '*' if no argument provided
    .from('people')
    .whereIn('first_name', [
      'Kakashi',
      'Tenzo'
    ])
    .groupBy('first_name')
    .groupBy('last_name')
    .having(knex.raw('count(*) >= 1'))
  console.log('result', result);
};

// SELECT first_name, last_name FROM people
// WHERE first_name IN ('Kakashi', 'Tenzo')
// GROUP BY first_name, last_name
// HAVING COUNT(*) >= 1;

// ----------
// select (omit '.from()')
// ----------

module.exports = async (knex) => {
  const result = await knex('table1')
    .select(['col1', 'col2'])
    .where('col3 > 5')
    return result;
}

// ----------
// select (raw)
// ----------

module.exports = async (knex) => {
  const query = `
  SELECT * FROM people
  WHERE first_name='Kakashi';
  `
  const result = await knex.raw(query);
  const { rows } = result;
  console.log(rows);
}


// ----------
// distinct
// ----------

module.exports = async(knex) => {
  const distinctFirstNames = await knex('people')
    .distinct('first_name');
  console.log(distinctFirstNames)
}

// SELECT DISTINCT 'first_name', 'last_name' FROM 'customers'

// ----------
// groupby & count
// ----------

module.exports = async (knex) => {
  const groups = await knex('people')
    .select('first_name', knex.raw('count(*) as people_count'))
    .groupBy('first_name')
  console.log(groups)
}

// ----------
// min max sum avg
// ----------

module.exports = async (knex) => {
  const max = await knex('people')
    .max('id')
  const min = await knex('people')
    .min('id')
  const sum = await knex('people')
    .sum('id')
  const avg = await knex('people')
    .avg('id')
  const stats = {
    max,
    min,
    sum,
    avg
  };
  console.log(stats);
}

// ----------
// union
// ----------

// join two sets of results (must have same column dimensions/types)

module.exports = async (knex) => {
  const results = await knex('people')
    .select('first_name', 'last_name')
    .where({ first_name: 'Kakashi' })
    .union([
      knex('people')
        .select('first_name', 'last_name')
        .where({ first_name: 'Tenzo' })
    ])
  console.log(results)
}

// ----------
// join
// ----------

// http://knexjs.org/#Builder-join

// ----------
// orderBy 
// ----------

module.exports = async (knex) => {
  results = await knex('people')
    .select('first_name', 'last_name')
    .orderBy([
      { column: 'first_name', order: 'asc' }, // primary criteria
      { column: 'last_name', order: 'desc' } // secondary criteria
    ])
  console.log(results)
}


// ----------
// offset limit
// ----------


// ----------
// transaction
// ----------


// ----------
// query building
// ----------



// ----------
//
// ----------



// ----------
//
// ----------



// ----------
//
// ----------



// ----------
//
// ----------



// ----------
//
// ----------



