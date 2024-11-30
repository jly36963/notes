import { abortable, deadline, debounce, delay } from "async";
import { concat, endsWith, repeat, startsWith } from "bytes";
import { parseArgs } from "cli/parse-args";
import {
  chunk,
  deepMerge,
  distinct,
  distinctBy,
  filterEntries,
  filterKeys,
  filterValues,
  findSingle,
  firstNotNullishOf,
  includesValue,
  intersect,
  mapEntries,
  mapKeys,
  mapNotNullish,
  mapValues,
  maxBy,
  maxOf,
  minBy,
  minOf,
  partition,
  sample,
  sortBy,
  union,
} from "collections";
import { crypto } from "crypto";
import { dayOfYear, difference, format, parse } from "datetime";
import { load as loadEnv } from "dotenv";
import { decodeBase64, encodeBase64 } from "encoding/base64";
import { encodeHex } from "encoding/hex";
import { sprintf } from "fmt/printf";
import { ensureDir } from "fs"; // ensureFile
import * as log from "log";
import * as posix from "path/posix";
import { TextLineStream } from "streams/text-line-stream";
import { TarStream, TarStreamFile, TarStreamInput, UntarStream } from "tar";
import { v4 } from "uuid";

// ---
// Main
// ---

async function main() {
  printSectionTitle("basic async");
  await basicAsync();

  printSectionTitle("basic bytes");
  basicBytes();

  printSectionTitle("basic collections (functions)");
  basicCollectionsFunctions();

  printSectionTitle("basic collections (structures)");
  basicCollectionsStructures();

  printSectionTitle("basic crypto");
  await basicCrypto();

  printSectionTitle("basic crypto (aes)");
  await basicCryptoAes();

  printSectionTitle("basic crypto (rsa)");
  await basicCryptoRsa();

  printSectionTitle("basic datetime");
  basicDatetime();

  printSectionTitle("basic encoding (base64)");
  basicEncodingBase64();

  printSectionTitle("basic dotenv");
  await basicDotenv();

  printSectionTitle("basic flags");
  basicFlags();

  printSectionTitle("basic fmt");
  basicFmt();

  printSectionTitle("basic fs");
  await basicFs();

  printSectionTitle("basic io");
  await basicIo();

  printSectionTitle("basic log");
  await basicLog();

  printSectionTitle("basic path");
  basicPath();

  printSectionTitle("basic streams");
  await basicStreams();

  printSectionTitle("basic tar");
  await basicTar();

  printSectionTitle("basic uuid");
  basicUuid();
}

// ---
// Utils
// ---

/** Uppercase a string, wrap with new lines, print */
function printSectionTitle(title: string) {
  console.log(`\n${title.toUpperCase()}\n`);
}

