import { knex } from "./connection.ts";
import tables from "./tables.ts";
import { Ninja } from "../../types/mod.ts";
import { first, pick } from "../../deps.ts";

const get = async (id: string): Promise<Ninja | undefined> =>
  await knex(tables.NINJAS).select("*").where({ id }).first();

const insert = async (
  ninja: Pick<Ninja, "firstName" | "lastName" | "age">,
): Promise<Ninja | undefined> => {
  const result = await knex(tables.NINJAS)
    .insert(pick(ninja, ["firstName", "lastName", "age"]))
    .returning("*");
  return first(result);
};

const update = async (
  id: string,
  updates: Partial<Ninja>,
): Promise<Ninja | undefined> => {
  const result = await knex(tables.NINJAS)
    .where({ id })
    .update(updates)
    .returning("*");
  return first(result);
};

const del = async (id: string): Promise<Ninja | undefined> => {
  const result = await knex(tables.NINJAS)
    .where({ id })
    .del()
    .returning("*");
  return first(result);
};

const associateJutsu = async (
  ninjaId: string,
  jutsuId: string,
): Promise<void> =>
  await knex(tables.NINJAS_JUTSUS).insert({ ninjaId, jutsuId });

const disassociateJutsu = async (
  ninjaId: string,
  jutsuId: string,
): Promise<void> =>
  await knex(tables.NINJAS_JUTSUS).where({ ninjaId, jutsuId }).del();

const getNinjaWithJutsus = async (
  ninjaId: string,
): Promise<Ninja | undefined> => {
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
