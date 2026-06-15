import { parseStringPromise, type ParserOptions } from "xml2js";
import { z } from "zod";

// ---
// Notes
// ---

// attributes will be under `$`
// fields can repeat, so by default, the fields are `Array<T>` type
// `explicitArray: false` will make each field `T | Array<T>`

// ---
// Constants
// ---

const OPTIONS: ParserOptions = {
  explicitArray: false,
  preserveChildrenOrder: true,
};

const CUSTOMERS = `
<?xml version="1.0"?>
<customers>
   <customer id="55000">
      <name>Charter Group</name>
      <address>
         <street>100 Main</street>
         <city>Framingham</city>
         <state>MA</state>
         <zip>01701</zip>
      </address>
      <address>
         <street>720 Prospect</street>
         <city>Framingham</city>
         <state>MA</state>
         <zip>01701</zip>
      </address>
      <address>
         <street>120 Ridge</street>
         <state>MA</state>
         <zip>01760</zip>
      </address>
   </customer>
</customers>
`;

const XmlSchema = z.strictObject({
  customers: z.strictObject({
    customer: z.array(
      z.strictObject({
        $: z.strictObject({
          id: z.string(),
        }),
        name: z.array(z.string()),
        address: z.array(
          z.strictObject({
            street: z.array(z.string()),
            city: z.optional(z.array(z.string())),
            state: z.array(z.string()),
            zip: z.array(z.string()),
          }),
        ),
      }),
    ),
  }),
});

type _XmlOutput = z.infer<typeof XmlSchema>;

const AddressSchema = z.strictObject({
  street: z.string(),
  city: z.optional(z.string()),
  state: z.string(),
  zip: z.string(),
});
const CustomerSchema = z.strictObject({
  $: z.strictObject({
    id: z.string(),
  }),
  name: z.string(),
  address: schemaToArray(AddressSchema),
});
const XmlWithOptionsSchema = z.strictObject({
  customers: z.strictObject({
    customer: schemaToArray(CustomerSchema),
  }),
});

type _XmlWithOptionsOutput = z.infer<typeof XmlWithOptionsSchema>;

// ---
// Main
// ---

async function main() {
  const scenarios = [
    { title: "simpleIntro", example: simpleIntro },
    { title: "simpleOptions", example: simpleOptions },
  ];
  for (const { title, example } of scenarios) {
    printSectionTitle(title);
    await example();
  }
}

// ---
// Utils
// ---

function printSectionTitle(title: string) {
  console.log(`\n${title.toUpperCase()}\n`);
}

function jsonStr(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function jsonLog(value: unknown): void {
  console.log(jsonStr(value));
}

function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/** Convert an object schema to a schema that takes `T | T[]` and returns `T[]` */
function schemaToArray<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return z.union([z.array(schema), schema]).transform(ensureArray);
}

// ---
// Examples
// ---

async function simpleIntro() {
  const raw = await parseStringPromise(CUSTOMERS);
  const result = XmlSchema.parse(raw);
  jsonLog(result);
}

async function simpleOptions() {
  const raw = await parseStringPromise(CUSTOMERS, OPTIONS);
  const result = XmlWithOptionsSchema.parse(raw);
  jsonLog(result);
}

// ---
// Main
// ---

main();
