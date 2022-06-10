import knex from './connection.js';
import tables from './tables.js';
import { pick, first } from 'lodash-es';

const get = async (id) => {
  const result = await knex(tables.JUTSUS).select('*').where({ id });
  return first(result);
};

const insert = async (jutsu) => {
  const result = await knex(tables.JUTSUS)
    .insert(pick(jutsu, ['name', 'chakraNature', 'description']))
    .returning('*');
  return first(result);
};

const update = async (id, updates) => {
  const result = await knex(tables.JUTSUS)
    .where({ id })
    .update(updates)
    .returning('*');
  return first(result);
};

const del = async (id) => {
  const result = await knex(tables.JUTSUS)
    .where({ id })
    .del()
    .returning('*');
  return first(result);
};

export default { get, insert, update, del };
