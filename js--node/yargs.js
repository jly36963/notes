const yargs = require("yargs");
const { format } = require("date-fns");

// ---
// about
// ---

// http://yargs.js.org/
// https://www.npmjs.com/package/yargs
// https://github.com/yargs/yargs

// ---
// parse args
// ---

process.argv; // raw args as Array<string>
yargs.argv; // args as parsed object

// ---
// help
// ---

// node index.js -h

const year = format(new Date(), "yyyy");

yargs
  .usage("$0 <cmd> [args]")
  .example("$0 sum --numbers 1 2 3 4", "return sum of numbers")
  .help("h")
  .alias("h", "help")
  .epilog(`copyright ${year}`);

// ---
// add
// ---

// node index.js add --a 5 --b 6

yargs.command({
  command: "add",
  describe: "Add two numbers, a and b",
  builder: {
    a: {
      describe: "addend 1",
      demandOption: true,
      type: "number",
    },
    b: {
      describe: "addend 2",
      demandOption: true,
      type: "number",
    },
  },
  handler: (argv) => {
    const { a, b } = argv;
    if (isNaN(a) || isNaN(b)) {
      throw new Error("a and b must be numbers");
    }
    const sum = a + b;
    console.log("sum", sum);
  },
});

// ---
// sum
// ---

// node index.js sum --numbers 1 2 3 4

yargs.command({
  command: "sum",
  describe: "Get sum of numbers",
  builder: {
    numbers: {
      describe: "Numbers to be reduced to a sum",
      demandOption: true,
      type: "array",
    },
  },
  handler: (argv) => {
    const { numbers } = argv;
    if (numbers.find((n) => isNaN(n))) {
      throw new Error("All values in numbers array must be numbers");
    }
    const sum = (numbers || []).reduce((acc, cur) => acc + cur, 0);
    console.log("sum", sum);
  },
});

// ---
// parse
// ---

yargs.parse();
