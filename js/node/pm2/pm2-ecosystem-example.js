// --------------
// ecosystem.config.js (custom)
// --------------

// https://pm2.keymetrics.io/docs/usage/application-declaration/

// imports
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const env = dotenv.parse(fs.readFileSync(path.join(curDir, '.env')));

// apps
const apps = [];

// app -- api1
if (env.PM2_USE_API1) {
  apps.push({
    name: 'api1', // app name
    script: path.join(__dirname, 'api1', 'index.js'), // script path relative to pm2 start
    cwd: path.join(__dirname, 'api1'), // directory from which the app will be launched
    args: '-a arguments -b here', // args to pass to app
    interpreter_args: '--inspect=9400', // options to pass to interpreter (also 'node_args')
    watch: true, // watch files and restart on changes (can be an array of dirs/files to watch)
    ignore_watch: ['node_modules'], // don't watch these
    watch_delay: 500,
    env,
  })
}

// app -- api2
if (env.PM2_USE_API2) {
  apps.push({
    name: 'api2',
    script: path.join(__dirname, 'api2', 'index.js'),
    cwd: path.join(__dirname, 'api2'),
    args: '-a arguments -b here',
    interpreter_args: '--inspect=9400',
    watch: true,
    ignore_watch: ['node_modules'],
    watch_delay: 500,
    env,
  })
}

// other useful options
const otherUsefulOptions = {
  // logging
  error_file: 'err.log', // path to output error 
  out_file: 'out.log', // path to output out
  log_file: 'combined.log', // path to output both error & out
  // restart
  exp_backoff_restart_delay: 100, // exponential delay on restart (ms)
  restart_delay: 3000 // fixed restart delay (ms)
}

module.exports = {
  apps,
}
