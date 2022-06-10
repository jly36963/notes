import knex from './connection.js';
import tables from './tables.js';
import { pick, first } from 'lodash-es';

const get = async (id) =>
  knex(tables.NINJAS).select('*').where({ id }).first();

const insert = async (
  ninja
) => {
  const result = await knex(tables.NINJAS)
    .insert(pick(ninja, ['firstName', 'lastName', 'age']))
    .returning('*');
  return first(result);
};

const update = async (
  id,
  updates,
) => {
  const result = await knex(tables.NINJAS)
    .where({ id })
    .update(updates)
    .returning('*');
  return first(result);
};

const del = async (id) => {
  const result = await knex(tables.NINJAS)
    .where({ id })
    .del()
    .returning('*');
  return first(result);
};

const associateJutsu = async (
  ninjaId,
  jutsuId,
) => knex(tables.NINJAS_JUTSUS).insert({ ninjaId, jutsuId });

const disassociateJutsu = async (
  ninjaId,
  jutsuId,
) =>
  knex(tables.NINJAS_JUTSUS).where({ ninjaId, jutsuId }).del();

const getNinjaWithJutsus = async (
  ninjaId
) => {
  const [ninja, jutsus] = await Promise.all([
    knex(tables.NINJAS).select('*').where({ id: ninjaId }).first(),
    knex(tables.JUTSUS)
      .select('*')
      .whereIn(
        'id',
        knex(tables.NINJAS_JUTSUS).select('jutsuId').where({ ninjaId }),
      ),
  ]);
  if (!ninja) return undefined;
  return { ...ninja, jutsus: jutsus || [] };
};

export default {
  get,
  insert,
  update,
  del,
  associateJutsu,
  disassociateJutsu,
  getNinjaWithJutsus,
};
