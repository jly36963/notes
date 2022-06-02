import {
  // archive
  Tar,
  Untar,
  // async
  delay,
  abortable,
  debounce,
  deadline,
  // bytes
  concat,
  repeat,
  startsWith,
  endsWith,
  // crypto
  crypto,
  // datetime
  parse,
  format,
  dayOfYear,
  difference,
  // dotenv
  config,
  // encoding
  encode,
  decode,
  he,
  // ensure
  ensureFile,
  ensureDir,
  // fmt
  sprintf,
  // io
  Buffer,
  readLines,
  // log
  log,
  // path
  posix,
  // streams
  copy,
  readAll,
  // uuid
  v4,
} from './deps.ts'

const basicAsync = async () => {
  // abortable
  try {
    const p = delay(1000)
    const c = new AbortController()
    setTimeout(() => c.abort(), 10)
    await abortable(p, c.signal)
  } catch (err) {
    console.log('promise aborted: ')
    console.log(err)
  }

  // debounce
  const debouncedLog = debounce(v => console.log(v), 100)
  console.log('debounce result: ')
  ;(['a', 'b', 'c'] as string[]).forEach(v => debouncedLog(v)) // Take latest (c)

  // delay
  await delay(100) // async sleep

  // deadline
  try {
    const p = delay(100)
    await deadline(p, 10)
  } catch (err) {
    console.log('promise deadline reached: ')
    console.log(err)
  }

  // TODO: deferred, MuxAsyncIterator, pooledMap, tee
}

const basicArchive = async () => {
  // Temp directory
  const dir = './temp/'
  await Deno.mkdir(dir, { recursive: true })
  // File
  const input = './temp/my-file.txt'
  const output = './temp/out.tar'
  // Tar
  const tar = new Tar()
  const content = new TextEncoder().encode("Is mayonaise an instrument?")
  await tar.append(input, {
    reader: new Buffer(content),
    contentSize: content.byteLength
  })
  // Write
  const writer = await Deno.open(output, { write: true, create: true })
  await copy(tar.getReader(), writer)
  writer.close()
  // Untar
  const reader = await Deno.open(output, { read: true, })
  const untar = new Untar(reader)
  for await (const entry of untar) {
    if (entry.type === "directory") {
      await ensureDir(entry.fileName);
      continue;
    }

    await ensureFile(entry.fileName);
    const file = await Deno.open(entry.fileName, { write: true });
    await copy(entry, file); // entry implements Reader
  }
  reader.close()
  // Read
  const text = await Deno.readTextFile(input)
  console.log('read result: ', text)
  // Cleanup
  await Deno.remove(input)
  await Deno.remove(output)
}

const basicBytes = () => {
  const te = (s: string): Uint8Array => new TextEncoder().encode(s)
  const td = (bytes: Uint8Array): string => new TextDecoder('utf-8').decode(bytes)

  const concatenated = td(concat(te('Hello'), te(' friend')))
  const repeated = td(repeat(te('foo'), 2))
  const startsWithPrefix = startsWith(new Uint8Array(5), new Uint8Array(2))
  const endsWithSuffix = endsWith(new Uint8Array(5), new Uint8Array(2))

  console.log('concatenated: ', concatenated)
  console.log('repeated: ', repeated)
  console.log('startsWithPrefix: ', startsWithPrefix)
  console.log('endsWithSuffix: ', endsWithSuffix)
}

// TODO: collections (like lodash)
// https://deno.land/std@0.140.0/collections

const basicCrypto = async () => {
  const message = "No one can know, not even Squidward's house"
  const messageBytes = new TextEncoder().encode(message)
  const hashedBytes = new Uint8Array(
    await crypto.subtle.digest(
      "SHA-256",
      messageBytes,
    ),
  )
  const hashedStringUtf8 = new TextDecoder("utf-8").decode(hashedBytes)
  const hashedStringBase64 = encode(hashedBytes)
  console.log("message: ", message)
  console.log("messageBytes: ", messageBytes)
  console.log("hashedBytes: ", hashedBytes)
  console.log("hashedStringUtf8: ", hashedStringUtf8)
  console.log("hashedStringBase64: ", hashedStringBase64)

  // TODO: hmac
}

