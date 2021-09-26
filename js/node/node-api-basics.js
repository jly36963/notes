// -----------
// nodejs api basics
// -----------

// https://nodejs.org/api/

// -----------
// promisify
// -----------

// imports
const fs = require('fs');
const { promisify } = require('util');
// function with callback --> function that returns promise
const createReadStream = promisify(fs.createReadStream);

// -----------
// -----------
// module
// -----------
// -----------

__dirname // directory name of current module
__filename // file name of current module (absolute path, symlinks resolved)
const myModule = require('myModule'); // import (from node_modules, path relative to __dirname, or path relative to cwd)
module.exports = new Thing(); // export a class instance
module.exports = { a, b, c }; // export an object

// -----------
// -----------
// timers (global)
// -----------
// -----------

// each timer function returns an object that repesents the scheduled timer

const immediate = setImmediate(() => console.log('hi')); // call function at end of this nodejs event loop;
const interval = setInterval(() => console.log('hi'), 10000); // call function every 10 seconds
const timeout = setTimeout(() => console.log('hi'), 1000); // call function in 1 second

// clear timers (prevent memory leaks)

clearImmediate(immediate);
clearInterval(interval);
clearTimeout(timeout);

// -----------
// -----------
// fs
// -----------
// -----------

const fs = require('fs');

// -----------
// fs/promises
// -----------

// fsPromises api docs -- https://nodejs.org/docs/latest/api/fs.html#fs_fspromises_access_path_mode

// promisified versions of fs methods
// supported methods
  // access, copyFile, open, read, write, rename, truncate, ftruncate, rmdir, 
  // fdatasync, fsync, mkdir, readdir, readlink, symlink, fstat, lstat, stat, 
  // link, unlink, fchmod, chmod, lchmod, lchown, fchown, chown, utimes, futimes, 
  // realpath, mkdtemp, writeFile, appendFile and readFile
// can be imported using ESM modules (Node 13)
  // import { promises as fsPromises } from 'fs';

const fsPromises = require('fs/promises'); // require('fs').promises


// -----------
// fs constants
// -----------

// https://nodejs.org/docs/latest/api/fs.html#fs_fs_constants_1

// -----------
// fs.open
// -----------

// open
  // POSIX systems -- for every process, the kernel contains a table of currently open files and resources.
  // open -- creates a new file descriptor. 
  // descriptor -- can be used to read from, write to, or request info from the file.
  // close -- close descriptor. (PREVENT MEMORY LEAKS)

let fd;
try {
  const fp = 'my-file.txt'; // relative path, absolute path, buffer ( Buffer.from('/dir1/file.txt/) )
  fd = await fsPromises.open(fp, 'r'); // creates file descriptor
} catch (err) {
  console.log(err.message); // log error
} finally {
  // close file descriptor
  if (fd) {
    fsPromises.close(fd)
      .then(() => console.log('closed successfully'))
      .catch((err) => console.log(err.message))
  }
}

// -----------
// fs.accessSync
// -----------

// does user have permissions to access specific file (throws error if not)

try {
  fs.accessSync('etc/passwd', fs.constants.R_OK | fs.constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}


// -----------
// fs.appendFile
// -----------

// path -- string, url, buffer, file descriptor
// data -- string, buffer
// options -- object, string

// string for path argument
try {
  const fp = 'my-file.txt';
  const text = 'Hello there!!';
  await fsPromises.appendFile(fp, text, { encoding: 'utf8' });
} catch (err) {
  console.log(err.message);
}

// fd for path argument

let fd;
try {
  const fp = 'my-file.txt';
  const text = 'Hello there!!';
  fd = await fsPromises.open(fp, 'a');
  await fsPromises.appendFile(fd, text, { encoding: 'utf8' });
} catch (err) {
  console.log(err.message);
} finally {
  if (fd) {
    fsPromises.close(fd)
      .then(() => console.log('closed successfully'))
      .catch((err) => console.log(err.message))
  }
}

// -----------
// fs.copyFile
// -----------

const { COPYFILE_EXCL } = fs.constants;

const fpSrc = 'my-file.txt';
const fpDest  = 'dir1/my-file.txt'

// copy file (overwrite if destination exists)

try {
  await fsPromises.copyFile(fpSrc, fpDest);
} catch (err) {
  console.log(err.message);
}

// copy file (fail operation if destination exists)
try {
  await fsPromises.copyFile(fpSrc, fpDest, COPYFILE_EXCL);
} catch (err) {
  console.log(err.message);
}

// -----------
// fs.createReadStream
// -----------

// synchronous interface (no callback/promises)

// handle data
const stream = fs.createReadStream('myfile.txt');
stream.on('data', (chunk) => console.log(chunk.toString())) // handle data

// readable
const stream = fs.createReadStream('myfile.txt');
stream.on('readable', () => {
  console.log('ready to read');
  this.read();
})

// pipe (pipe to http server response)
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  const fn = path.join(__dirname, req.url); // get filename from request url
  const stream = fs.createReadStream(fn);
  readStream.on('open', () => stream.pipe(res)); // pipe stream to response;
  readStream.on('error', (err) => console.log(err.message));
})

// end
// ...


// -----------
// fs.createWriteStream
// -----------

// ...

// -----------
// fs.existsSync
// -----------

// 'fs.exists' is weird / deprecated

const fp = "my-file.txt";
if (fs.existsSync(fp)) console.log(`${fp} exists!`);

// -----------
// fs.mkdirSync
// -----------

// 'fs.mkdir' is weird

const dir = 'dir1/dir2/';
fs.mkdirSync(dir, { recursive: true }); // recursive will make all intermediate dirs


