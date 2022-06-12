import knex from "./connection.js";
import tables from "./tables.js";
import { first, pick } from "lodash-es";

/** Get a ninja from the database */
const get = async (id) =>
  knex(tables.NINJAS)
    .first()
    .where({ id });

/** Insert a ninja into the database */
const insert = async (ninja) => {
  const result = await knex(tables.NINJAS)
    .insert(pick(ninja, ["firstName", "lastName", "age"]))
    .returning("*");
  return first(result);
};

/** Update an existing ninja in the database */
const update = async (id, updates) => {
  const result = await knex(tables.NINJAS)
    .where({ id })
    .update(updates)
    .returning("*");
  return first(result);
};

/** Delete a ninja in the database */
const del = async (id) => {
  const result = await knex(tables.NINJAS)
    .where({ id })
    .del()
    .returning("*");
  return first(result);
};

/** Associate a ninja and jutsu */
const associateJutsu = async (ninjaId, jutsuId) =>
  knex(tables.NINJAS_JUTSUS).insert({ ninjaId, jutsuId });

/** Dissociate a ninja and jutsu */
const disassociateJutsu = async (ninjaId, jutsuId) =>
  knex(tables.NINJAS_JUTSUS).where({ ninjaId, jutsuId }).del();

/** Get a ninja with its associated jutsus */
const getNinjaWithJutsus = async (ninjaId) => {
  const [ninja, jutsus] = await Promise.all([
    knex(tables.NINJAS).select("*").where({ id: ninjaId }).first(),
    knex(tables.JUTSUS)
      .select("*")
      .whereIn(
        "id",
        knex(tables.NINJAS_JUTSUS).select("jutsuId").where({ ninjaId }),
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
