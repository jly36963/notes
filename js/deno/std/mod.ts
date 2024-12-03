import * as async from "async";
import * as bytes from "bytes";
import { LruCache, memoize } from "cache";
import { decodeCbor, encodeCbor } from "cbor";
import { parseArgs } from "cli/parse-args";
import * as collections from "collections";
import { crypto } from "crypto";
import * as csv from "csv";
import * as structures from "data-structures";
import * as datetime from "datetime";
import { load as loadEnv } from "dotenv";
import { decodeBase64, encodeBase64 } from "encoding/base64";
import { decodeHex, encodeHex } from "encoding/hex";
import { expect } from "expect";
import { format as formatBytes } from "fmt/bytes";
import { bgBlue, inverse, italic, underline, white } from "fmt/colors";
import { format as formatDuration } from "fmt/duration";
import { sprintf } from "fmt/printf";
import * as fs from "fs";
import * as ini from "ini";
import * as json from "json";
import * as jsonc from "jsonc";
import * as log from "log";
import * as msgpack from "msgpack";
import * as posix from "path/posix";
import * as random from "random";
import * as regexp from "regexp";
import * as streams from "streams";
import * as tar from "tar";
import * as text from "text";
import { v4 } from "uuid";

// ---
// Main
// ---

async function main() {
  printSectionTitle("basic async");
  await basicAsync();

  printSectionTitle("basic bytes");
  basicBytes();

  printSectionTitle("basic cache");
  basicCache();

  printSectionTitle("basic cbor");
  basicCbor();

  printSectionTitle("basic CLI");
  basicCli();

  printSectionTitle("basic command");
  basicCommand();

  printSectionTitle("basic collections (functions)");
  basicCollectionsFunctions();

  printSectionTitle("basic crypto");
  await basicCrypto();

  printSectionTitle("basic crypto (aes)");
  await basicCryptoAes();

  printSectionTitle("basic crypto (hmac)");
  await basicCryptoHmac();

  printSectionTitle("basic crypto (md5)");
  await basicCryptoMd5();

  printSectionTitle("basic crypto (rsa)");
  await basicCryptoRsa();

  printSectionTitle("basic CSV");
  basicCsv();

  printSectionTitle("basic data structures");
  basicDataStructures();

  printSectionTitle("basic datetime");
  basicDatetime();

  printSectionTitle("basic dotenv");
  await basicDotenv();

  printSectionTitle("basic encoding (base64)");
  basicEncodingBase64();

  printSectionTitle("basic encoding (hex)");
  basicEncodingHex();

  printSectionTitle("basic expect");
  basicExpect();

  printSectionTitle("basic fmt");
  basicFmt();

  printSectionTitle("basic fs");
  await basicFs();

  printSectionTitle("basic fs (walk)");
  await basicFsWalk();

  printSectionTitle("basic INI");
  await basicIni();

  printSectionTitle("basic JSON");
  await basicJson();

  printSectionTitle("basic JSONC");
  basicJsonc();

  printSectionTitle("basic log");
  await basicLog();

  printSectionTitle("basic msgpack");
  basicMsgpack();

  printSectionTitle("basic path");
  basicPath();

  printSectionTitle("basic random");
  basicRandom();

  printSectionTitle("basic regexp");
  basicRegexp();

  printSectionTitle("basic streams");
  await basicStreams();

  printSectionTitle("basic tar");
  await basicTar();

  printSectionTitle("basic text");
  basicText();

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

/** Return a random boolean. `p` is the probability of success in the Bernoulli trial. */
function coinToss(p = 0.5) {
  return Math.random() > p;
}

function prettyPrintResults(results: Record<string, unknown>) {
  for (const [k, v] of Object.entries(results)) {
    console.log(k);
    console.log(typeof v);
    console.log(Object.prototype.toString.call(v));
    console.log(v);
    console.log();
  }
}

function getNinjaRecords() {
  return [
    {
      id: "fa6c4c93-fb64-4cd7-8b21-0e5e0f717fd6",
      firstName: "Kakashi",
      lastName: "Hatake",
      age: 27,
    },
    {
      id: "2c6c74c3-b9d6-4d49-a113-4f1a8164abe3",
      firstName: "Tenzo",
      lastName: "Yamato",
      age: 26,
    },
    {
      id: "2e9093d5-f466-40bb-be14-993276f0a497",
      firstName: "Iruka",
      lastName: "Umino",
      age: 25,
    },
    {
      id: "71547b9d-f28e-4511-b767-860bc37f148f",
      firstName: "Itachi",
      lastName: "Uchiha",
      age: 21,
    },
  ];
}

// ---
// Examples
// ---

async function basicAsync() {
  try {
    const promise = async.delay(1000);
    const ac = new AbortController();
    setTimeout(() => ac.abort(), 10);
    await async.abortable(promise, ac.signal);
  } catch (err) {
    console.log("promise aborted: ");
    console.log(err);
  }

  // debounce
  {
    const debouncedLog = async.debounce((v) => console.log(v), 100);
    console.log("debounce result: ");
    (["a", "b", "c"] as string[]).forEach((v) => debouncedLog(v)); // Take latest (c)
  }

  // delay
  await async.delay(100); // async sleep
  try {
    const promise = async.delay(100);
    await async.deadline(promise, 10);
  } catch (err) {
    console.log("promise deadline reached: ");
    console.log(err);
  }

  // pooledMap
  {
    const numbers = [1, 2, 3, 4, 5];
    const mapper = async (n: number) => {
      await async.delay(10);
      return n * 2;
    };
    const asyncIterator = async.pooledMap(3, numbers, mapper);
    const mapped = await Array.fromAsync(asyncIterator);
    console.log("mapped: ", mapped);
  }

  // retry
  {
    const numbers = [1, 2, 3, 4, 5];
    const mapper = async (n: number) => {
      await async.delay(10);
      // Make it flakey
      if (coinToss(.75)) {
        throw new Error("Oops, something went wrong");
      }
      return n * 2;
    };
    const mapperWithRetry = (n: number) =>
      async.retry(() => mapper(n), {
        maxAttempts: 5,
        minTimeout: 10,
        maxTimeout: 15,
      });

    const mapped = await Promise.all(
      numbers.map(mapperWithRetry),
    );
    console.log("mapped: ", mapped);
  }
}

function basicBytes() {
  // concat
  {
    const bytes1 = utf8Encode("Hello");
    const bytes2 = utf8Encode(" friend");
    const concatenated = utf8Decode(bytes.concat([bytes1, bytes2]));
    console.log("concatenated: ", concatenated);
  }
  // copy
  {
    const bytes1 = utf8Encode("Doodle");
    const bytes2 = utf8Encode("Spongebob");
    bytes.copy(bytes1, bytes2);
    const result = utf8Decode(bytes2); // Doodlebob
    console.log("result: ", result);
  }

  // repeat
  {
    const bytes1 = utf8Encode("foo");
    const result = utf8Decode(bytes.repeat(bytes1, 2));
    console.log("result: ", result);
  }

  // startsWith
  {
    const bytes1 = new Uint8Array([1, 2, 3, 4, 5]);
    const bytes2 = new Uint8Array([1, 2, 3]);
    const result = bytes.startsWith(bytes1, bytes2);
    console.log("result: ", result);
  }

  // includesNeedle
  {
    const bytes1 = new Uint8Array([1, 2, 3, 4, 5]);
    const bytes2 = new Uint8Array([2, 3, 4]);
    const result = bytes.includesNeedle(bytes1, bytes2);
    console.log("result: ", result);
  }

  // endsWith
  {
    const bytes1 = new Uint8Array([1, 2, 3, 4, 5]);
    const bytes2 = new Uint8Array([3, 4, 5]);
    const result = bytes.endsWith(bytes1, bytes2);
    console.log("result: ", result);
  }
}

function basicCache() {
  const cache = new LruCache<unknown, bigint>(1000);
  const factorial = (n: bigint): bigint => {
    return (n <= 1n) ? 1n : n * factorial(n - 1n);
  };

  const factorialMemoized = memoize(factorial, { cache });
  const result1 = factorialMemoized(5n);
  console.log("result1: ", result1);
  const result2 = factorialMemoized(10n);
  console.log("result2: ", result2);
  const result3 = factorialMemoized(15n);
  console.log("result3: ", result3);
}

function basicCbor() {
  const data = { message: "No one can know, not even Squidward's house!" };

  const encoded = encodeCbor(data);
  console.log("encoded: ", encoded);

  const decoded = decodeCbor(encoded);
  console.log("decoded: ", decoded);
}

function basicCli() {
  const parsed = parseArgs(["pipenv", "install", "--dev"]);
  console.log("parsed", parsed);
}

async function basicCommand() {
  const command = new Deno.Command("ls", {
    args: ["-a"],
    stdout: "piped",
    stderr: "piped",
  });
  const result = await command.output();

  const code = result.code;
  const output = utf8Decode(result.stdout);
  const error = utf8Decode(result.stderr);

  prettyPrintResults({
    code,
    output,
    error,
  });
}

function basicCollectionsFunctions() {
  // aggregateGroups
  {
    const valuesRecord = {
      "x": [1, 2, 3],
      "x**2": [1, 4, 9],
      "x**3": [1, 8, 27],
    };
    const result = collections.aggregateGroups(
      valuesRecord,
      (curr, _key, first, acc) => {
        return first ? 0 + curr : acc as number + curr;
      },
    );
    console.log("result: ", result);
  }

  // associateBy
  {
    const ninjas = [
      { firstName: "Kakashi", lastName: "Hatake" },
      { firstName: "Iruka", lastName: "Umino" },
    ];
    const result = collections.associateBy(
      ninjas,
      (n) => `${n.firstName}-${n.lastName}`,
    );
    console.log("associateBy result: ", result);
  }

  // associateBy
  {
    const names = ["Kakashi", "Itachi"];
    const result = collections.associateWith(
      names,
      (n) => n.toLowerCase(),
    );
    console.log("associateWith result: ", result);
  }

  // chunk
  {
    const zeros = Array(10).fill(0);
    const result = collections.chunk(zeros, 5);
    console.log("chunk result: ", result);
  }

  // deepMerge
  {
    const object1 = { a: 1, b: 2 };
    const object2 = { a: 3, c: 4 };
    const result = collections.deepMerge(object1, object2);
    console.log("deepMerge result: ", result);
  }

  // distinct
  {
    const numbers = [1, 2, 3, 4, 1];
    const result = collections.distinct(numbers);
    console.log("distinct result: ", result);
  }

  // distinctBy
  {
    const objects = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 1 }];
    const result = collections.distinctBy(objects, (v) => v.id);
    console.log("distinctBy result: ", result);
  }

  // dropWhile (also `dropLastWhile)
  {
    const numbers = [0, -1, 0, 1, 2, 3];
    const result = collections.dropWhile(numbers, (n) => n <= 0);
    console.log("dropWhile result: ", result);
  }

  // filterEntries
  {
    const record = { a: 0, b: 2, c: -1, d: 3 };
    const result = collections.filterEntries(
      record,
      ([_k, v]) => v > 0,
    );
    console.log("filterEntries result: ", result);
  }

  // filterKeys
  {
    const record = { a: 0, b: 2, c: -1, d: 3 };
    const result = collections.filterKeys(
      record,
      (k) => k !== "b",
    );
    console.log("filterKeys result: ", result);
  }

  // filterValues
  {
    const record = { a: 0, b: 2, c: -1, d: 3 };
    const result = collections.filterValues(
      record,
      (v) => v > 0,
    );
    console.log("filterValues result: ", result);
  }

  // findSingle
  {
    const numbers1 = [1, 2, 3, 4, 5];
    const numbers2 = [1, 2, 3, 2, 1];
    const result1 = collections.findSingle(
      numbers1,
      (n) => n === 2,
    );
    const result2 = collections.findSingle(
      numbers2,
      (n) => n === 2,
    );
    console.log("findSingle result1: ", result1);
    console.log("findSingle result2: ", result2);
  }

  // firstNotNullishOf
  {
    const maybeNumbers = [undefined, 1, 2, null, 4];
    const result = collections.firstNotNullishOf(
      maybeNumbers,
      (v) => v,
    );
    console.log("firstNotNullishOf result: ", result);
  }

  // Object.groupBy (`groupBy` was removed from deno std)
  {
    const values = [{ a: 1, b: "abc" }, { a: 2, b: "def" }];
    const result = Object.groupBy(
      values,
      (v) => v.b,
    );
    console.log("Object.groupBy result: ", result);
  }

  // includesValue
  {
    const record = { a: 1, b: 2 };
    const result = collections.includesValue(record, 2);
    console.log("includesValue result: ", result);
  }

  // invert
  {
    const record = { a: 1, b: 2 };
    const result = collections.invert(record);
    console.log("invert result: ", result);
  }

  // intersect
  {
    const values1 = [1, 2, 3];
    const values2 = [2, 3, 4];
    const result = collections.intersect(values1, values2);
    console.log("intersect result: ", result);
  }

  // mapEntries
  {
    const record = { a: 1, b: 2, c: 3 };
    const result = collections.mapEntries(
      record,
      ([k, v]) => [`${k}**2`, v ** 2],
    );
    console.log("mapEntries result: ", result);
  }

  // mapKeys
  {
    const record = { a: 1, b: 2, c: 3 };
    const result = collections.mapKeys(
      record,
      (k) => k.toUpperCase(),
    );
    console.log("mapKeys result: ", result);
  }

  // mapValues
  {
    const record = { a: 1, b: 2, c: 3 };
    const result = collections.mapValues(record, (v) => v * 2);
    console.log("mapValues result: ", result);
  }

  // mapNotNullish
  {
    const maybeNumbers = [undefined, 1, 2, null, 4];
    const result = collections.mapNotNullish(
      maybeNumbers,
      (v) => v && v * 2,
    );
    console.log("mapNotNullish result: ", result);
  }

  // maxBy
  {
    const records = [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }];
    const result = collections.maxBy(records, (n) => n.age);
    console.log("maxBy result: ", result);
  }

  // maxOf
  {
    const records = [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }];
    const result = collections.maxOf(records, (n) => n.age);
    console.log("maxOf result: ", result);
  }

  // maxWith
  {
    const records = [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }];
    const result = collections.maxWith(records, (n1, n2) => n1.age - n2.age);
    console.log("maxWith result: ", result);
  }

  // minBy
  {
    const records = [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }];
    const result = collections.minBy(records, (n) => n.age);
    console.log("minBy result: ", result);
  }

  // minOf
  {
    const records = [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }];
    const result = collections.minOf(records, (n) => n.age);
    console.log("minOf result: ", result);
  }

  // minWith
  {
    const records = [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }];
    const result = collections.minWith(records, (n1, n2) => n1.age - n2.age);
    console.log("minWith result: ", result);
  }

  // omit
  {
    const record = { a: 1, b: 2, c: 3 };
    const result = collections.omit(record, ["a", "b"]);
    console.log("omit result: ", result);
  }

  // partition
  {
    const numbers = [1, 2, 3, 4, 5];
    const result = collections.partition(numbers, (n) => n % 2 == 0);
    console.log("partition result: ", result);
  }

  // permutations
  {
    const numbers = [1, 2, 3];
    const result = collections.permutations(numbers);
    console.log("partition result: ", result);
  }

  // pick
  {
    const record = { a: 1, b: 2, c: 3 };
    const result = collections.pick(record, ["a", "b"]);
    console.log("pick result: ", result);
  }

  // reduceGroups
  {
    const valuesRecord = {
      "x": [1, 2, 3],
      "x**2": [1, 4, 9],
      "x**3": [1, 8, 27],
    };
    const result = collections.reduceGroups(
      valuesRecord,
      (acc, curr) => acc + curr,
      0,
    );
    console.log("reduceGroups result: ", result);
  }

  // runningReduce
  {
    const numbers = [1, 2, 3, 4, 5];
    const result = collections.runningReduce(
      numbers,
      (acc, curr) => acc + curr,
      0,
    );
    console.log("runningReduce result: ", result);
  }
  // sumOf
  {
    const records = [{ id: "a", count: 3 }, { id: "b", count: 2 }];
    const result = collections.sumOf(
      records,
      (r) => r.count,
    );
    console.log("sumOf result: ", result);
  }

  // sample
  {
    const numbers = [1, 2, 3, 4, 5];
    const result = collections.sample(numbers);
    console.log("sample result: ", result);
  }
  // slidingWindows
  {
    const numbers = [1, 2, 3, 4, 5];
    const result = collections.slidingWindows(numbers, 3);
    console.log("slidingWindows result: ", result);
  }

  // sortBy
  {
    const records = [{ name: "Kakashi", age: 27 }, { name: "Yamato", age: 24 }];
    const result = collections.sortBy(records, (r) => r.name);
    console.log("sortBy result: ", result);
  }

  // takeWhile (also `takeLastWhile)
  {
    const numbers = [1, 2, 1, 0, -1, 0, 1, 2, 1];
    const result = collections.takeWhile(numbers, (n) => n > 0);
    console.log("takeWhile result: ", result);
  }

  // union
  {
    const values1 = [1, 2, 3];
    const values2 = [2, 3, 4];
    const result = collections.union(values1, values2);
    console.log("union result: ", result);
  }

  // zip
  {
    const values1 = [1, 2, 3];
    const values2 = ["a", "b", "c"];
    const result = collections.zip(values1, values2);
    console.log("zip result: ", result);
  }

  // zip
  {
    const tuples = [[1, "a"], [2, "b"], [3, "c"]] as Array<[number, string]>;
    const result = collections.unzip(tuples);
    console.log("unzip result: ", result);
  }

  // withoutAll
  {
    const values1 = [1, 2, 3];
    const values2 = [2, 3, 4];
    const result = collections.withoutAll(values1, values2);
    console.log("withoutAll result: ", result);
  }
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

  prettyPrintResults({
    message,
    messageBytes,
    hashedBytes,
    hashedStringUtf8,
    hashedStringBase64,
  });
}

