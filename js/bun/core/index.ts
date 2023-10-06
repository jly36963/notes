// ---
// Main
// ---

async function main() {
  printSectionTitle("basic bun runtime");
  await basicBunRuntime();

  printSectionTitle("basic bun file");
  await basicBunFile();

  printSectionTitle("basic bun utils");
  await basicBunUtils();

  printSectionTitle("basic bun zip");
  await basicBunZip();

  printSectionTitle("basic bun readableStreamTo...");
  await basicBunReadableStreamToX();
}

// ---
// Utils
// ---

function printSectionTitle(title: string) {
  console.log("\n" + title.toUpperCase() + "\n");
}

// ---
// Examples
// ---

async function basicBunRuntime() {
  console.log({
    version: Bun.version, // Bun's semantic version
    revision: Bun.revision, // Bun's git commit (current CLI compile)
    "env.BUN_INSTALL:": Bun.env.BUN_INSTALL, // Alias of process.env
    main: Bun.main, // Path to entry point file
  });
}

async function basicBunFile() {
  const fd = Bun.file("./README.md");
  const contents = await fd.text();
  console.log({
    fd,
    contents: contents.length,
  });
}

async function basicBunUtils() {
  await Bun.sleep(1);
  console.log({
    deepEquals: Bun.deepEquals([{ a: 1 }], [{ a: 1 }]),
    which: Bun.which("node"),
  });
}

async function basicBunZip() {
  const data =
    "In order to survive, we cling to all we know and understand, " +
    "and label it reality; " +
    "but knowledge and understanding are ambiguous -- " +
    "that reality could be an illusion. " +
    "All humans live with the wrong assumptions.";

  const td = new TextDecoder();
  const te = new TextEncoder();
  const zipped = Bun.gzipSync(te.encode(data));
  const unzipped = td.decode(Bun.gunzipSync(zipped));

  const base64Encoded = btoa(data);
  const base64Decoded = atob(base64Encoded);

  const deflated = Bun.deflateSync(te.encode(data));
  const inflated = td.decode(Bun.inflateSync(deflated));

  console.log({
    zipped,
    unzipped,
    base64Encoded,
    base64Decoded,
    deflated,
    inflated,
  });
}

async function basicBunReadableStreamToX() {
  // TODO
  console.log("...");
}

// ---
// Run
// ---

if (import.meta.path === Bun.main) {
  await main();
}
