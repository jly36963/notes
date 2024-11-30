import assert, {
	deepStrictEqual,
	doesNotMatch,
	doesNotReject,
	doesNotThrow,
	match,
	notDeepStrictEqual,
	notEqual,
	ok,
	rejects,
	strictEqual,
	throws,
} from "node:assert";
import { exec, spawn, spawnSync } from "node:child_process";
import {
	createCipheriv,
	createDecipheriv,
	createHash,
	createHmac,
	constants as cryptoConstants,
	generateKeyPairSync,
	privateDecrypt,
	publicEncrypt,
	randomBytes,
	randomFillSync,
	randomInt,
	randomUUID,
} from "node:crypto";
import {
	constants,
	type ReadStream,
	accessSync,
	createReadStream,
	mkdirSync,
	open,
	renameSync,
} from "node:fs";
import fsp from "node:fs/promises"; // require('fs').promises
import { createServer } from "node:http";
import {
	arch,
	cpus,
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
} from "node:os";
import {
	basename,
	delimiter,
	dirname,
	extname,
	join,
	normalize,
	parse,
	relative,
	resolve,
	sep,
} from "node:path";
import { promisify } from "node:util";
import util, { format, isDeepStrictEqual, types } from "node:util";
import zlib from "node:zlib";

/*
// fs promises can be imported using ESM modules (Node 13)
import { promises as fsp } from 'fs';
*/

const __dirname = import.meta.dirname;

// ---
// Main
// ---

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

// ---
// Utils
// ---

const printSectionTitle = (title: string) => {
	console.log(`\n${title.toUpperCase()}\n`);
};

// ---
// Examples
// ---

const basicAssert = async () => {
	// biome-ignore lint/suspicious/noSelfCompare: Example
	assert(5 === 5);
	deepStrictEqual([{ a: 1 }], [{ a: 1 }]); // assert equal (for objects: compare contents)
	doesNotMatch("foo", /bar/); // assert string does not match regExp
	await doesNotReject(
		async () => await Promise.resolve("Where's the leak, mam?"),
	);
	doesNotThrow(() => "East? I thought you said Weast!");
	// assert.fail() // explicitly fail test (use conditionally)
	match(
		"You focus on the trivial, and lose sight of what is most important. Change is impossible in this fog of ignorance.",
		/ignorance/,
	);
	notDeepStrictEqual({ a: 1 }, { b: 2 });
	notEqual({ a: 1 }, { a: 1 }); // Different references (with similar contents)
	ok("お前をずっと愛している"); // assert truthy
	await rejects(
		async () => await Promise.reject("You have it set to M for Mini"),
	);
	strictEqual(1, 1); // assert equal (for objects: must be same reference)
	throws(() => {
		throw new Error("Where's my drink -- my diet Dr Kelp?");
	});

	console.log("All assertions passed");
};

