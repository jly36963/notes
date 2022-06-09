const assert = require("node:assert");
const { exec, spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const fsp = require("node:fs/promises"); // require('fs').promises
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { promisify } = require("node:util");
const crypto = require("node:crypto");
const util = require("node:util");
const zlib = require("node:zlib");

/*
// fs promises can be imported using ESM modules (Node 13)
import { promises as fsp } from 'fs';
*/

// ---
// assert
// ---

const basicAssert = async () => {
  assert(5 === 5);
  assert.deepStrictEqual([{ a: 1 }], [{ a: 1 }]); // assert equal (for objects: compare contents)
  assert.doesNotMatch("foo", /bar/); // assert string does not match regExp
  await assert.doesNotReject(async () =>
    await Promise.resolve("Where's the leak, mam?")
  );
  assert.doesNotThrow(() => "East? I thought you said Weast!");
  // assert.fail() // explicitly fail test (use conditionally)
  assert.match(
    "You focus on the trivial, and lose sight of what is most important. Change is impossible in this fog of ignorance.",
    /ignorance/,
  );
  assert.notDeepStrictEqual({ a: 1 }, { b: 2 });
  assert.notEqual({ a: 1 }, { a: 1 }); // Different references (with similar contents)
  assert.ok("お前をずっと愛している"); // assert truthy
  await assert.rejects(async () =>
    await Promise.reject("You have it set to M for Mini")
  );
  assert.strictEqual(1, 1); // assert equal (for objects: must be same reference)
  assert.throws(() => {
    throw new Error("Where's my drink -- my diet Dr Kelp?");
  });

  console.log("All assertions passed");
};

// ---
// Buffer
// ---

// A fixed-size chunk of memory, allocated outside the V8 engine
// Basically an array of hex (each representing a byte of data)
// Buffer is a subclass of Uint8Array that's only available in node (not browser)

// Blob
// Immutable, raw data. Shareable across multiple worker threads. Potential performance gains
// https://developer.mozilla.org/en-US/docs/Web/API/Blob

const basicBuffer = () => {
  let bytes;
  // Buffer (pre-allocated)
  bytes = Buffer.alloc(1024); // 1KB buffer (initialized with 0s) (wipes the segment of memory)
  bytes = Buffer.allocUnsafe(1024); // 1KB buffer (uninitialized) (may contain old/sensitive data)
  bytes = Buffer.allocUnsafe(5).fill("a");
  bytes = Buffer.alloc(5).write("abcde");
  // Buffer from int[]
  bytes = Buffer.from([1, 2, 3]); // can also use hex numbers
  // Buffer from string
  const text = "In order to survive, we cling to all we know and understand. " +
    "And label it reality. " +
    "But knowledge and understanding are ambiguous. " +
    "That reality could be an illusion. " +
    "All humans live with the wrong assumptions.";
  bytes = Buffer.from(text);
  const isBuffer = Buffer.isBuffer(bytes);
  const includes = bytes.includes("ambiguous");
  // Copy (independent)
  const bytesCopy = Buffer.alloc(bytes.length);
  bytesCopy.set(bytes);
  const areEqual = bytes.equals(bytesCopy); // Same contents
  // Share memory
  const bytesShared = Buffer.from(bytes.buffer);
  const subarray = bytes.subarray(130, 164).toString();
  // Results
  console.log({
    bytes,
    isBuffer,
    includes,
    bytesLength: bytes.length,
    bytesByteLength: bytes.byteLength,
    bytesCopy,
    areEqual,
    bytesShared,
    subarray,
    uint8Array: new Uint8Array(bytes),
    text: bytes.toString(), // Uses utf-8 encoding by default
    textBase64: bytes.toString("base64"),
    textHex: bytes.toString("hex"),
  });
};

// ---
// child_process
// ---

// spawn: no new shell, uses streams
// exec: creates a new shell, returns output all at once

const basicChildProcess = async () => {
  const execAsync = promisify(exec);
  let stdout, stderr, output;

  // exec (async)
  ({ stdout, stderr } = await execAsync("ls"));
  if (stderr) throw new Error(stderr);
  console.log("promisify exec result:");
  console.log(stdout);

  // exec (async stream) (not sure if its actually a stream) (?)
  ({ stdout, stderr } = exec("ls"));
  output = [];
  for await (const chunk of stdout) {
    output.push(chunk);
  }
  console.log("stream exec result:");
  console.log(output.join());

  // spawn (async stream)
  ({ stdout, stderr } = spawn("ls"));
  output = [];
  for await (const chunk of stdout) {
    output.push(chunk);
  }
  console.log("stream spawn result:");
  console.log(output.join());

  // spawn (sync)
  ({ stdout, stderr } = spawnSync("ls")); // Buffer
  if (stderr.byteLength) throw new Error(stderr);
  console.log("spawnSync result:");
  console.log(stdout.toString());
};

// ---
// cluster
// ---

// https://nodejs.org/api/cluster.html

// ---
// CLI
// ---

// https://nodejs.org/api/cli.html

// ---
// crypto
// ---

const basicCryptoRandom = async () => {
  const randomInt = promisify(crypto.randomInt);

  const randomBytesResult = crypto.randomBytes(32).toString("base64");
  const randomFillSyncResult = crypto
    .randomFillSync(Buffer.alloc(32))
    .toString("base64");
  const randomIntResult = await randomInt(100);
  const randomUUIDResult = crypto.randomUUID();

  console.log({
    randomBytesResult,
    randomFillSyncResult,
    randomIntResult,
    randomUUIDResult,
  });
};

const basicCrypto = () => {
  let message, secret, hash, publicKey, privateKey, encrypted, decrypted;

  // hash (md5)
  message = "He's just standing there, menacingly";
  hash = crypto.createHash("md5").update(message).digest("base64");

  // hash (sha-256)
  message = "The pioneers used to ride these babies for miles";
  hash = crypto.createHash("sha256").update(message).digest("base64");
  console.log("hash sha-256 digest (base64)");
  console.log({ message, hash });

  // hmac hash (sha-256)
  message = "One embarrassing snapshot of SpongeBob at the Christmas party";
  secret = "No one can know, not even Squidward's house";
  hash = crypto.createHmac("sha256", secret).update(message).digest("base64");
  console.log("hmac (sha256) digest");
  console.log({ message, hash });

  // encrypt (aes-gcm)
  message =
    "I have faith that there will come a time when people can truly understand one another";
  const key = Buffer.from(crypto.randomBytes(32), "utf-8");
  const iv = Buffer.from(crypto.randomBytes(12), "utf-8");
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  encrypted = cipher.update(message, "utf-8", "base64") +
    cipher.final("base64");
  const authTag = cipher.getAuthTag();

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  decrypted = decipher.update(encrypted, "base64", "utf-8") +
    decipher.final("utf-8");
  console.log("encrypted (aes-gcm)");
  console.log({ message, encrypted, decrypted });

  // encrypt (rsa)
  message = "FINLAND!";
  const { RSA_PKCS1_OAEP_PADDING } = crypto.constants;
  ({ publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  }));
  encrypted = crypto.publicEncrypt(
    { key: publicKey, padding: RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    Buffer.from(message),
  );

  decrypted = crypto.privateDecrypt(
    { key: privateKey, padding: RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    encrypted,
  );
  console.log("decrypted (rsa oaep)");
  console.log({
    message,
    encrypted: encrypted.toString("base64"),
    decrypted: decrypted.toString("utf-8"),
  });
};

// ---
// Errors
// ---

// https://nodejs.org/api/errors.html

// ---
// https://nodejs.org/api/events.html
// ---

// https://nodejs.org/api/errors.html

// ---
// Globals
// ---

// https://nodejs.org/api/globals.html

// ---
// http
// ---

// https://nodejs.org/api/http.html

// ---
// fs (file descriptors)
// ---

// POSIX systems -- for every process, the kernel contains a table of currently open files and resources.
// open -- creates a new file descriptor.
// descriptor -- can be used to read from, write to, or request info from the file.
// close -- close descriptor. (PREVENT MEMORY LEAKS)

// fd methods:
// appendFile, chmod, chown, close,
// createReadStream, createWriteStream,
// read, readFile, truncate, write, writeFile

// fs.constants
// https://nodejs.org/docs/latest/api/fs.html#fs_fs_constants_1

const basicFsFileDescriptors = async () => {
  // Set up
  const dir = "./temp";
  fs.mkdirSync(dir, { recursive: true });
  const fp = "./temp/my-file.txt";
  await fsp.writeFile(fp, "");

  // fs.open
  let fd;
  try {
    fd = await fsp.open(fp, "w+");
    const stats = await fd.stat();
    await fd.write("Is mayonaise an instrument?" + "\n");
    await fd.writeFile(
      "It'll quench ya. Nothing is quenchier. It's the quenchiest!" + "\n",
    );
    const contents = (await fd.readFile({ encoding: "utf-8" })).toString();
    await fd.appendFile(
      "The owner of the white sedan, you left your lights on." + "\n",
      { encoding: "utf8" },
    );
    await fd.truncate();

    console.log({ stats, contents });
  } finally {
    await fd?.close();
  }

  // Clean up
  await fsp.unlink(fp);
  await fsp.rmdir(dir);
};

// ---
// fs
// ---

// fs/promises: promisified versions of fs methods
// fsp api docs -- https://nodejs.org/docs/latest/api/fs.html#fs_fsp_access_path_mode
// not all fs methods are supported by fs/promises

const basicFs = async () => {
  // Set up
  const dir = "./temp";
  fs.mkdirSync(dir, { recursive: true });
  const fp = "./temp/my-file.txt";
  const fp2 = "./temp/my-file-2.txt";
  const fp3 = "./temp/my-file-3.txt";
  await fsp.writeFile(fp, "");

  // fs.accessSync
  // Throws error if user does not have permissions to access
  fs.accessSync(fp, fs.constants.R_OK | fs.constants.W_OK);

  // fs.appendFile
  await fsp.appendFile(
    fp,
    "The owner of the white sedan, you left your lights on." + "\n",
    { encoding: "utf8" },
  );

  // fs.writeFile
  await fsp.writeFile(
    fp,
    "It'll quench ya. Nothing is quenchier. It's the quenchiest!" + "\n",
  );

  // fs.copyFile
  // Will overwrite if exists, use fs.constants.COPYFILE_EXCL to prevent this
  await fsp.copyFile(fp, fp2);

  // fs.readFile
  const contents = (await fsp.readFile(fp)).toString();

  // fs.stat
  const stats = await fsp.stat(fp);

  // fs.rename
  fs.renameSync(fp2, fp3);

  // fs.write (more granular control than fs.writeFile)
  // TODO

  // Results
  console.log({ stats, contents });

  // Clean up
  await fsp.unlink(fp);
  await fsp.unlink(fp3);
  await fsp.rmdir(dir);
};

const _basicFsStream = () => {
  // fs.createReadStream
  // synchronous interface (no callback/promises)

  let stream;

  // handle data
  stream = fs.createReadStream("myfile.txt");
  stream.on("data", (chunk) => console.log(chunk.toString())); // handle data

  // readable
  stream = fs.createReadStream("myfile.txt");
  stream.on("readable", () => {
    console.log("ready to read");
    this.read();
  });

  // pipe (pipe to http server response)
  http.createServer((req, res) => {
    const fn = path.join(__dirname, req.url); // get filename from request url
    const stream = fs.createReadStream(fn);
    readStream.on("open", () => stream.pipe(res)); // pipe stream to response;
    readStream.on("error", (err) => console.log(err.message));
  });

  // fs.end
  // TODO

  // fs.createWriteStream
  // TODO
};

// ---
// module (cjs)
// ---

// cjs
// https://nodejs.org/api/modules.html

// esm
// https://nodejs.org/api/esm.html

// packages
// https://nodejs.org/api/packages.html

// ---
// os
// ---

const basicOs = () => {
  const arch = os.arch(); // x64
  const [cpu0] = os.cpus(); // list of objects describing each logical CPU core -- [ { model, speed, times } ]
  const cpuLogicalCores = os.cpus().length; // number of logical cores (not physical)
  const freemem = os.freemem(); // free memory in bytes (integer)
  const homedir = os.homedir(); // path of current user's home directory. (POSIX -- $HOME env var) ( Windows -- USERPROFILE env var)
  const hostname = os.hostname(); // host name of OS as a string
  const platform = os.platform(); // operating system platform (darwin, linux, win32, etc)
  const release = os.release(); // version of OS as string (POSIX -- uname(3)) (Windows -- GetVersionExW())
  const tmpdir = os.tmpdir(); // OS default directory for temporary files
  const totalmem = os.totalmem(); // total system memory in bytes (integer)
  const type = os.type(); // OS name (uname(3)) (Linux, Darwin, Windows_NT)
  const userInfo = os.userInfo(); // return info about user (from password file) (uid, gid, username, homedir, shell)
  const version = os.version(); // kernel version

  console.log({
    arch,
    cpu0,
    cpuLogicalCores,
    freemem,
    homedir,
    hostname,
    platform,
    release,
    tmpdir,
    totalmem,
    type,
    userInfo,
    version,
  });
};

// ---
// stdin, stdout, stderr
// ---

// https://nodejs.org/docs/latest/api/process.html#process_process_stderr

// ---
// promisify
// ---

const _basicPromisify = () => {
  // Converts function with callback (err, data) into a func that returns a promise
  const _open = promisify(fs.open);
};

// ---
// path
// ---

const basicPath = () => {
  const basename = path.basename("/foo/bar/baz/asdf/quux.html"); // 'quux.html'
  const delimiter = path.delimiter; // $PATH delimiter (platform specific) // process.env.PATH.split(path.delimiter);
  const dirname = path.dirname("/foo/bar/baz/quux.js"); // '/foo/bar/baz'
  const extname = path.extname("index.js"); // '.js'
  const join = path.join(__dirname, "index.js"); // join path segments together
  const normalize = path.normalize("/foo/bar/baz/.."); // '/foo/bar' // resolve '.' and '..'
  const parse = path.parse("/home/user/dir/index.js"); // { root, dir, base, ext, name }
  const relative = path.relative("foo/bar/baz/aaa", "foo/bar/baz/bbb"); // '../bbb' // relative path between two files
  const sep = path.sep; // path segment delimiter (platform specific) // 'foo/bar/baz'.split(path.sep);
  const resolved = path.resolve("."); // rel -> abs

  console.log({
    basename,
    delimiter,
    dirname,
    extname,
    join,
    normalize,
    parse,
    relative,
    sep,
    resolved,
  });
};

// ---
// Streams
// ---

// https://nodejs.dev/learn/nodejs-streams

// Similar to Buffer, but the data is handled piece by piece (instead of all at once)
// Advantages: memory efficiency (less loaded in to memory). time efficiency (process before receiving all data)
// An http server can pipe a stream to the client -- stream.pipe(res)
// The point is to handle the data in smaller chunks, rather than waiting to load all the data at once
// Types: Readable, Writeable, Duplex, Transform

const basicStreams = async () => {
  // Set up
  const dir = "./temp";
  fs.mkdirSync(dir, { recursive: true });
  const fp = "./temp/my-file.txt";
  const contents =
    "It'll quench ya. Nothing is quenchier. It's the quenchiest! ".repeat(100);
  await fsp.writeFile(fp, contents);
  // Stream
  const stream = fs.createReadStream(fp);
  // Handle chunks iteratively
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const bytes = Buffer.concat(chunks); // combine Buffers
  // Result
  const text = bytes.toString();
  console.log({
    lenBytes: bytes.length,
    lenText: text.length,
    text: `${text.slice(0, 60)} ...`,
  });
  // Cleanup
  await fsp.unlink(fp);
  await fsp.rmdir(dir);
};

// ---
// Test runner
// ---

// https://nodejs.org/api/test.html

// ---
// url
// ---

// https://nodejs.org/api/url.html

// ---
// util
// ---

// https://nodejs.org/api/util.html
const basicUtil = () => {
  const formatResult = util.format("Hello %s", "world");
  const isDeepStrictEqualResult = util.isDeepStrictEqual({ a: 1 }, { a: 1 });
  // const parseArgsResult = util.parseArgs(["cmd1, 1, 2, --verbose"]);

  console.log({
    formatResult,
    isDeepStrictEqualResult,
    // parseArgsResult,
  });
};

// ---
// util (types)
// ---

const basicUtilTypes = () => {
  const {
    isAsyncFunction,
    isDate,
    isGeneratorFunction,
    isMap,
    isNativeError,
    isPromise,
    isRegExp,
    isSet,
  } = util.types;
  // Check type
  assert(isAsyncFunction(async () => await Promise.resolve(5)));
  assert(isDate(new Date()));
  assert(isGeneratorFunction(function* () {
    yield 5;
  }));
  assert(isMap(new Map()));
  assert(isPromise(Promise.resolve(5)));
  assert(isRegExp(/oops/));
  assert(isSet(new Set()));
  assert(isNativeError(new Error("oops")));

  // Check type (use these instead of deprecated util functions)
  assert(Array.isArray([]));
  assert(typeof true === "boolean");
  assert(Buffer.isBuffer(Buffer.from("Hello")));
  assert(typeof (() => 5) === "function");
  assert(null === null);
  assert(typeof 5 === "number");
  assert(typeof "hello" === "string");
};

// ---
// util (text encoding)
// ---

const basicUtilTextEncoding = () => {
  const { TextEncoder, TextDecoder } = util;

  const message =
    "I have faith that there will come a time when people can truly understand one another";
  const bytes = new TextEncoder().encode(message);
  const decoded = new TextDecoder("utf-8").decode(bytes);

  console.log({ message, bytes, decoded });
};

// ---
// workers
// ---

// https://nodejs.org/api/worker_threads.html

// ---
// zlib
// ---

const basicZlib = async () => {
  let message, bytes, compressedBytes, base64Encoded;

  // zlib
  const inflate = promisify(zlib.inflate);
  const deflate = promisify(zlib.deflate);

  message = "Is mayonaise an instrument";
  bytes = Buffer.from(message);
  compressedBytes = await deflate(bytes);
  base64Encoded = compressedBytes.toString("base64");

  console.log({
    message,
    bytes,
    compressedBytes,
    base64Encoded,
    uncompressed: (await inflate(compressedBytes)).toString("utf-8"),
  });

  // gzip
  const gzip = promisify(zlib.gzip);
  const gunzip = promisify(zlib.gunzip);

  message = "Muh muh muh, muh muh, muh muh. Man Ray!";
  bytes = Buffer.from(message);
  compressedBytes = await gzip(bytes);
  base64Encoded = compressedBytes.toString("base64");

  console.log({
    message,
    bytes,
    compressedBytes,
    base64Encoded,
    uncompressed: (await gunzip(compressedBytes)).toString("utf-8"),
  });
};

// ---
// Main
// ---

const printSectionTitle = (title) => {
  console.log("\n" + title.toUpperCase() + "\n");
};

const main = async () => {
  printSectionTitle("basic assert");
  basicAssert();

  printSectionTitle("basic buffer");
  basicBuffer();

  printSectionTitle("basic child process");
  await basicChildProcess();

  printSectionTitle("basic crypto (random)");
  await basicCryptoRandom();

  printSectionTitle("basic crypto");
  basicCrypto();

  printSectionTitle("basic fs (fd)");
  await basicFsFileDescriptors();

  printSectionTitle("basic fs");
  await basicFs();

  printSectionTitle("basic os");
  basicOs();

  printSectionTitle("basic path");
  basicPath();

  printSectionTitle("basic streams");
  await basicStreams();

  printSectionTitle("basic util");
  await basicUtil();

  printSectionTitle("basic util (types)");
  basicUtilTypes();

  printSectionTitle("basic util (text encoding)");
  basicUtilTextEncoding();

  printSectionTitle("basic zlib");
  await basicZlib();
};

main();
