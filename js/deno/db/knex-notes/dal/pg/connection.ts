import { Knex, KnexStringcase } from "../../deps.ts";

export const knex = Knex(KnexStringcase({
  client: "pg",
  connection: Deno.env.get("PG_URI") ||
    "postgresql://postgres:postgres@localhost:5432/practice",
  pool: { min: 2, max: 10 },
}));