const basicCryptoAes = async () => {
  // Message
  const message = "You focus on the trivial, and lose sight of what is most important. Change is impossible in this fog of ignorance."
  const messageBytes = new TextEncoder().encode(message)

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
  const iv = await crypto.getRandomValues(new Uint8Array(16)) // 12 or 16
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, // AesGcmParams, AesCbcParams
    importedKey,
    messageBytes
  )
  const encryptedBytes = new Uint8Array(encryptedBuffer)

  // Decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    importedKey,
    encryptedBytes
  )
  const decryptedBytes = new Uint8Array(decryptedBuffer)
  const decryptedMessage = new TextDecoder().decode(decryptedBytes)

  // Result
  console.log('message: ', message)
  console.log('messageBytes: ', messageBytes)
  console.log('encryptedBytes: ', encryptedBytes)
  console.log('decryptedBytes: ', decryptedBytes)
  console.log('decryptedMessage: ', decryptedMessage)
}

const basicCryptoRsa = async () => {
  // Message
  const message = "The owner of the white sedan, you left your lights on"
  const messageBytes = new TextEncoder().encode(message)

  // Get key pair
  const keyPair = await crypto.subtle.generateKey({
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-512",
  }, true, ["encrypt", "decrypt"])

  // Keys: public: encryption, private: decryption
  const { publicKey, privateKey } = keyPair

  // Encrypt
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "RSA-OAEP", },
    publicKey,
    messageBytes
  )
  const encryptedBytes = new Uint8Array(encryptedBuffer)

  // Decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "RSA-OAEP", },
    privateKey,
    encryptedBuffer
  )
  const decryptedBytes = new Uint8Array(decryptedBuffer)
  const decryptedMessage = new TextDecoder().decode(decryptedBytes)

  // Result
  console.log('message: ', message)
  console.log('messageBytes: ', messageBytes)
  console.log('encryptedBytes: ', encryptedBytes)
  console.log('decryptedBytes: ', decryptedBytes)
  console.log('decryptedMessage: ', decryptedMessage)
}

const basicDatetime = () => {
  const now = new Date()
  const formatted = format(now, 'yyyy-MM-dd')
  const doy = dayOfYear(now)
  const parsed = parse('2022-05-25', 'yyyy-MM-dd')
  const diff = difference(now, new Date())

  console.log('now: ', now)
  console.log('formatted: ', formatted)
  console.log('doy: ', doy)
  console.log('parsed: ', parsed)
  console.log('diff.milliseconds: ', diff.milliseconds)
}

const basicDotenv = async () => {
  const env = await config({ path: './dev.env' })
  console.log('env', env)
}

const basicEncodingBase64 = () => {
  const message = "Where's the leak, mam?"
  const messageBytesUtf8 = new TextEncoder().encode(message)
  const messageStringBase64 = encode(message)
  const messageBytesBase64 = decode(messageStringBase64)

  console.log('message: ', message)
  console.log('messageBytesUtf8: ', messageBytesUtf8)
  console.log('messageBytesBase64: ', messageBytesBase64)
  console.log('messageStringBase64: ', messageStringBase64)

  // TODO: encoding -- csv, jsonc, toml, yaml
}

// TODO: flags

const basicFmt = () => {
  const formatted = sprintf("Hey there, %s", "Kakashi")
  console.log("formatted: ", formatted)
}

// TODO: fs (ensureDir)

