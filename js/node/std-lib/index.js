const assert = require('node:assert')
const fs = require('fs');
const fsp = require('fs/promises'); // require('fs').promises
const http = require('http');
const os = require('os');
const path = require('path');
const { promisify } = require('util');


// ---
// assert
// ---

const basicAssert = async () => {
  assert(5 === 5)
  assert.deepStrictEqual([{ a: 1 }], [{ a: 1 }]) // assert equal (for objects: compare contents)
  assert.doesNotMatch('foo', /bar/) // assert string does not match regExp
  await assert.doesNotReject(async () => await Promise.resolve("Where's the leak, mam?"))
  assert.doesNotThrow(() => "East? I thought you said Weast!")
  // assert.fail() // explicitly fail test (use conditionally)
  assert.match(
    "You focus on the trivial, and lose sight of what is most important. Change is impossible in this fog of ignorance.",
    /ignorance/
  )
  assert.notDeepStrictEqual({ a: 1 }, { b: 2 })
  assert.notEqual({ a: 1 }, { a: 1 }) // Different references (with similar contents)
  assert.ok("お前をずっと愛している") // assert truthy
  await assert.rejects(async () => await Promise.reject("You have it set to M for Mini"))
  assert.strictEqual(1, 1) // assert equal (for objects: must be same reference)
  assert.throws(() => { throw new Error("Where's my drink -- my diet Dr Kelp?") })

  console.log('All assertions passed')
}

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
  let bytes
  // Buffer (pre-allocated)
  bytes = Buffer.alloc(1024) // 1KB buffer (initialized with 0s) (wipes the segment of memory)
  bytes = Buffer.allocUnsafe(1024) // 1KB buffer (uninitialized) (may contain old/sensitive data)
  bytes = Buffer.allocUnsafe(5).fill('a')
  // Buffer from int[]
  bytes = Buffer.from([1, 2, 3]) // can also use hex numbers
  // Buffer from string
  const text =
    "In order to survive, we cling to all we know and understand. " +
    "And label it reality. " +
    "But knowledge and understanding are ambiguous. " +
    "That reality could be an illusion. " +
    "All humans live with the wrong assumptions.";
  bytes = Buffer.from(text);
  const isBuffer = Buffer.isBuffer(bytes)
  const includes = bytes.includes('ambiguous')
  // Copy (independent)
  const bytesCopy = Buffer.alloc(bytes.length)
  bytesCopy.set(bytes)
  const areEqual = bytes.equals(bytesCopy) // Same contents
  // Share memory
  const bytesShared = Buffer.from(bytes.buffer)
  const subarray = bytes.subarray(130, 164).toString()
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
    textBase64: bytes.toString('base64'),
    textHex: bytes.toString('hex'),
  })
}

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
  const dir = './temp'
  fs.mkdirSync(dir, { recursive: true })
  const fp = './temp/my-file.txt'
  await fsp.writeFile(fp, "")

  // fs.open
  let fd;
  try {
    fd = await fsp.open(fp, 'w+');
    const stats = await fd.stat()
    await fd.write("Is mayonaise an instrument?" + '\n')
    await fd.writeFile("It'll quench ya. Nothing is quenchier. It's the quenchiest!" + '\n')
    const contents = (await fd.readFile({ encoding: 'utf-8' })).toString()
    await fd.appendFile(
      'The owner of the white sedan, you left your lights on.' + '\n',
      { encoding: 'utf8' }
    )
    await fd.truncate()

    console.log({ stats, contents })
  } finally {
    await fd?.close()
  }

  // Clean up
  await fsp.unlink(fp)
  await fsp.rmdir(dir)
}

// ---
// fs
// ---

// fs/promises: promisified versions of fs methods
// fsp api docs -- https://nodejs.org/docs/latest/api/fs.html#fs_fsp_access_path_mode
// not all fs methods are supported by fs/promises

const basicFs = async () => {
  // Set up
  const dir = './temp'
  fs.mkdirSync(dir, { recursive: true })
  const fp = './temp/my-file.txt'
  const fp2 = './temp/my-file-2.txt'
  const fp3 = './temp/my-file-3.txt'
  await fsp.writeFile(fp, "")

  // fs.accessSync
  // Throws error if user does not have permissions to access
  fs.accessSync(fp, fs.constants.R_OK | fs.constants.W_OK);

  // fs.appendFile
  await fsp.appendFile(
    fp,
    'The owner of the white sedan, you left your lights on.' + '\n',
    { encoding: 'utf8' }
  );

  // fs.writeFile
  await fsp.writeFile(
    fp,
    "It'll quench ya. Nothing is quenchier. It's the quenchiest!" + '\n'
  )

  // fs.copyFile
  // Will overwrite if exists, use fs.constants.COPYFILE_EXCL to prevent this
  await fsp.copyFile(fp, fp2);

  // fs.readFile
  const contents = (await fsp.readFile(fp)).toString();

  // fs.stat
  const stats = await fsp.stat(fp)

  // fs.rename
  fs.renameSync(fp2, fp3);

  // fs.write (more granular control than fs.writeFile)
  // TODO

  // Results
  console.log({ stats, contents })

  // Clean up
  await fsp.unlink(fp)
  await fsp.unlink(fp3)
  await fsp.rmdir(dir)
}

