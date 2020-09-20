// ------------
// nodejs CLI
// ------------

// install
`
npm i --save \
    chalk \
    minimist \
    yargs \
    boxen \
    progress \
    clear \
    clui \
    figlet \
    inquirer
`

// ------------
// chalk
// ------------

// purpose
  // add colors & styles to console.log()

// text color
  // black, red, green, yellow, blue, magenta, cyan, white, 
  // blackBright, redBright, greenBright, yellowBright, blueBright, magentaBright, cyanBright, whiteBright,
// background color
  // bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, 
  // bgBlack, bgRedBright, bgGreenBright, bgYellowBright, bgBlueBright, bgMagentaBright, bgCyanBright, bgWhiteBright,
// text style
  // underline, bold, dim, italic, underline, strikethrough,


// import
const chalk = require('chalk');
// text to print
const text = "Hello world!";
// basic example
console.log(chalk.blue(text))

// chaining
chalk.blue.bgRed.bold(text)
// multiple arguments
chalk.cyanBright(text, text, text)
// custom colors (rgb, hex, keyword, hsl, hsv, hwb, ansi, ansi256)
chalk.rgb("100, 100, 255")(text); // rgb
chalk.hex('#5555ff')(text); // hex
chalk.keyword('blue'); // css keywords

// theming
const error = chalk.bold.red;
const warn = chalk.yellow;
const success = chalk.greenBright;
const info = chalk.cyan;
console.log(error('Invalid arguments!'))
console.log(warn('Using the "updateeach" method is deprecated, please use "updateEach"!'))
console.log(success('User was successfully saved!'))
console.log(info('5 + 5 = 10'))

// nest (override if specified multiple times)
chalk.blue(`Hello there, ${chalk.white.underline("Kakashi")}`);
// template literals
console.log(
  `CPU: ${chalk.red('90%')}`, 
  `RAM: ${chalk.green('40%')}`, 
  `DISK: ${chalk.yellow('70%')}`
);

// ------------
// minimist 
// ------------

// purpose
  // parse CLI command

// import
const minimist = require('minimist');
// get args
const argv = minimist(process.argv.slice(2));

// example 1
const command = `$ node example/parse.js -a beep -b boop`;
const argv = minimist(process.argv.slice(2)); 
const result = { 
  _: [], // no associated option
  a: 'beep', // option and value
  b: 'boop' 
};

// example 2
const command = `$ node example/parse.js -x 3 -y 4 -n5 -abc --beep=boop foo bar baz`;
const argv = minimist(process.argv.slice(2)); 
const result = { 
  _: [ 'foo', 'bar', 'baz' ], // no associated option
  x: 3, // option and argument (multi-character flag)
  y: 4,
  n: 5,
  a: true, // option (single-character flag) with no argument
  b: true,
  c: true,
  beep: 'boop' 
};

// ------------
// yargs
// ------------

// purpose
  // parse CLI command

// api docs
  // https://github.com/yargs/yargs/blob/HEAD/docs/api.md

// import
const yargs = require('yargs');

// usage
const argv = yargs.argv // get args
const argv = yargs.parse() // get args
const argv = yargs([ '-x', '1' ]).argv // get args + additional arg

// example 1
const command = `$ ./ plunder.js --ships=4 --distance=22`
const argv = yargs.parse();
const result = {
  ships: 4,
  distance: 22,
}

// ------------
// boxen
// ------------

// purpose
  // add boxes to console.log()

// import
const boxen = require('boxen');
// example
console.log(boxen('Hello world!', { padding: 1 }));

// options
  // borderColor -- black, red, green, yellow, blue, magenta, cyan, white, gray, #5555ff (hex)
  // borderStyle -- single, double, round, bold, singleDouble, doubleSingle, classic
  // padding -- 2 (number)
  // margin -- 2 (number)
  // backgroundColor -- black, red, green, yellow, blue, magenta, cyan, white, gray, #5555ff (hex)
  // align -- left (default), center, right

// ------------
// progress
// ------------

// purpose
  // progress bar in command line

// api docs
  // https://www.npmjs.com/package/progress

// example
  // https://www.npmjs.com/package/progress#examples

// basic example

// import
const ProgressBar = require('progress');
// instantiate
const bar = new ProgressBar(':bar', { total: 10 });
// change progress
const timer = setInterval(() => {
  bar.tick();
  if (bar.complete) {
    console.log('\n', 'Complete!', '\n')
    clearInterval(timer);
  }
}, 100);

// https example
  // downloading [=====             ] 39/bps 29% 3.7s

// imports
const ProgressBar = require('progress');
const https = require('https');
// server
const req = https.request({
  host: 'download.github.com',
  port: 443,
  path: '/visionmedia-node-jscoverage-0d4608a.zip'
});
// request
req.on('response', (res) => {
  // length of bar
  var len = parseInt(res.headers['content-length'], 10);
  console.log();
  // instantiate progress bar
  var bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: len
  });
  // chunk
  res.on('data', (chunk) => {
    bar.tick(chunk.length);
  });
  // complete
  res.on('end', () => {
    console.log('\n');
  });
});

req.end();


// ------------
// clear
// ------------

// purpose
  // clear terminal screen

// import
const clear = require('clear');
// clear
clear();

// ------------
// clear (alternative -- preserve history)
// ------------

// import
const readline = require('readline')
// clear
const blank = '\n'.repeat(process.stdout.rows)
console.log(blank)
readline.cursorTo(process.stdout, 0, 0)
readline.clearScreenDown(process.stdout)

// ------------
// clui
// ------------

// docs
  // https://www.npmjs.com/package/clui

// ------------
// figlet
// ------------

// purpose
  // cool text output

// import
const figlet = require('figlet');
// write in terminal
figlet.textSync('Hello!', {
  font: 'Standard',
  horizontalLayout: 'default', // "default", "full", "fitted", "controlled smushing", and "universal smushing"
  verticalLayout: 'default', // same as above
})

// importable fonts
// https://github.com/patorjk/figlet.js/tree/master/importable-fonts

// ------------
// inquirer
// ------------

// purpose
  // get user input easier

// docs
  // https://www.npmjs.com/package/inquirer

// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------


// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------


