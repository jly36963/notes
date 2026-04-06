import z from "zod";
import { deepCamelKeys } from "string-ts";

// ---
// Main
// ---

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
  const EnvSchema = z.object({
    NODE_ENV: z.string().default("development"),
    HOME: z.string(),
  });

  const { nodeEnv, home } = deepCamelKeys(EnvSchema.parse(process.env));
  console.log({ nodeEnv, home });
}

function basicNestedExample() {
  // Schemas
  const NinjaSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number().int(),
  });
  const JutsuSchema = z.object({
    name: z.string(),
    chakraNature: z.string(),
    description: z.string(),
  });
  const NinjaWithJutsusSchema = NinjaSchema.extend({
    jutsus: z.array(JutsuSchema),
  });

  // Validating (coercing/parsing)
  const result = NinjaWithJutsusSchema.parse({
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
  type Ninja = z.infer<typeof NinjaSchema>;
  const NinjaUpdatesSchema = NinjaSchema.partial();
  type NinjaUpdates = z.infer<typeof NinjaUpdatesSchema>;
}

// ---
// Run
// ---

main();