const basicIo = async () => {
  const td = (bytes: Uint8Array): string => new TextDecoder('utf-8').decode(bytes)

  // Open file
  const fileReader = await Deno.open('./deps.ts')

  // Read lines (async iterator)
  let text = ''
  for await (const line of readLines(fileReader)) {
    text += (line + '\n')
  }

  // MD5 hash of text contents
  const hashedText = td(he(new Uint8Array(
    await crypto.subtle.digest(
      "MD5",
      new TextEncoder().encode(text),
    ),
  )))

  // Result
  console.log('hashedText', hashedText)
}

const basicLog = async () => {
  const logFilename = './log.txt'
  // Set up loggers
  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG", { formatter: "{loggerName}:{levelName}:{msg}" }),
      file: new log.handlers.FileHandler("DEBUG", { filename: logFilename })
    },
    loggers: {
      default: { level: "INFO", handlers: ["console", "file"] },
      tasks: { level: "INFO", handlers: ["console"] },
    }
  })
  // Use default logger
  log.debug("Something happened");
  log.info("Something more important happened");
  log.warning("Something bad might happen");
  log.error("Something bad happened");
  log.critical("An unrecoverable error happened");
  // Use custom logger
  const tasksLogger = log.getLogger("tasks")
  tasksLogger.debug("Something happened");
  tasksLogger.info("Something more important happened");
  tasksLogger.warning("Something bad might happen");
  tasksLogger.error("Something bad happened");
  tasksLogger.critical("An unrecoverable error happened");
  // Read file logs
  const text = await Deno.readTextFile(logFilename)
  console.log('log file read result')
  console.log(text)
  // Cleanup
  await Deno.remove(logFilename)
}

const basicPath = () => {
  const filepath = './temp/my-file.txt'
  const basename = posix.basename(filepath) // my-file.txt
  const dirname = posix.dirname(filepath) // ./temp
  const extname = posix.extname(filepath) // .txt
  const isAbsolute = posix.isAbsolute(filepath) // false
  const joined = posix.join('.', 'temp', 'my-file.txt')
  const normalized = posix.normalize('./temp/../temp/')
  const parsed = posix.parse(filepath) // { root, dir, base, ext, name }

  console.log('basename: ', basename)
  console.log('dirname: ', dirname)
  console.log('extname: ', extname)
  console.log('isAbsolute: ', isAbsolute)
  console.log('joined: ', joined)
  console.log('normalized: ', normalized)
  console.log('parsed: ', parsed)

  // TODO: format, relative, resolve, common
}

const basicStreams = async () => {
  const result = Deno.run({
    cmd: ['ls', '-a'],
    stdout: "piped",
    stderr: "piped"
  })
  const output = (new TextDecoder()).decode(await readAll(result.stdout))
  const error = (new TextDecoder()).decode(await readAll(result.stderr))
  console.log('ls output: ', output)
  console.log('ls error: ', error)
}

const basicUuid = () => {
  const id = crypto.randomUUID()
  const isValid = v4.validate(id)
  console.log('id: ', id)
  console.log('isValid: ', isValid)
}

const printSectionTitle = (title: string) => {
  console.log("\n" + title.toUpperCase() + "\n")
}

const main = async () => {
  printSectionTitle('basic async')
  await basicAsync()

  printSectionTitle('basic archive')
  await basicArchive()

  printSectionTitle('basic bytes')
  await basicBytes()

  printSectionTitle('basic crypto')
  await basicCrypto()

  printSectionTitle('basic crypto (aes)')
  await basicCryptoAes()

  printSectionTitle('basic crypto (rsa)')
  await basicCryptoRsa()

  printSectionTitle('basic datetime')
  basicDatetime()

  printSectionTitle('basic encoding (base64)')
  basicEncodingBase64()

  printSectionTitle('basic dotenv')
  await basicDotenv()

  printSectionTitle('basic fmt')
  basicFmt()

  printSectionTitle('basic io')
  await basicIo()

  printSectionTitle('basic log')
  await basicLog()

  printSectionTitle('basic path')
  basicPath()

  printSectionTitle('basic streams')
  await basicStreams()

  printSectionTitle('basic uuid')
  basicUuid()
}

main()