/** Encode a utf-8 string */
function utf8Encode(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

/** Decode a utf-8 string */
function utf8Decode(bytes: Uint8Array): string {
  return new TextDecoder("utf-8").decode(bytes);
}

// ---
// Examples
// ---

async function basicAsync() {
  // abortable
  try {
    const p = delay(1000);
    const c = new AbortController();
    setTimeout(() => c.abort(), 10);
    await abortable(p, c.signal);
  } catch (err) {
    console.log("promise aborted: ");
    console.log(err);
  }

  // debounce
  const debouncedLog = debounce((v) => console.log(v), 100);
  console.log("debounce result: ");
  (["a", "b", "c"] as string[]).forEach((v) => debouncedLog(v)); // Take latest (c)

  // delay
  await delay(100); // async sleep

  // deadline
  try {
    const p = delay(100);
    await deadline(p, 10);
  } catch (err) {
    console.log("promise deadline reached: ");
    console.log(err);
  }

  // TODO: deferred, MuxAsyncIterator, pooledMap, tee
}

async function getTarStreamFile(filepath: string): Promise<TarStreamFile> {
  const [stat, fsfile] = await Promise.all([
    Deno.stat(filepath),
    Deno.open(filepath),
  ]);
  return {
    type: "file",
    path: filepath,
    size: stat.size,
    readable: fsfile.readable,
  };
}

async function tarzipFiles(
  inputFilepaths: Array<string>,
  outputTarPath: string,
): Promise<void> {
  const stream = ReadableStream.from<TarStreamInput>(
    await Promise.all(
      inputFilepaths.map(getTarStreamFile),
    ),
  );
  await stream.pipeThrough(new TarStream())
    .pipeThrough(new CompressionStream("gzip"))
    .pipeTo((await Deno.create(outputTarPath)).writable);
}

/** Unzip a tar into a target directory */
async function untarzip(
  tarPath: string,
  targetDir: string,
): Promise<Array<string>> {
  const paths: Array<string> = [];
  const gzip = new DecompressionStream("gzip");
  const stream = (await Deno.open(tarPath)).readable;
  for await (
    const entry of stream.pipeThrough(gzip).pipeThrough(new UntarStream())
  ) {
    const path = posix.normalize(entry.path);
    const basename = posix.basename(path);
    const targetPath = posix.join(targetDir, basename);
    await ensureDir(posix.dirname(targetPath));
    if (!entry.readable) {
      continue;
    }
    await entry.readable.pipeTo((await Deno.create(targetPath)).writable);
    paths.push(targetPath);
  }
  return paths;
}

function basicBytes() {
  const concatenated = utf8Decode(
    concat([utf8Encode("Hello"), utf8Encode(" friend")]),
  );
  const repeated = utf8Decode(repeat(utf8Encode("foo"), 2));
  const startsWithPrefix = startsWith(new Uint8Array(5), new Uint8Array(2));
  const endsWithSuffix = endsWith(new Uint8Array(5), new Uint8Array(2));

  console.log("concatenated: ", concatenated);
  console.log("repeated: ", repeated);
  console.log("startsWithPrefix: ", startsWithPrefix);
  console.log("endsWithSuffix: ", endsWithSuffix);
}

function basicCollectionsFunctions() {
  // aggregateGroups: basically reduce for Record<string, Array<any>> (current, key, first, acc)
  // associateBy: similar to lodash keyBy (element is value, callback determines key)
  // associateWith: like associateBy, but element is key and callback determines value
  const chunkResult = chunk(Array(10).fill(0), 5);
  const deepMergeResult = deepMerge({ a: 1, b: 2 }, { a: 3, c: 4 });
  const distinctByResult = distinctBy([1, 2, 3, 4, 1], (v) => v);
  const distinctResult = distinct([1, 2, 3, 4, 1]);
  // dropWhile: drop array elements before first element that fails predicate
  // dropLastWhile: drop array elements including and after last element that fails predicate
  const filterEntriesResult = filterEntries({ a: 0, b: 2 }, ([_k, v]) => v > 0);
  const filterKeysResult = filterKeys({ a: 0, b: 2 }, (k) => k !== "b");
  const filterValuesResult = filterValues({ a: 0, b: 2 }, (v) => v > 0);
  const findSingleResult = findSingle([1, 2, 3, 4, 5], (n) => n === 2);
  const firstNotNullishOfResult = firstNotNullishOf(
    [undefined, 1, 2, 3, 4],
    (v) => v,
  );
  const groupByResult = Object.groupBy(
    [{ a: 1, b: "abc" }, { a: 2, b: "def" }],
    ({ b }) => b,
  );
  const includesValueResult = includesValue({ a: 1, b: 2 }, 2);
  const intersectResult = intersect([1, 2, 3], [2, 3, 4]);
  // joinToString: fancy join (suffix, prefix, limit, truncated, etc)
  const mapEntriesResult = mapEntries(
    { a: 1, b: 2 },
    ([k, v]) => [`${k}${k}`, v * 2],
  );
  const mapKeysResult = mapKeys({ a: 1, b: 2 }, (k) => k.toUpperCase());
  const mapValuesResult = mapValues({ a: 1, b: 2 }, (v) => v * 2);
  const mapNotNullishResult = mapNotNullish(
    [undefined, 1, 2, 3, 4],
    (v) => v && v * 2,
  );
  const maxByResult = maxBy(
    [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }],
    ({ age }) => age,
  );
  const maxOfResult = maxOf(
    [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }],
    ({ age }) => age,
  );
  // maxWith: find max element using custom comparator
  const minByResult = minBy(
    [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }],
    ({ age }) => age,
  );
  const minOfResult = minOf(
    [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }],
    ({ age }) => age,
  );
  // minWith: find min element using custom comparator
  const partitionResult = partition([1, 2, 3, 4, 5], (n) => n > 3);
  // permutations: return array of all order permutations
  // reduceGroups: basically reduce for Record<string, Array<any>>
  // runningReduce: reduce, but returns an array of intermediate accumulator results
  // sumOf: get sum of array using selector
  const sampleResult = sample([1, 2, 3, 4]);
  // slidingWindows: return array of sliding views of a given size
  const sortByResult = sortBy(
    [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }],
    ({ name }) => name,
  );
  // takeLastWhile: ...
  // takeWhile: ...
  const unionResult = union([1, 2, 3], [2, 3, 4]);
  // unzip: split array of 2-tuples into 2 separate arrays
  // withoutAll: remove elements in arr2 from arr1
  // zip: combine 2 arrays into an array of 2-tuples

  console.log("chunkResult: ", chunkResult);
  console.log("deepMergeResult: ", deepMergeResult);
  console.log("distinctByResult: ", distinctByResult);
  console.log("distinctResult: ", distinctResult);
  console.log("filterEntriesResult: ", filterEntriesResult);
  console.log("filterKeysResult: ", filterKeysResult);
  console.log("filterValuesResult: ", filterValuesResult);
  console.log("findSingleResult: ", findSingleResult);
  console.log("firstNotNullishOfResult: ", firstNotNullishOfResult);
  console.log("groupByResult: ", groupByResult);
  console.log("includesValueResult: ", includesValueResult);
  console.log("intersectResult: ", intersectResult);
  console.log("mapEntriesResult: ", mapEntriesResult);
  console.log("mapKeysResult: ", mapKeysResult);
  console.log("mapValuesResult: ", mapValuesResult);
  console.log("mapNotNullishResult: ", mapNotNullishResult);
  console.log("maxByResult: ", maxByResult);
  console.log("maxOfResult: ", maxOfResult);
  console.log("minByResult: ", minByResult);
  console.log("minOfResult: ", minOfResult);
  console.log("partitionResult: ", partitionResult);
  console.log("sampleResult: ", sampleResult);
  console.log("sortByResult: ", sortByResult);
  console.log("unionResult: ", unionResult);
}

