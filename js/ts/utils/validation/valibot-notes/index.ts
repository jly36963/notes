import {
  object,
  string,
  optional,
  parse,
  number,
  integer,
  array,
  merge,
  partial,
  Output,
} from "valibot";
import { deepCamelKeys } from "string-ts";

// ---
// Main
// ---

// Docs: https://valibot.dev/guides/introduction/
// GH: https://github.com/fabian-hiller/valibot

async function main() {
  printSectionTitle("basic env example");
  basicEnvExample();

  printSectionTitle("basic nested example");
  basicNestedExample();
}

// ---
// Utils
// ---

function printSectionTitle(title: string): void {
  console.log("\n" + title.toUpperCase() + "\n");
}

// ---
// Examples
// ---

function basicEnvExample() {
  const EnvSchema = object({
    NODE_ENV: optional(string(), "development"),
    HOME: string(),
  });

  const { nodeEnv, home } = deepCamelKeys(parse(EnvSchema, process.env));
  console.log({ nodeEnv, home });
}

function basicNestedExample() {
  // Schemas
  const NinjaSchema = object({
    firstName: string(),
    lastName: string(),
    age: number([integer()]),
  });
  const JutsuSchema = object({
    name: string(),
    chakraNature: string(),
    description: string(),
  });
  const NinjaWithJutsusSchema = merge([
    NinjaSchema,
    object({
      jutsus: array(JutsuSchema),
    }),
  ]);

  // Validating (coercing/parsing)
  const result = parse(NinjaWithJutsusSchema, {
    firstName: "Kakashi",
    lastName: "Hatake",
    age: 27,
    jutsus: [
      {
        name: "Chidori",
        chakraNature: "Lightning",
        description: "A thousand birds",
      },
    ],
  });
  console.log(result);

  // Getting types
  type Ninja = Output<typeof NinjaSchema>;
  const NinjaUpdatesSchema = partial(NinjaSchema);
  type NinjaUpdates = Output<typeof NinjaUpdatesSchema>;
}

// ---
// Run
// ---

main();