// -----------
// fs.readfile
// -----------

// string for path
try {
  const data = await fsPromises.readFile('my-file.txt');
  console.log(data);
} catch (err) {
  console.log(err.message);
}

// file descriptor for path
let fd;
try {
  const fp = 'my-file.txt'; // relative path, absolute path, buffer ( Buffer.from('/dir1/file.txt/) )
  fd = await fsPromises.open(fp, 'r');
  const data = fsPromises.readFile(fd);
  console.log(data);
} catch (err) {
  console.log(err.message);
} finally {
  if (fd) {
    fsPromises.close(fd)
      .then(() => console.log('closed successfully'))
      .catch((err) => console.log(err.message))
  }
}

// -----------
// fs.rename
// -----------

const oldPath = 'my-file.txt';
const newPath = 'your-file.txt';
fs.renameSync(oldPath, newPath);


// -----------
// fs.write (more granular control than fs.writeFile)
// -----------

// buffer -- https://nodejs.org/docs/latest/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback
// string -- https://nodejs.org/docs/latest/api/fs.html#fs_fs_write_fd_string_position_encoding_callback

// -----------
// fs.writeFile
// -----------

// file -- string, buffer, url, int
// data -- string, buffer, typedarray, dataview
// options -- object, string (encoding, mode, flag)

try {
  const fp = 'my-file.txt';
  const data = 'Hello there!';
  const options = { encoding: 'utf8' }
  await fsPromises.writeFile(fp, data, options)
} catch (err) {
  console.log(err.message);
}

// -----------
// -----------
// os
// -----------
// -----------

const os = require('os');

os.arch(); // x64
os.cpus() // list of objects describing each logical CPU core -- [ { model, speed, times } ]
os.cpus().length; // number of logical cores (not physical)
os.freemem(); // free memory in bytes (integer)
os.homedir(); // path of current user's home directory. (POSIX -- $HOME env var) ( Windows -- USERPROFILE env var)
os.hostname(); // host name of OS as a string
os.networkInterfaces(); // returns an object containing network interfaces that have an assigned network address.
os.platform(); // operating system platform (darwin, linux, win32, etc)
os.release(); // version of OS as string (POSIX -- uname(3)) (Windows -- GetVersionExW())
os.tmpdir(); // OS default directory for temporary files
os.totalmem(); // total system memory in bytes (integer)
os.type(); // OS name (uname(3)) (Linux, Darwin, Windows_NT)
os.userInfo(); // return info about user (from password file) (uid, gid, username, homedir, shell)
os.version(); // kernel version

// -----------
// -----------
// process
// -----------
// -----------


process.arch; // 'x64' // OS CPU architecture for which the nodejs binary was compiled
process.argv; // nodejs index.js one two=three four --> [ nodeBinaryPath, filePath, ...args ]
process.argv0; // read-only copy of original value of argv[0] passed when nodejs starts
process.chdir(__dirname) // change cwd of process
process.cwd(); // current working directory
process.env; // object containing env vars (treat as read-only, changes will not reflect outside nodejs process)
process.env.NODE_ENV; // specific env var value
// process.exit(0); // 0 -- success, 1 -- failure // exit codes -- https://nodejs.org/docs/latest/api/process.html#process_exit_codes
process.kill(pid, signal); // signals -- SIGTERM (default), SIGINT, SIGNUP, 0 (tests existence), etc 
process.memoryUsage(); // { rss, heapTotal, heapUsed, external, arrayBuffers }
process.pid // pid of nodejs process
process.platform; // OS platform on which nodejs process is running (darwin, linux, win32, etc)
process.ppid // pid of parent process
process.resourceUsage(); // { userCPUTime, systemCPUTime, maxRSS, sharedMemorySize, unsharedDataSize, unsharedStackSize, minorPageFault, majorPageFault, swappedOut, fsRead, fsWrite, ipcSent, ipcReceived, signalsCount, voluntaryContextSwitches, involuntaryContextSwitches, }
process.version; // nodejs version
process.versions; // versions of nodejs/deps // { node, v8, uv, zlib, brotli, ares, modules, nghttp2, napi, llhttp, openssl, cldr, icu, tz, unicode }

// stdin, stdout, stderr
// https://nodejs.org/docs/latest/api/process.html#process_process_stderr

// -----------
// -----------
// path
// -----------
// -----------

// root -- /
// dir -- /foo/bar/baz
// base -- name + ext
// name -- name
// ext -- ext

path.basename('/foo/bar/baz/asdf/quux.html'); // 'quux.html'
path.delimiter // $PATH delimiter (platform specific) // process.env.PATH.split(path.delimiter);
path.dirname('/foo/bar/baz/quux.js') // '/foo/bar/baz'
path.extname('index.js') // '.js'
path.join(__dirname, 'index.js') // join path segments together
path.normalize('/foo/bar/baz/..') // '/foo/bar' // resolve '.' and '..'
path.parse('/home/user/dir/index.js') // { root, dir, base, ext, name }
path.relative('foo/bar/baz/aaa', 'foo/bar/baz/bbb') // '../bbb' // relative path between two files
path.sep // path segment delimiter (platform specific) // 'foo/bar/baz'.split(path.sep);


// -----------
//
// -----------



// -----------
//
// -----------





// -----------
//
// -----------



// -----------
//
// -----------



// -----------
//
// -----------



// -----------
//
// -----------



// -----------
//
// -----------



// -----------
//
// -----------





// -----------
//
// -----------



// -----------
//
// -----------



// -----------
//
// -----------



// -----------
//
// -----------



// -----------
//
// -----------



// -----------
//
// -----------