function basicCollectionsStructures() {
  // BSTree
  // RBTree
}

async function basicCrypto() {
  const message = "No one can know, not even Squidward's house";
  const messageBytes = utf8Encode(message);
  const hashedBytes = new Uint8Array(
    await crypto.subtle.digest(
      "SHA-256",
      messageBytes,
    ),
  );
  const hashedStringUtf8 = utf8Decode(hashedBytes);
  const hashedStringBase64 = encodeBase64(hashedBytes);
  console.log("message: ", message);
  console.log("messageBytes: ", messageBytes);
  console.log("hashedBytes: ", hashedBytes);
  console.log("hashedStringUtf8: ", hashedStringUtf8);
  console.log("hashedStringBase64: ", hashedStringBase64);

  // TODO: hmac
}

async function basicCryptoAes() {
  // Message
  const message =
    "You focus on the trivial, and lose sight of what is most important. Change is impossible in this fog of ignorance.";

  const messageBytes = utf8Encode(message);

  // Key
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 }, // algorithm, key length
    true,
    ["encrypt", "decrypt"],
  );
  const keyBytes = new Uint8Array(await crypto.subtle.exportKey("raw", key));
  const importedKey = await crypto.subtle.importKey(
    "raw",
    keyBytes.buffer,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"],
  );

  // Encrypt
  const iv = await crypto.getRandomValues(new Uint8Array(16)); // 12 or 16
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, // AesGcmParams, AesCbcParams
    importedKey,
    messageBytes,
  );
  const encryptedBytes = new Uint8Array(encryptedBuffer);

  // Decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    importedKey,
    encryptedBytes,
  );
  const decryptedBytes = new Uint8Array(decryptedBuffer);
  const decryptedMessage = utf8Decode(decryptedBytes);

  // Result
  console.log("message: ", message);
  console.log("messageBytes: ", messageBytes);
  console.log("encryptedBytes: ", encryptedBytes);
  console.log("decryptedBytes: ", decryptedBytes);
  console.log("decryptedMessage: ", decryptedMessage);
}

async function basicCryptoRsa() {
  // Message
  const message = "The owner of the white sedan, you left your lights on.";
  const messageBytes = utf8Encode(message);

  // Get key pair
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-512",
    },
    true,
    ["encrypt", "decrypt"],
  );

  // Keys: public: encryption, private: decryption
  const { publicKey, privateKey } = keyPair;

  // Encrypt
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    messageBytes,
  );
  const encryptedBytes = new Uint8Array(encryptedBuffer);

  // Decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedBuffer,
  );
  const decryptedBytes = new Uint8Array(decryptedBuffer);
  const decryptedMessage = utf8Decode(decryptedBytes);

  // Result
  console.log("message: ", message);
  console.log("messageBytes: ", messageBytes);
  console.log("encryptedBytes: ", encryptedBytes);
  console.log("decryptedBytes: ", decryptedBytes);
  console.log("decryptedMessage: ", decryptedMessage);
}

function basicDatetime() {
  const now = new Date();
  const formatted = format(now, "yyyy-MM-dd");
  const doy = dayOfYear(now);
  const parsed = parse("2022-05-25", "yyyy-MM-dd");
  const diff = difference(now, new Date());

  console.log("now: ", now);
  console.log("formatted: ", formatted);
  console.log("doy: ", doy);
  console.log("parsed: ", parsed);
  console.log("diff.milliseconds: ", diff.milliseconds);
}

async function basicDotenv() {
  const env = await loadEnv({ envPath: "./dev.env" });
  console.log("env", env);
}

