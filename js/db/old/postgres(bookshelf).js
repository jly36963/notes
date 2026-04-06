// ------------
// bookshelf
// ------------

// install
`
npm i --save moment pg knex bookshelf
`

// ------------
// initialize knex
// ------------

// only initialize knex once (initialization creates connection pool)

const knex = require('knex')({
  // debug: true,
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

const bookshelf = require('bookshelf')(knex);

const moment = require('moment');

module.exports = bookshelf;

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

// ------------
// create model
// ------------

// bookshelf doesn't handle the schema
// create table first, then create model

const Person = bookshelf.model('Person', {
  tableName: 'people'
});


// ------------
// insert
// ------------

// objects to add to db
const kakashi = {
  firstName: "Kakashi",
  lastName: "Hatake"
}
const yamato = {
  firstName: "Tenzo",
  lastName: "Yamato"
}

// function to insert records (and return)
const createNewPerson = async (Person, person) => {
  const newPerson = await Person.forge({
    first_name: person.firstName,
    last_name: person.lastName,
    created_at: moment(),
    updated_at: moment()
  }).save()
  console.log(newPerson)
  return newPerson;
}

// add to db
const kakashiRecord = createNewPerson(Person, kakashi)
const yamatoRecord = createNewPerson(Person, yamato)

// ------------
// select
// ------------

// get (all)
const getAllPeople = async (Person) => {
  const allPeople = await Person.fetchAll();
  console.log(allPeople);
  return allPeople;
}

// get (where condition)
const getByFirstName = async (Person, firstName) => {
  const person = await Person.where('first_name', firstName).fetch();
  console.log(person);
  return person;
}

// get by id
const getPersonById = async (Person, id) => {
  const person = await Person.where('id', id).fetch();
  console.log(person);
  return person;
}

// ------------
// update
// ------------

const updatePersonById = async (Person, id, updates) => {
  const person = await Person.where("id", id)
    .save(
      { ...updates }, // updates to object
      { patch: true } // options ('patch: true` -- only update provided keys/values)
    )
  console.log(person);
  return person
}

updatePersonById(
  Person, // model 
  1, // id to update
  { first_name: 'Tenzo', last_name: 'Yamato' } // changes
)
updatePersonById(
  Person, // model 
  2, // id to update
  { first_name: 'Kakashi', last_name: 'Hatake' } // changes
)

// ------------
// delete
// ------------

// destroys record and returns empty object

const deletePersonById = async (Person, id) => {
  const person = await Person.where('id', id)
    .destroy()
  console.log(person)
  return person;
}

deletePersonById(Person, 3);

// ------------
// model with methods (query builder)
// ------------

const Person = bookshelf.model('Person', {
  tableName: 'people',
  buildSearchQuery: function() {
    // start query
    this.query(qb => {
      qb.select('first_name', 'last_name')
    });
    // join
    this.query(qb => {
      qb.leftJoin('table_name', 'left_column_to_join_on', 'right_column_to_join_on')
    })
    // only records that aren't soft deleted
    this.query(qb => {
      qb.whereNull('deleted_at')
    })
    // with subquery
    this.query(qb => {
      qb.where(function() {
        this.whereIn('first_name', ['Kakashi', 'Tenzo'])
        this.orWhere('last_name', ['Hatake', 'Yamato'])
      })
    })
  },
  execSearch() {
    this.buildSearchQuery();
    // do some stuff
    const result = await this.fetchAll(); // use 'withRelated' here to populate foreign keys
    return result;
  },
  search() {
    return await execSearch(); // not sure about this one lol
  }
});



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


