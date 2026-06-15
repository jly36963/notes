import dotenv from "dotenv";
import { get } from "lodash-es";
import { deepCamelKeys } from "string-ts";
import { z } from "zod";

// ---
// Constants
// ---

const MONGO_DEFAULT_URL = "mongodb://localhost:27017/my-db";
const PG_DEFAULT_URL = "postgresql://postgres:postgres@localhost:5432/my_db";

// ---
// Types
// ---

const DotenvSchema = z
  .object({
    MONGO_URL: z.string().default(MONGO_DEFAULT_URL),
    PG_URL: z.string().default(PG_DEFAULT_URL),
  })
  .strict();

/** Read dotenv file, map keys to camelCase */
function readDotenv() {
  const rawEnv = get(dotenv.config(), "parsed", {});
  const config = DotenvSchema.parse(rawEnv);
  return deepCamelKeys(config);
}

async function main(): Promise<void> {
  const config = readDotenv();
  console.log(config);
}

main();