function basicEncodingBase64() {
  const message = "Where's the leak, mam?";
  const messageBytesUtf8 = utf8Encode(message);
  const messageStringBase64 = encodeBase64(message);
  const messageBytesBase64 = decodeBase64(messageStringBase64);

  console.log("message: ", message);
  console.log("messageBytesUtf8: ", messageBytesUtf8);
  console.log("messageBytesBase64: ", messageBytesBase64);
  console.log("messageStringBase64: ", messageStringBase64);

  // TODO: encoding -- csv, jsonc, toml, yaml
}

function basicFlags() {
  const parsed = parseArgs(["pipenv", "install", "--dev"]);
  console.log("parsed", parsed);
}

function basicFmt() {
  const formatted = sprintf("Hey there, %s", "Kakashi");
  console.log("formatted: ", formatted);
}

async function basicFs() {
  // unstable
}

async function basicIo() {
  const fsFile = await Deno.open("./import_map.json");
  let text = "";
  const readable = fsFile.readable.pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const data of readable) {
    text += `${data}\n`;
  }

  // MD5 hash of text contents
  const hashedText = encodeHex(
    new Uint8Array(
      await crypto.subtle.digest(
        "MD5",
        utf8Encode(text),
      ),
    ),
  );

  // Result
  console.log("hashedText", hashedText);
}

/** Custom log formatter */
function customFormatter(lr: log.LogRecord) {
  return `${lr.loggerName}:${lr.levelName}:${lr.msg}`;
}

async function basicLog() {
  const logFilename = "./log.txt";
  // Set up loggers
  log.setup({
    handlers: {
      console: new log.ConsoleHandler("DEBUG", {
        formatter: customFormatter, // Try `log.formatters.jsonFormatter`
      }),
      file: new log.FileHandler("DEBUG", { filename: logFilename }),
    },
    loggers: {
      default: { level: "INFO", handlers: ["console", "file"] },
      tasks: { level: "INFO", handlers: ["console"] },
    },
  });
  // Use default logger
  log.debug("Something happened");
  log.info("Something more important happened");
  log.warn("Something bad might happen");
  log.error("Something bad happened");
  log.critical("An unrecoverable error happened");
  // Use custom logger
  const tasksLogger = log.getLogger("tasks");
  tasksLogger.debug("Something happened");
  tasksLogger.info("Something more important happened");
  tasksLogger.warn("Something bad might happen");
  tasksLogger.error("Something bad happened");
  tasksLogger.critical("An unrecoverable error happened");
  // Read file logs
  const text = await Deno.readTextFile(logFilename);
  console.log("log file read result");
  console.log(text);
  // Cleanup
  await Deno.remove(logFilename);
}

function basicPath() {
  const filepath = "./temp/my-file.txt";
  const basename = posix.basename(filepath); // my-file.txt
  const dirname = posix.dirname(filepath); // ./temp
  const extname = posix.extname(filepath); // .txt
  const isAbsolute = posix.isAbsolute(filepath); // false
  const joined = posix.join(".", "temp", "my-file.txt");
  const normalized = posix.normalize("./temp/../temp/");
  const parsed = posix.parse(filepath); // { root, dir, base, ext, name }

  console.log("basename: ", basename);
  console.log("dirname: ", dirname);
  console.log("extname: ", extname);
  console.log("isAbsolute: ", isAbsolute);
  console.log("joined: ", joined);
  console.log("normalized: ", normalized);
  console.log("parsed: ", parsed);

  // TODO: format, relative, resolve, common
}

async function basicStreams() {
  const command = new Deno.Command("ls", {
    args: ["-a"],
    stdout: "piped",
    stderr: "piped",
  });

  const result = await command.output();
  console.log(result);

  const output = utf8Decode(result.stdout);
  const error = utf8Decode(result.stderr);
  console.log("ls code: ", result.code);
  console.log("ls output: ", output);
  console.log("ls error: ", error);
}

async function basicTar() {
  // Setup
  const filename = "my-file.txt";
  const inputDir = posix.join(".", "temp", "input");
  const outputDir = posix.join(".", "temp", "output");
  const inputPath = posix.join(inputDir, filename);
  const outputPath = posix.join(outputDir, "my-files.tar");
  for (const dir of [inputDir, outputDir]) {
    await Deno.mkdir(dir, { recursive: true });
  }
  Deno.writeFile(inputPath, utf8Encode("Is mayonaise an instrument?"));

  // Zip and unzip files
  await tarzipFiles([inputPath], outputPath);
  const unzipped = await untarzip(outputPath, outputDir);
  for (const path of unzipped) {
    const text = await Deno.readTextFile(path);
    console.log({ path, text });
  }

  const cleanupPaths = [inputPath, outputPath, posix.join(outputDir, filename)];
  for (const path of cleanupPaths) {
    await Deno.remove(path);
  }
}

function basicUuid() {
  const id = crypto.randomUUID();
  const isValid = v4.validate(id);
  console.log("id: ", id);
  console.log("isValid: ", isValid);
}

// ---
// Run
// ---

main();