async function basicCryptoAes() {
  // Message
  const message = "You focus on the trivial, " +
    "and lose sight of what is most important. " +
    "Change is impossible in this fog of ignorance.";

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
  const iv = crypto.getRandomValues(new Uint8Array(16)); // 12 or 16
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
  prettyPrintResults({
    message,
    messageBytes,
    encryptedBytes,
    decryptedBytes,
    decryptedMessage,
  });
}

async function basicCryptoHmac() {
  // TODO: hmac
}

async function basicCryptoMd5() {
  const text = "The owner of the white sedan, you left your lights on.";
  const bytes = utf8Encode(text);
  const hashedBytes = await crypto.subtle.digest("MD5", bytes);
  const hashedHexText = encodeHex(new Uint8Array(hashedBytes));

  prettyPrintResults({
    text,
    bytes,
    hashedBytes,
    hashedHexText,
  });
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

function basicCsv() {
  const records = getNinjaRecords();
  const columns = Object.keys(records[0]);

  const data = csv.stringify(records, { columns });
  console.log("data: ", data);

  const parsed = csv.parse(data, { columns });
  console.log("parsed: ", parsed);
}

function basicDataStructures() {
  // TODO
  structures;
}

function basicDatetime() {
  const iso8601Format = "yyyy-MM-dd";
  const formatIso8601date = (d: Date) => datetime.format(d, iso8601Format);
  const parseIso8601date = (d: string) => datetime.parse(d, iso8601Format);
  const diffMs = (d1: Date, d2: Date) => {
    return datetime.difference(d1, d2).milliseconds;
  };

  const now = new Date();

  prettyPrintResults({
    now,
    "datetime.dayOfYear(now)": datetime.dayOfYear(now),
    "datetime.isLeap(now)": datetime.isLeap(now),
    "datetime.weekOfYear(now)": datetime.weekOfYear(now),
    // Custom
    "formatIso8601date(now)": formatIso8601date(now),
    'parseIso8601date("2022-05-25")': parseIso8601date("2022-05-25"),
    "diffMs(now, new Date())": diffMs(now, new Date()),
  });
}

async function basicDotenv() {
  const env = await loadEnv({ envPath: "./dev.env" });
  console.log("env", env);
}

function basicEncodingBase64() {
  const message = "Where's the leak, mam?";

  prettyPrintResults({
    "utf8Encode(message)": utf8Encode(message),
    "encodeBase64(message)": encodeBase64(message),
    "decodeBase64(encodeBase64(message))": decodeBase64(encodeBase64(message)),
  });
}

function basicEncodingHex() {
  const message = "Where's the leak, mam?";

  prettyPrintResults({
    "utf8Encode(message)": utf8Encode(message),
    "encodeHex(message)": encodeHex(message),
    "decodeHex(encodeHex(message))": decodeHex(encodeHex(message)),
  });
}

function basicExpect() {
  expect(2 * 2).toStrictEqual(4);
  expect("abc").toMatch(/^a/);
  expect(2).toBeDefined();
  expect(undefined).not.toBeDefined();
  expect(null).toBeNull();
  expect(false).not.toBeNull();
  expect("hello").toBeTruthy();
  expect("").toBeFalsy();
  expect([1, 2, 3]).toContain(1);
  expect([1, 2, 3]).not.toContain(0);
  expect([{ a: 1 }]).toContainEqual({ a: 1 });
  expect(4.002).toBeCloseTo(4);
  expect(4).toBeGreaterThan(0);
  expect(4).toBeGreaterThanOrEqual(0);
  expect(-4).toBeLessThan(0);
  expect(-4).toBeLessThanOrEqual(0);
  expect([1, 2, 3]).toHaveLength(3);
  expect(new Date()).toBeInstanceOf(Date);
  expect({ a: 1 }).toHaveProperty("a");
  expect(2).toEqual(expect.any(Number));
  expect(2).toEqual(expect.anything());
  expect([1, 2, 3]).toEqual(expect.arrayContaining([1, 2]));
}

function basicFmt() {
  prettyPrintResults({
    'italic(underline(sprintf("Hi %s", "Kakashi")))': italic(
      underline(sprintf("Hi %s", "Kakashi")),
    ),
    "bgBlue(white(formatBytes(123456)))": bgBlue(white(formatBytes(123456))),
    "inverse(formatDuration(123456))": inverse(formatDuration(123456)),
  });
}

async function basicFs() {
  // Setup
  const filename = "my-file.txt";
  const filename2 = "my-file2.txt";
  const inputDir = posix.join(".", "temp", "input");
  const outputDir = posix.join(".", "temp", "output");
  const inputPath = posix.join(inputDir, filename);
  const inputPath2 = posix.join(inputDir, filename2);
  const outputPath = posix.join(outputDir, filename);
  const outputPath2 = posix.join(outputDir, filename2);
  for (const dir of [inputDir, outputDir]) {
    await Deno.mkdir(dir, { recursive: true });
  }
  Deno.writeFile(inputPath, utf8Encode("Is mayonaise an instrument?"));
  await fs.ensureFile(inputPath);

  // Examples (sync and async)
  // copy, emptyDir, ensureDir, ensureFile, exists, move,
  await fs.ensureDir(outputDir);
  fs.ensureDirSync(outputDir);
  await fs.emptyDir(outputDir);
  await fs.copy(inputPath, outputPath); // {overwrite: true}
  await fs.move(outputPath, outputPath2);
  fs.copySync(inputPath, outputPath); // { overwrite: true }
  fs.moveSync(inputPath, inputPath2);
  await fs.ensureFile(outputPath);
  fs.ensureFileSync(outputPath);

  // Cleanup
  const cleanupPaths = [
    outputPath,
    outputPath2,
    inputPath,
    inputPath2,
    outputDir,
    inputDir,
  ];
  for (const path of cleanupPaths) {
    const exists = await fs.exists(path);
    if (exists) {
      await Deno.remove(path).catch(() => {});
    }
  }
}

async function basicFsWalk() {
  for await (const entry of fs.walk(".")) {
    if (entry.isDirectory) {
      console.log(`${entry.path} is a directory`);
    } else if (entry.isFile) {
      console.log(`${entry.path} is a file`);
    } else if (entry.isSymlink) {
      console.log(`${entry.path} is a symlink`);
    }
  }
}

async function basicIni() {
  // TODO
  ini;
}

async function basicJson() {
  const records = getNinjaRecords();
  const stream = ReadableStream.from(records).pipeThrough(
    new json.JsonStringifyStream(),
  );
  const recordStrings = await Array.fromAsync(stream);
  const result = `[${recordStrings.join(",").replaceAll("\n", "")}]`;
  console.log("result: ", result);
}

function basicJsonc() {
  const records = getNinjaRecords();
  const comment = "// Are you going to finish that croissant?";
  const jsonWithComment = comment + "\n" + JSON.stringify(records);
  const result = jsonc.parse(jsonWithComment);
  prettyPrintResults({
    jsonWithComment,
    result,
  });
}

/** Custom log formatter */
function _customFormatter(lr: log.LogRecord) {
  return `${lr.loggerName}:${lr.levelName}:${lr.msg}`;
}

async function basicLog() {
  const logFilename = "./log.txt";
  // Set up loggers
  log.setup({
    handlers: {
      console: new log.ConsoleHandler("DEBUG", {
        formatter: _customFormatter, // Try `log.formatters.jsonFormatter`
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

function basicMsgpack() {
  const records = getNinjaRecords();
  const packed = msgpack.encode(records);
  const unpacked = msgpack.decode(packed);

  prettyPrintResults({
    records,
    packed,
    unpacked,
  });
}

function basicPath() {
  const filename = "my-file.txt";
  const filename2 = "my-file-2.txt";
  const tempDir = posix.join(".", "temp");
  const filepath = posix.join(tempDir, filename);
  const filepath2 = posix.join(tempDir, filename2);
  const glob = "vscode/*.json";

  prettyPrintResults({
    filepath,
    filepath2,
    glob,
    "posix.basename(filepath)": posix.basename(filepath), // my-file.txt
    "posix.common([filepath, filepath2])": posix.common([filepath, filepath2]),
    "posix.dirname(filepath)": posix.dirname(filepath), // ./temp
    "posix.extname(filepath)": posix.extname(filepath), // .txt
    'posix.format({dir: "temp", base: "my-file.txt"})': posix.format({
      dir: "temp",
      base: "my-file.txt",
    }),
    "posix.globToRegExp(glob)": posix.globToRegExp(glob),
    "posix.isAbsolute(filepath)": posix.isAbsolute(filepath), // false
    "posix.isGlob(glob)": posix.isGlob(glob),
    'posix.join("temp", "my-file.txt")': posix.join("temp", "my-file.txt"),
    'posix.normalize("./temp/../temp/")': posix.normalize("./temp/../temp/"),
    "posix.normalizeGlob(`temp/../${glob}`)": posix.normalizeGlob(
      `temp/../${glob}`,
    ),
    "posix.parse(filepath)": posix.parse(filepath), // { root, dir, base, ext, name }
  });
}

function basicRandom() {
  const prng = random.randomSeeded(1n);

  prettyPrintResults({
    prng,
    "random.randomBetween(1, 10)": random.randomBetween(1, 10),
    "random.randomIntegerBetween(1, 10);": random.randomIntegerBetween(1, 10),
    "random.randomIntegerBetween(1, 10, { prng });": random
      .randomIntegerBetween(1, 10, {
        prng,
      }),
    "random.sample([1, 2, 3])": random.sample([1, 2, 3]),
    "random.shuffle([1, 2, 3])": random.shuffle([1, 2, 3]),
  });
}

function basicRegexp() {
  // TODO
  regexp;
}

async function basicStreams() {
  // TextLineStream
  {
    const fsFile = await Deno.open("./import_map.json");
    let text = "";
    const readable = fsFile.readable.pipeThrough(new TextDecoderStream())
      .pipeThrough(new streams.TextLineStream());
    for await (const data of readable) {
      text += `${data}\n`;
    }
    console.log("text: ", text);
  }
}

async function getTarStreamFile(filepath: string): Promise<tar.TarStreamFile> {
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
  const stream = ReadableStream.from<tar.TarStreamInput>(
    await Promise.all(
      inputFilepaths.map(getTarStreamFile),
    ),
  );
  await stream.pipeThrough(new tar.TarStream())
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
    const entry of stream.pipeThrough(gzip).pipeThrough(new tar.UntarStream())
  ) {
    const path = posix.normalize(entry.path);
    const basename = posix.basename(path);
    const targetPath = posix.join(targetDir, basename);
    await fs.ensureDir(posix.dirname(targetPath));
    if (!entry.readable) {
      continue;
    }
    await entry.readable.pipeTo((await Deno.create(targetPath)).writable);
    paths.push(targetPath);
  }
  return paths;
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
  await fs.ensureFile(inputPath);

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

function basicText() {
  prettyPrintResults({
    'text.closestString("ab", ["abc", "def"]);': text.closestString("ab", [
      "abc",
      "def",
    ]),
    'text.compareSimilarity("ab")("abc", "def")': text.compareSimilarity("ab")(
      "abc",
      "def",
    ),
    'text.levenshteinDistance("spongebob", "doodlebob")': text
      .levenshteinDistance("spongebob", "doodlebob"),
    "text.toCamelCase(\"Where's the leak, ma'am?\")": text.toCamelCase(
      "Where's the leak, ma'am?",
    ),
    "text.toKebabCase(\"Where's the leak, ma'am?\")": text.toKebabCase(
      "Where's the leak, ma'am?",
    ),
    "text.toPascalCase(\"Where's the leak, ma'am?\")": text.toPascalCase(
      "Where's the leak, ma'am?",
    ),
    "text.toSnakeCase(\"Where's the leak, ma'am?\")": text.toSnakeCase(
      "Where's the leak, ma'am?",
    ),
    'text.wordSimilaritySort("ab", ["abc", "def"]);': text.wordSimilaritySort(
      "ab",
      [
        "abc",
        "def",
      ],
    ),
  });
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
