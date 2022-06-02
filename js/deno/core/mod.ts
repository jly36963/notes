

const basicDenoPropertiesAndMethods = async () => {
  // https://doc.deno.land/deno/stable/~/Deno
  const args = Deno.args // args passed to program.
  const build = Deno.build // build related info
  const env = Deno.env // methods: get, toObject, set, delete
  const mainModule = Deno.mainModule // url of entry point
  const permissions = Deno.permissions // methods: query, request, revoke
  const permissionStatus = await permissions.query({ name: 'env' })
  const pid = Deno.pid // current process id
  const version = Deno.version // version related info (deno, v8, typescript)

  const cwd = Deno.cwd() // Current working directory
  const execPath = Deno.execPath() // File path of deno executable

  console.log("args: ", args)
  console.log("build.arch: ", build.arch)
  console.log("env.get(HOME): ", env.get('HOME'))
  console.log("mainModule: ", mainModule)
  console.log("permissionStatus (env): ", permissionStatus)
  console.log("pid: ", pid)
  console.log("version: ", version)

  console.log('cwd: ', cwd)
  console.log('execPath: ', execPath)
}

const basicDenoSubprocess = async () => {
  const result = Deno.run({ 
    cmd: ['ls', '-a'],
    stdout: "piped",
    stderr: "piped"
  })
  // TODO: replace Deno.readAll (deprecated)
  const output = (new TextDecoder()).decode(await Deno.readAll(result.stdout))
  console.log('ls result: ', output)
}

const basicDenoFiles = async () => {
  // TODO: https://doc.deno.land/deno/stable/~/Deno

  // Temp directory
  const dir = './temp/'
  await Deno.mkdir(dir, { recursive: true })
  // File
  const filepath = './my-file-1.txt'
  const filepath2 = './my-file-2.txt'
  const filepath3 = './my-file-3.txt'
  // Data
  const data = "お前をずっと愛している"

  // ---
  // Encoder/Decoder
  // ---

  let bytes: Uint8Array, text: string

  // Create and write to file
  const encoder = new TextEncoder()
  bytes = encoder.encode(data)
  await Deno.writeFile(filepath, bytes)
  // Read from file 
  const decoder = new TextDecoder("utf-8")
  bytes = await Deno.readFile(filepath)
  text = decoder.decode(bytes)
  console.log('encoder/decoder result: ', text)

  // ---
  // Text file (read/write)
  // ---

  await Deno.writeTextFile(filepath, data)
  text = await Deno.readTextFile(filepath)
  console.log('writeTextFile/readTextFile result: ', text)

  // ---
  // File (read/write)
  // ---

  bytes = await Deno.readFile(filepath)
  console.log('readFile result (bytes): ', bytes)

  // ---
  // File descriptor
  // ---

  // Get file descriptor
  const file = await Deno.open(filepath, { read: true, write: true })
  // Read
  const buffer = new Uint8Array(50)
  await Deno.read(file.rid, buffer)
  text = new TextDecoder().decode(buffer)
  // Get file stats
  const stat = await file.stat()
  // Close file (probably should be in try/catch/finally)
  file.close()
  // Results
  console.log('file descriptor read result (decoded): ', text)
  console.log('file stat size: ', stat.size)

  // ---
  // mv, copy
  // ---

  await Deno.copyFile(filepath, filepath2)
  await Deno.rename(filepath, filepath3)

  // ---
  // Cleanup
  // ---

  await Deno.remove(filepath2)
  await Deno.remove(filepath3)
}

const basicDenoPermissions = async () => {
  // Create temp directory
  await Deno.mkdir('./temp', { recursive: true })
  // Create file
  const filepath = "./temp/my-file.txt"
  await Deno.create(filepath) // await Deno.writeFile(filepath, new Uint8Array())
  // Change permissions
  await Deno.chmod(filepath, 0o777) // Deno uses 0oXXX syntax for octals
  // Cleanup
  await Deno.remove(filepath);

  /*
  // chown
  const uid = await Deno.getUid() // unstable
  await Deno.chown(filepath, uid, null)
  */
}

// TODO: globals -- console, atob, btoa, fetch, setInterval, setTimeout, crypto, per


const printSectionTitle = (title: string) => {
  console.log("\n" + title.toUpperCase() + "\n")
}

const main = async () => {
  printSectionTitle('basic Deno properties/methods')
  await basicDenoPropertiesAndMethods()

  printSectionTitle('basic Deno subprocess')
  await basicDenoSubprocess()

  printSectionTitle('basic Deno files')
  await basicDenoFiles()

  printSectionTitle('basic deno permissions')
  await basicDenoPermissions()
}

main()
