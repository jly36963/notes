// ---
// module
// ---

const basicModule = () => {
  __dirname // directory name of current module
  __filename // file name of current module (absolute path with symlinks resolved),
  require // import from one of: node_modules, path relative to __dirname, path relative to cmd
  module.exports = new Date(); // export an object / class instance
  module.exports = { a: 1, b: 2, c: 3 }; // export an object with properties
}

// ---
// dev/prod
// ---

// NODE_ENV=production

// This tells node to optimize for performance
// Many libraries will behave differently in prod as well

// ---
// Timers
// ---

const basicTimers = async () => {
  // Each timer function returns an object that repesents the scheduled timer
  const immediate = setImmediate(() => console.log('immediate')); // call function at end of this nodejs event loop;
  const interval = setInterval(() => console.log('interval'), 100); // call function every 'n' ms
  const timeout = setTimeout(() => console.log('timeout'), 100); // call function in 'n' ms

  // Sleep
  await new Promise(r => setTimeout(r, 250));

  // Clear timers (prevent memory leaks)
  clearImmediate(immediate);
  clearInterval(interval);
  clearTimeout(timeout);
}

// ---
// process
// ---

const basicProcess = () => {
  const arch = process.arch; // 'x64' // OS CPU architecture for which the nodejs binary was compiled
  const argv = process.argv;
  const argv0 = process.argv0;
  const chdir = process.chdir(__dirname) // change cwd of process
  const cwd = process.cwd(); // current working directory
  const nodeEnv = process.env.NODE_ENV; // specific env var value
  // process.exit(0); // 0 -- success, 1 -- failure // exit codes -- https://nodejs.org/docs/latest/api/process.html#process_exit_codes
  // process.kill(pid, signal); // signals -- SIGTERM (default), SIGINT, SIGNUP, 0 (tests existence), etc 
  const memoryUsage = process.memoryUsage(); // { rss, heapTotal, heapUsed, external, arrayBuffers }
  const pid = process.pid // pid of nodejs process
  const platform = process.platform; // OS platform on which nodejs process is running (darwin, linux, win32, etc)
  const ppid = process.ppid // pid of parent process
  const resourceUsage = process.resourceUsage(); // { userCPUTime, systemCPUTime, maxRSS, sharedMemorySize, unsharedDataSize, unsharedStackSize, minorPageFault, majorPageFault, swappedOut, fsRead, fsWrite, ipcSent, ipcReceived, signalsCount, voluntaryContextSwitches, involuntaryContextSwitches, }
  const version = process.version; // nodejs version
  const versions = process.versions; // versions of nodejs/deps // { node, v8, uv, zlib, brotli, ares, modules, nghttp2, napi, llhttp, openssl, cldr, icu, tz, unicode }

  console.log({
    arch,
    argv,
    argv0,
    chdir,
    cwd,
    nodeEnv,
    memoryUsage,
    pid,
    platform,
    ppid,
    resourceUsage,
    version,
    versions,
  })
}

const printSectionTitle = (title) => {
  console.log("\n" + title.toUpperCase() + "\n")
}

const main = async () => {
  printSectionTitle('basic timers')
  await basicTimers()

  printSectionTitle('basic process')
  basicProcess()


}

main()