const basicBuffer = () => {
	// A fixed-size chunk of memory, allocated outside the V8 engine
	// Basically an array of hex (each representing a byte of data)
	// Buffer is a subclass of Uint8Array that's only available in node (not browser)

	// Blob
	// Immutable, raw data. Shareable across multiple worker threads. Potential performance gains
	// https://developer.mozilla.org/en-US/docs/Web/API/Blob

	let bytes: Buffer;
	// Buffer (pre-allocated)
	bytes = Buffer.alloc(1024); // 1KB buffer (initialized with 0s) (wipes the segment of memory)
	bytes = Buffer.allocUnsafe(1024); // 1KB buffer (uninitialized) (may contain old/sensitive data)
	bytes = Buffer.allocUnsafe(5).fill("a");
	bytes = Buffer.alloc(5);
	bytes.write("abcde");
	// Buffer from int[]
	bytes = Buffer.from([1, 2, 3]); // can also use hex numbers
	// Buffer from string
	const text =
		"In order to survive, we cling to all we know and understand. " +
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

const basicChildProcess = async () => {
	// spawn: no new shell, uses streams
	// exec: creates a new shell, returns output all at once

	{
		// exec (async)
		const execAsync = promisify(exec);
		const { stdout, stderr } = await execAsync("ls");
		if (stderr) throw new Error(stderr);
		console.log("promisify exec result:");
		console.log(stdout);
	}

	{
		// exec (async stream) (not sure if its actually a stream) (?)
		const { stdout, stderr } = exec("ls");
		const output = [];
		for await (const chunk of stdout!) {
			output.push(chunk);
		}
		const errorOutput = [];
		for await (const chunk of stderr!) {
			errorOutput.push(chunk);
		}
		console.log("stream exec result:");
		console.log(output.join());
	}

	{
		// spawn (async stream)
		const { stdout, stderr } = spawn("ls");
		const output = [];
		for await (const chunk of stdout) {
			output.push(chunk);
		}
		const errorOutput = [];
		for await (const chunk of stderr) {
			errorOutput.push(chunk);
		}

		console.log("stream spawn result:");
		console.log(output.join());
		console.log("stream spawn error:");
		console.log(errorOutput.join());
	}

	{
		// spawn (sync)
		const { stdout, stderr } = spawnSync("ls"); // Buffer
		if (stderr.byteLength) throw new Error(stderr.toString("utf8"));
		console.log("spawnSync result:");
		console.log(stdout.toString());
	}

	console.log("...");
};

// TODO: cluster
// https://nodejs.org/api/cluster.html

// TODO: CLI
// https://nodejs.org/api/cli.html

const basicCryptoRandom = async () => {
	const randomIntPromise = promisify(randomInt);

	const randomBytesResult = randomBytes(32).toString("base64");
	const randomFillSyncResult = randomFillSync(Buffer.alloc(32)).toString(
		"base64",
	);
	const randomIntResult = await randomIntPromise(100);
	const randomUUIDResult = randomUUID();

	console.log({
		randomBytesResult,
		randomFillSyncResult,
		randomIntResult,
		randomUUIDResult,
	});
};

const basicCrypto = () => {
	{
		// hash (md5)
		const message = "He's just standing there, menacingly";
		const hash = createHash("md5").update(message).digest("base64");
		console.log({ message, hash });
	}

	{
		// hash (sha-256)
		const message = "The pioneers used to ride these babies for miles";
		const hash = createHash("sha256").update(message).digest("base64");
		console.log("hash sha-256 digest (base64)");
		console.log({ message, hash });
	}

	{
		// hmac hash (sha-256)
		const message =
			"One embarrassing snapshot of SpongeBob at the Christmas party";
		const secret = "No one can know, not even Squidward's house";
		const hash = createHmac("sha256", secret).update(message).digest("base64");
		console.log("hmac (sha256) digest");
		console.log({ message, hash });
	}

	{
		// encrypt (aes-gcm)
		const message =
			"I have faith that there will come a time when people can truly understand one another";
		const key = Buffer.from(randomBytes(32), "utf-8");
		const iv = Buffer.from(randomBytes(12), "utf-8");
		const cipher = createCipheriv("aes-256-gcm", key, iv);
		const encrypted =
			cipher.update(message, "utf-8", "base64") + cipher.final("base64");
		const authTag = cipher.getAuthTag();

		const decipher = createDecipheriv("aes-256-gcm", key, iv);
		decipher.setAuthTag(authTag);
		const decrypted =
			decipher.update(encrypted, "base64", "utf-8") + decipher.final("utf-8");
		console.log("encrypted (aes-gcm)");
		console.log({ message, encrypted, decrypted });
	}

	{
		// encrypt (rsa)
		const message = "FINLAND!";
		const { RSA_PKCS1_OAEP_PADDING } = cryptoConstants;
		const { publicKey, privateKey } = generateKeyPairSync("rsa", {
			modulusLength: 2048,
		});
		const encrypted = publicEncrypt(
			{ key: publicKey, padding: RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
			Buffer.from(message),
		);

		const decrypted = privateDecrypt(
			{ key: privateKey, padding: RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
			encrypted,
		);
		console.log("decrypted (rsa oaep)");
		console.log({
			message,
			encrypted: encrypted.toString("base64"),
			decrypted: decrypted.toString("utf-8"),
		});
	}
};

// TODO:
// https://nodejs.org/api/errors.html
// https://nodejs.org/api/events.html
// https://nodejs.org/api/errors.html
// https://nodejs.org/api/globals.html
// https://nodejs.org/api/http.html

const basicFsFileDescriptors = async () => {
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

	// Set up
	const dir = "./temp";
	mkdirSync(dir, { recursive: true });
	const fp = "./temp/my-file.txt";
	await fsp.writeFile(fp, "");

	// fs.open
	let fd: fsp.FileHandle | undefined;
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

const basicFs = async () => {
	// fs/promises: promisified versions of fs methods
	// fsp api docs -- https://nodejs.org/docs/latest/api/fs.html#fs_fsp_access_path_mode
	// not all fs methods are supported by fs/promises

	// Set up
	const dir = "./temp";
	mkdirSync(dir, { recursive: true });
	const fp = "./temp/my-file.txt";
	const fp2 = "./temp/my-file-2.txt";
	const fp3 = "./temp/my-file-3.txt";
	await fsp.writeFile(fp, "");

	// fs.accessSync
	// Throws error if user does not have permissions to access
	accessSync(fp, constants.R_OK | constants.W_OK);

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
	renameSync(fp2, fp3);

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

	let stream: ReadStream;

	// handle data
	stream = createReadStream("myfile.txt");
	stream.on("data", (chunk) => console.log(chunk.toString())); // handle data

	// readable
	stream = createReadStream("myfile.txt");
	stream.on("readable", () => {
		console.log("ready to read");
		this.read();
	});

	// pipe (pipe to http server response)
	createServer((req, res) => {
		if (!req.url) {
			return;
		}
		const fn = join(__dirname, req.url); // get filename from request url
		const readStream = createReadStream(fn);
		readStream.on("open", () => stream.pipe(res)); // pipe stream to response;
		readStream.on("error", (err: Error) => console.log(err.message));
	});

	// TODO:  fs.end
	// TODO: fs.createWriteStream
};

// TODO: modules
// cjs
// https://nodejs.org/api/modules.html
// esm
// https://nodejs.org/api/esm.html
// packages
// https://nodejs.org/api/packages.html

const basicOs = () => {
	const archResult = arch(); // x64
	const cpusResult = cpus(); // list of objects describing each logical CPU core -- [ { model, speed, times } ]
	const freememResult = freemem(); // free memory in bytes (integer)
	const homedirResult = homedir(); // path of current user's home directory. (POSIX -- $HOME env var) ( Windows -- USERPROFILE env var)
	const hostnameResult = hostname(); // host name of OS as a string
	const platformResult = platform(); // operating system platform (darwin, linux, win32, etc)
	const releaseResult = release(); // version of OS as string (POSIX -- uname(3)) (Windows -- GetVersionExW())
	const tmpdirResult = tmpdir(); // OS default directory for temporary files
	const totalmemResult = totalmem(); // total system memory in bytes (integer)
	const typeResult = type(); // OS name (uname(3)) (Linux, Darwin, Windows_NT)
	const userInfoResult = userInfo(); // return info about user (from password file) (uid, gid, username, homedir, shell)
	const versionResult = version(); // kernel version

	console.log({
		archResult,
		cpusResult,
		freememResult,
		homedirResult,
		hostnameResult,
		platformResult,
		releaseResult,
		tmpdirResult,
		totalmemResult,
		typeResult,
		userInfoResult,
		versionResult,
	});
};

// stdin, stdout, stderr
// https://nodejs.org/docs/latest/api/process.html#process_process_stderr

const _basicPromisify = () => {
	// Converts function with callback (err, data) into a func that returns a promise
	const _open = promisify(open);
};

const basicPath = () => {
	const basenameResult = basename("/foo/bar/baz/asdf/quux.html"); // 'quux.html'
	const delimiterResult = delimiter; // $PATH delimiter (platform specific) // process.env.PATH.split(path.delimiter);
	const dirnameResult = dirname("/foo/bar/baz/quux.js"); // '/foo/bar/baz'
	const extnameResult = extname("index.js"); // '.js'
	const joinResult = join(__dirname, "index.js"); // join path segments together
	const normalizeResult = normalize("/foo/bar/baz/.."); // '/foo/bar' // resolve '.' and '..'
	const parseResult = parse("/home/user/dir/index.js"); // { root, dir, base, ext, name }
	const relativeResult = relative("foo/bar/baz/aaa", "foo/bar/baz/bbb"); // '../bbb' // relative path between two files
	const sepResult = sep; // path segment delimiter (platform specific) // 'foo/bar/baz'.split(path.sep);
	const resolveResult = resolve("."); // rel -> abs

	console.log({
		basenameResult,
		delimiterResult,
		dirnameResult,
		extnameResult,
		joinResult,
		normalizeResult,
		parseResult,
		relativeResult,
		sepResult,
		resolveResult,
	});
};

const basicStreams = async () => {
	// https://nodejs.dev/learn/nodejs-streams

	// Similar to Buffer, but the data is handled piece by piece (instead of all at once)
	// Advantages: memory efficiency (less loaded in to memory). time efficiency (process before receiving all data)
	// An http server can pipe a stream to the client -- stream.pipe(res)
	// The point is to handle the data in smaller chunks, rather than waiting to load all the data at once
	// Types: Readable, Writeable, Duplex, Transform

	// Set up
	const dir = "./temp";
	mkdirSync(dir, { recursive: true });
	const fp = "./temp/my-file.txt";
	const contents =
		"It'll quench ya. Nothing is quenchier. It's the quenchiest! ".repeat(100);
	await fsp.writeFile(fp, contents);
	// Stream
	const stream = createReadStream(fp);
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

// Test runner
// https://nodejs.org/api/test.html

// url
// https://nodejs.org/api/url.html

// util
// https://nodejs.org/api/util.html
const basicUtil = () => {
	const formatResult = format("Hello %s", "world");
	const isDeepStrictEqualResult = isDeepStrictEqual({ a: 1 }, { a: 1 });
	// const parseArgsResult = util.parseArgs(["cmd1, 1, 2, --verbose"]);

	console.log({
		formatResult,
		isDeepStrictEqualResult,
		// parseArgsResult,
	});
};

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
	} = types;
	// Check type
	assert(isAsyncFunction(async () => await Promise.resolve(5)));
	assert(isDate(new Date()));
	assert(
		isGeneratorFunction(function* () {
			yield 5;
		}),
	);
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

const basicUtilTextEncoding = () => {
	const { TextEncoder, TextDecoder } = util;

	const message =
		"I have faith that there will come a time when people can truly understand one another";
	const bytes = new TextEncoder().encode(message);
	const decoded = new TextDecoder("utf-8").decode(bytes);

	console.log({ message, bytes, decoded });
};

// workers
// https://nodejs.org/api/worker_threads.html

const basicZlib = async () => {
	let message: string;
	let bytes: Buffer;
	let compressedBytes: Buffer;
	let base64Encoded: string;

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
// Run
// ---

main();
