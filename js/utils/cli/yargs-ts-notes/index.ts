import yargs from "yargs";

function basicGreetPositional() {
  yargs("Kakashi")
    .command(
      "$0 [name]", // $0 denotes default command
      "default command description",
      (yargs) =>
        yargs.positional("name", {
          desc: "name desc",
          type: "string",
          default: "friend",
        }),
      (argv) => {
        const { name } = argv;
        console.log(`Hello ${name}`);
      }
    )
    .parse();
}

function basicGreetOption() {
  yargs("Kakashi -i")
    .command(
      "$0 [name]",
      "default command description",
      (yargs) =>
        yargs
          .positional("name", {
            desc: "name desc",
            type: "string",
            default: "friend",
          })
          .option("informal", {
            desc: "informal desc",
            type: "boolean",
            default: false,
            alias: "i",
          }),
      (argv) => {
        const { name, informal } = argv;
        const greeting = informal ? `Hey there, ${name}!` : `Hello ${name}`;
        console.log(greeting);
      }
    )
    .parse();
}

async function basicGreetAsync() {
  await yargs("Kakashi")
    .command(
      "$0 [name]",
      "default command description",
      (yargs) =>
        yargs.positional("name", {
          desc: "name desc",
          type: "string",
          default: "friend",
        }),
      async (argv) => {
        const { name } = argv;
        await new Promise((r) => setTimeout(r, 500));
        console.log(`Hello ${name}`);
      }
    )
    .parseAsync();
}

function basicSubcommands() {
  const program = yargs()
    .command(
      "math",
      "math desc",
      (yargs) =>
        yargs
          .command(
            "add <a> <b>",
            "add desc",
            (yargs) =>
              yargs
                .positional("a", {
                  desc: "a desc",
                  type: "number",
                })
                .positional("b", {
                  desc: "a desc",
                  type: "number",
                }),
            (argv) => {
              const { a, b } = argv as { a: number; b: number };
              console.log(`${a} + ${b} = ${a + b}`);
            }
          )
          .command(
            "sub <a> <b>",
            "sub desc",
            (yargs) =>
              yargs
                .positional("a", {
                  desc: "a desc",
                  type: "number",
                })
                .positional("b", {
                  desc: "b desc",
                  type: "number",
                }),
            (argv) => {
              const { a, b } = argv as { a: number; b: number };
              console.log(`${a} - ${b} = ${a - b}`);
            }
          )
          .command(
            "mul <a> <b>",
            "mul desc",
            (yargs) =>
              yargs
                .positional("a", {
                  desc: "a desc",
                  type: "number",
                })
                .positional("b", {
                  desc: "b desc",
                  type: "number",
                }),
            (argv) => {
              const { a, b } = argv as { a: number; b: number };
              console.log(`${a} * ${b} = ${a * b}`);
            }
          )
          .command(
            "div <a> <b>",
            "div desc",
            (yargs) =>
              yargs
                .positional("a", {
                  desc: "a desc",
                  type: "number",
                })
                .positional("b", {
                  desc: "b desc",
                  type: "number",
                }),
            (argv) => {
              const { a, b } = argv as { a: number; b: number };
              console.log(`${a} / ${b} = ${a / b}`);
            }
          )
          .command(
            "sum <nums..>",
            "sum desc",
            (yargs) =>
              yargs.positional("nums", {
                desc: "nums desc",
              }),
            (argv) => {
              const { nums = [] } = argv as { nums: number[] };
              const result = nums.reduce((acc, curr) => acc + curr, 0);
              console.log(`The sum of ${nums} is ${result}`);
            }
          ),
      (_argv) => console.log("Please choose a subcommand")
    )
    .strict();

  const inputs = [
    "math add 1 2",
    "math sub 1 2",
    "math mul 1 2",
    "math div 1 2",
    "math sum 1 2 3",
  ];
  for (const input of inputs) {
    program.parse(input);
  }
}

// ---
// Main
// ---

function printSectionTitle(title: string) {
  console.log("\n" + title.toUpperCase() + "\n");
}

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

main();
