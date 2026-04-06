// ---
// nodejs CLI
// ---

/*
npm i --save \
    chalk \
    minimist \
    boxen \
    progress \
    clear \
    figlet
*/

const chalk = require('chalk');
const minimist = require('minimist');
const boxen = require('boxen');
const ProgressBar = require('progress');
const https = require('https');
const clear = require('clear');
const readline = require('readline')
const figlet = require('figlet');

// ---
// chalk
// ---

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

// ---
// minimist 
// ---

// parses CLI command

const basicMinimist = () => {
  let argv, expected

  // get args passed from command line
  argv = minimist(process.argv.slice(2));

  // example 1
  argv = minimist('-a beep -b boop'); 
  expected = { 
    _: [], // no associated option
    a: 'beep', // option and value
    b: 'boop' 
  };

  console.log({ argv, expected })

  // example 2
  argv = minimist('-x 3 -y 4 -n5 -abc --beep=boop foo bar baz'); 
  expected = { 
    _: [ 'foo', 'bar', 'baz' ], // no associated option
    x: 3, // option and argument (multi-character flag)
    y: 4,
    n: 5,
    a: true, // option (single-character flag) with no argument
    b: true,
    c: true,
    beep: 'boop' 
  };

  console.log({ argv, expected })
}

// ---
// boxen
// ---

// adds boxes to console.log output

// example
console.log(boxen('Hello world!', { padding: 1 }));

// options
  // borderColor -- black, red, green, yellow, blue, magenta, cyan, white, gray, #5555ff (hex)
  // borderStyle -- single, double, round, bold, singleDouble, doubleSingle, classic
  // padding -- 2 (number)
  // margin -- 2 (number)
  // backgroundColor -- black, red, green, yellow, blue, magenta, cyan, white, gray, #5555ff (hex)
  // align -- left (default), center, right

// ---
// progress
// ---

// show progress bar in command line process

// api docs
  // https://www.npmjs.com/package/progress

// example
  // https://www.npmjs.com/package/progress#examples

const basicProgress = () => {
  // ---
  // basic example
  // ---

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

  // ---
  // https example
  // ---

  // downloading [=====             ] 39/bps 29% 3.7s

  // server
  const req = https.request({
    host: 'download.github.com',
    port: 443,
    path: '/visionmedia-node-jscoverage-0d4608a.zip'
  });
  // request
  req.on('response', (res) => {
    // length of bar
    const len = parseInt(res.headers['content-length'], 10);
    console.log();
    // instantiate progress bar
    const bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
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
}

// ---
// clear
// ---

// clears terminal screen

const basicClear = () => {
  // clear
  clear();

  // clear alternative (preserve history)
  const blank = '\n'.repeat(process.stdout.rows)
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}

// ---
// figlet
// ---

// cool text output

// importable fonts
// https://github.com/patorjk/figlet.js/tree/master/importable-fonts

const basicFiglet = () => {
  figlet.textSync('Hello!', {
    font: 'Standard',
    horizontalLayout: 'default', // "default", "full", "fitted", "controlled smushing", and "universal smushing"
    verticalLayout: 'default', // same as above
  })
}


