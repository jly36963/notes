import { Command } from "commander";

// TODO: better type safety

// ---
// Main
// ---

async function main() {
  printSectionTitle("basic greet (positional)");
  basicGreetPositional();

  printSectionTitle("basic greet (option)");
  basicGreetOption();

  printSectionTitle("basic greet (async)");
  await basicGreetAsync();

  printSectionTitle("basic subcommands");
  basicSubcommands();
}

// ---
// Utils
// ---

function printSectionTitle(title: string) {
  console.log("\n" + title.toUpperCase() + "\n");
}

// ---
// Examples
// ---

function basicGreetPositional() {
  const program = new Command();

  program
    .name("basic-greet-positional")
    .description("Basic example of greet with positional")
    .version("1.0.0");

  program
    .command("greet", { isDefault: true })
    .description("greet command description")
    .argument("[name]", "name desc", "friend")
    .action((name, options, command) => {
      console.log(`Hello ${name}`);
    });

  program.parse(["Kakashi"], { from: "user" });
}

function basicGreetOption() {
  const program = new Command();

  program
    .name("basic-greet-with-option")
    .description("Basic example of greet with option")
    .version("1.0.0");

  program
    .command("greet", { isDefault: true })
    .description("greet command description")
    .argument("[name]", "name desc", "friend")
    .option("-i --informal", "informal desc", false)
    .action((name, options, command) => {
      const { informal } = options;
      const greeting = informal ? `Hey there, ${name}!` : `Hello ${name}`;
      console.log(greeting);
    });

  program.parse(["Kakashi", "--informal"], { from: "user" });
}

async function basicGreetAsync() {
  const program = new Command();

  program
    .name("basic-greet-positional-async")
    .description("Basic example of greet with async handler")
    .version("1.0.0");

  program
    .command("greet", { isDefault: true })
    .description("greet command description")
    .argument("[name]", "name desc", "friend")
    .action(async (name, options, command) => {
      await new Promise((r) => setTimeout(r, 500));
      console.log(`Hello ${name}`);
    });

  await program.parseAsync(["Kakashi"], { from: "user" });
}

function basicSubcommands() {
  const program = new Command();

  program
    .name("basic-math-with-subcommands")
    .description("Basic example of math program with subcommands")
    .version("1.0.0");

  const mathCommand = program
    .command("math")
    .description("math command description");

  mathCommand
    .command("add")
    .description("add command description")
    .argument("<a>", "a desc", parseInt)
    .argument("<b>", "b desc", parseInt)
    .action((a, b, options, command) => {
      console.log(`${a} + ${b} = ${a + b}`);
    });

  mathCommand
    .command("sub")
    .description("sub command description")
    .argument("<a>", "a desc", parseInt)
    .argument("<b>", "b desc", parseInt)
    .action((a, b, options, command) => {
      console.log(`${a} - ${b} = ${a - b}`);
    });

  mathCommand
    .command("mul")
    .description("mul command description")
    .argument("<a>", "a desc", parseInt)
    .argument("<b>", "b desc", parseInt)
    .action((a, b, options, command) => {
      console.log(`${a} * ${b} = ${a * b}`);
    });

  mathCommand
    .command("div")
    .description("div command description")
    .argument("<a>", "a desc", parseInt)
    .argument("<b>", "b desc", parseInt)
    .action((a, b, options, command) => {
      console.log(`${a} / ${b} = ${a / b}`);
    });

  mathCommand
    .command("sum")
    .description("sum command description")
    .argument("<nums...>", "nums desc") // "nums desc", parseInt
    .action((nums: string[], options, command) => {
      const parsedNums = nums.map((num) => parseInt(num));
      const result = parsedNums.reduce(
        (acc: number, curr: number) => acc + curr,
        0
      );
      console.log(`The sum of ${nums} is ${result}`);
    });

  const inputs = [
    ["math", "add", "1", "2"],
    ["math", "sub", "1", "2"],
    ["math", "mul", "1", "2"],
    ["math", "div", "1", "2"],
    ["math", "sum", "1", "2", "3"],
  ];
  for (const input of inputs) {
    program.parse(input, { from: "user" });
  }
}

// ---
// Run
// ---

main();
