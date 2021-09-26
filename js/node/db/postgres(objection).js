// ------------
// objection ORM
// ------------

// install
`
npm i --save moment pg knex objection
`

// ------------
// initialize knex / objection
// ------------

// imports
const moment = require('moment');
const Knex = require('knex');
const { Model } = require('objection');

// intialize knex
const knex = Knex({
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

// give knex instance to objection

Model.knex(knex);


// ------------
// create table
// ------------

// use migration
exports.up = async (knex) => {
  // check if table exists
  if (await knex.schema.hasTable('people')) {
    return;
  }
  // create table
  return await knex.schema.createTable('people', (table) => {
    table.increments('id').primary();
    table.string('first_name');
    table.string('last_name');
    table.timestamps(); // created_at & updated_at
  })
}

exports.down = (knex) => {
  // drop table
  return await knex.schema.dropTable('people');
}

// ------------
// create Model
// ------------

class Person extends Model {
  static get tableName() {
    return 'people';
  }
  static get relationMappings() {
    return {
      // specify relations here
    }
  }
  static get idColumn() {
    return 'id' // specify primary key (unique identifier) (default: 'id')
  }
  static get fullName() {
    // define custom method
    const name = `${this.first_name} ${this.last_name}`;
    return name;
  }
}


// ------------
// insert
// ------------

// mutate methods
  // https://vincit.github.io/objection.js/api/query-builder/mutate-methods.html

// objects to insert

const kakashi = {
  first_name: 'Kakashi',
  last_name: 'Hatake',
}
const yamato = {
  first_name: 'Tenzo',
  last_name: 'Yamato',
}

// insert function
  // insert() -- returns only the properties provided
  // insertAndFetch() -- returns all properties (fetches the item after insertion)

const createNewPerson = async (Person, person) => {
  const newPerson = await Person.query().insertAndFetch({
    ...person,
    created_at: moment(),
    updated_at: moment()
  });
  console.log(newPerson);
  return newPerson;
}

// insert 

createNewPerson(Person, kakashi)
createNewPerson(Person, yamato)

// ------------
// select
// ------------

// find methods
  // https://vincit.github.io/objection.js/api/query-builder/find-methods.html#findbyid

// find by id

const findPersonById = async (Person, id) => {
  const person = await Person.query().findById(id);
  console.log(person);
  return person;
}

findPersonById(Person, 1);

// find by condition

const findPerson = async (Person, conditions) => {
  const person = await Person.query().findOne({
    ...conditions
  });
  console.log(person);
  return person;
}

findPerson(Person, { id: 2 });

// ------------
// update (patch)
// ------------

// patch (only returns provided values)

const updatePersonById = async (Person, id, updates) => {
  const updatedPerson = await Person.query()
    .patch({
      ...updates,
      updated_at: moment()
    })
    .findById(id)
  console.log(updatedPerson)
  return updatedPerson;
}

updatePersonById(Person, 1, yamato)
updatePersonById(Person, 2, kakashi)

// patch multiple (only returns provided values)

const updatePeople = async (Person, condition, updates) => {
  const updatedPeople = await Person.query()
    .patch({
      ...updates,
      updated_at: moment()
    })
    .where(condition) // ie -- .where('age', '<', 50)
}

// patch and fetch (returns updated record)

const updateAndFetchPersonById = async (Person, id, updates) => {
  // patchAndFetchById(id, updateObject)
  const updatedPerson = await Person.query()
    .patchAndFetchById(id, {
      ...updates,
      updated_at: moment()
    })
  console.log(updatedPerson);
  return updatedPerson;
}

updateAndFetchPersonById(Person, 1, yamato) // update kakashi -> yamato
updateAndFetchPersonById(Person, 2, kakashi) // update yamato -> kakashi

// ------------
// delete
// ------------

const deletePersonById = async (Person, id) => {
  const deletedPerson = await Person.query.deleteById(id);
  console.log(deletedPerson)
  return deletedPerson;
}

deletePersonById(Person, 3); // no person with this 'id'


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