const _basicFsStream = () => {
  // fs.createReadStream
  // synchronous interface (no callback/promises)

  let stream

  // handle data
  stream = fs.createReadStream('myfile.txt');
  stream.on('data', (chunk) => console.log(chunk.toString())) // handle data

  // readable
  stream = fs.createReadStream('myfile.txt');
  stream.on('readable', () => {
    console.log('ready to read');
    this.read();
  })

  // pipe (pipe to http server response)
  http.createServer((req, res) => {
    const fn = path.join(__dirname, req.url); // get filename from request url
    const stream = fs.createReadStream(fn);
    readStream.on('open', () => stream.pipe(res)); // pipe stream to response;
    readStream.on('error', (err) => console.log(err.message));
  })

  // fs.end
  // TODO

  // fs.createWriteStream
  // TODO
}

// ---
// os
// ---

const basicOs = () => {
  const arch = os.arch(); // x64
  const [cpu0] = os.cpus() // list of objects describing each logical CPU core -- [ { model, speed, times } ]
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
    arch, cpu0, cpuLogicalCores, freemem, homedir, hostname,
    platform, release, tmpdir, totalmem, type, userInfo, version
  })
}

// ---
// stdin, stdout, stderr
// ---

// https://nodejs.org/docs/latest/api/process.html#process_process_stderr

// ---
// promisify
// ---

/*
// fs promises can be imported using ESM modules (Node 13)
import { promises as fsp } from 'fs';
*/

const _basicPromisify = () => {
  // Converts function with callback (err, data) into a func that returns a promise
  const _open = promisify(fs.open);
}

// ---
// path
// ---

const basicPath = () => {
  const basename = path.basename('/foo/bar/baz/asdf/quux.html'); // 'quux.html'
  const delimiter = path.delimiter // $PATH delimiter (platform specific) // process.env.PATH.split(path.delimiter);
  const dirname = path.dirname('/foo/bar/baz/quux.js') // '/foo/bar/baz'
  const extname = path.extname('index.js') // '.js'
  const join = path.join(__dirname, 'index.js') // join path segments together
  const normalize = path.normalize('/foo/bar/baz/..') // '/foo/bar' // resolve '.' and '..'
  const parse = path.parse('/home/user/dir/index.js') // { root, dir, base, ext, name }
  const relative = path.relative('foo/bar/baz/aaa', 'foo/bar/baz/bbb') // '../bbb' // relative path between two files
  const sep = path.sep // path segment delimiter (platform specific) // 'foo/bar/baz'.split(path.sep);
  const resolved = path.resolve('.') // rel -> abs

  console.log({
    basename, delimiter, dirname, extname, join, normalize, parse, relative, sep, resolved
  })
}

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
  const dir = './temp'
  fs.mkdirSync(dir, { recursive: true })
  const fp = './temp/my-file.txt'
  const contents = "It'll quench ya. Nothing is quenchier. It's the quenchiest! ".repeat(100)
  await fsp.writeFile(fp, contents)
  // Stream
  const stream = fs.createReadStream(fp)
  // Handle chunks iteratively
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  const bytes = Buffer.concat(chunks) // combine Buffers
  // Result
  const text = bytes.toString()
  console.log({
    lenBytes: bytes.length,
    lenText: text.length,
    text: `${text.slice(0, 60)} ...`

  })
  // Cleanup
  await fsp.unlink(fp)
  await fsp.rmdir(dir)
}

// TODO: zlib createGzip, createGunzip

// ---
// Main
// ---

const printSectionTitle = (title) => {
  console.log("\n" + title.toUpperCase() + "\n")
}

const main = async () => {

  printSectionTitle('basic assert')
  basicAssert()

  printSectionTitle('basic buffer')
  basicBuffer()

  printSectionTitle('basic fs (fd)')
  await basicFsFileDescriptors()

  printSectionTitle('basic fs')
  await basicFs()

  printSectionTitle('basic os')
  basicOs()

  printSectionTitle('basic path')
  basicPath()

  printSectionTitle('basic streams')
  await basicStreams()
}

main()