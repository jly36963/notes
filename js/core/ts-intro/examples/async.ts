import * as fs from "node:fs";
import * as fsp from "node:fs/promises";

const FILENAME = ".nvmrc";

function simpleCallback() {
  fs.readFile(FILENAME, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    console.log("File contents:", data);
  });
}

function simplePromise() {
  return fsp
    .readFile(FILENAME, "utf-8")
    .then((data) => {
      console.log("File contents:", data);
    })
    .catch((err) => {
      console.error("Error reading file:", err);
    });
}

async function basicAsync() {
  try {
    const data = await fsp.readFile(FILENAME, "utf-8");
    console.log("File contents:", data);
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

async function main() {
  simpleCallback();
  await simplePromise();
  await basicAsync();
}

main();
