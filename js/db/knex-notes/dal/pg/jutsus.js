import knex from './connection.js';
import tables from './tables.js';
import { pick, first } from 'lodash-es';

/** Get a jutsu from the database */
const get = async (id) => knex(tables.JUTSUS).first('*').where({ id });

/** Insert a jutsu in the database */
const insert = async (jutsu) => {
  const result = await knex(tables.JUTSUS)
    .insert(pick(jutsu, ['name', 'chakraNature', 'description']))
    .returning('*');
  return first(result);
};

/** Update an existing jutsu in the database */
const update = async (id, updates) => {
  const result = await knex(tables.JUTSUS)
    .where({ id })
    .update(updates)
    .returning('*');
  return first(result);
};

/** Delete an existing jutsu in the database */
const del = async (id) => {
  const result = await knex(tables.JUTSUS)
    .where({ id })
    .del()
    .returning('*');
  return first(result);
};

export default { get, insert, update, del };
