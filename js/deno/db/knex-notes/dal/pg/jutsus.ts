import { knex } from "./connection.ts";
import tables from "./tables.ts";
import { Jutsu } from "../../types/mod.ts";
import { first, pick } from "../../deps.ts";

const get = async (id: string): Promise<Jutsu | undefined> => {
  const result = await knex(tables.JUTSUS).select("*").where({ id });
  return first(result);
};

const insert = async (
  jutsu: Pick<Jutsu, "name" | "chakraNature" | "description">,
): Promise<Jutsu | undefined> => {
  const result = await knex(tables.JUTSUS)
    .insert(pick(jutsu, ["name", "chakraNature", "description"]))
    .returning("*");
  return first(result);
};

const update = async (
  id: string,
  updates: Partial<Jutsu>,
): Promise<Jutsu | undefined> => {
  const result = await knex(tables.JUTSUS)
    .where({ id })
    .update(updates)
    .returning("*");
  return first(result);
};

const del = async (id: string): Promise<Jutsu | undefined> => {
  const result = await knex(tables.JUTSUS)
    .where({ id })
    .del()
    .returning("*");
  return first(result);
};

export default { get, insert, update, del };
