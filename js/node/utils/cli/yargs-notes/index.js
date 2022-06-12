import yargs from "yargs";

// Use program input: yargs(argv.slice(2))
// Commmand: name, desc, builder, handler

const basicGreetPositional = () => {
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
      },
    )
    .parse();
};

const basicGreetOption = () => {
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
      },
    )
    .parse();
};

const basicGreetAsync = async () => {
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
      },
    )
    .parseAsync();
};

const basicSubcommands = () => {
  const program = yargs().command(
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
                required: true,
              })
              .positional("a", {
                desc: "a desc",
                type: "number",
                required: true,
              }),
          (argv) => {
            const { a, b } = argv;
            console.log(`${a} + ${b} = ${a + b}`);
          },
        )
        .command(
          "sub <a> <b>",
          "sub desc",
          (yargs) =>
            yargs
              .positional("a", {
                desc: "a desc",
                type: "number",
                required: true,
              })
              .positional("b", {
                desc: "b desc",
                type: "number",
                required: true,
              }),
          (argv) => {
            const { a, b } = argv;
            console.log(`${a} - ${b} = ${a - b}`);
          },
        )
        .command(
          "mul <a> <b>",
          "mul desc",
          (yargs) =>
            yargs
              .positional("a", {
                desc: "a desc",
                type: "number",
                required: true,
              })
              .positional("b", {
                desc: "b desc",
                type: "number",
                required: true,
              }),
          (argv) => {
            const { a, b } = argv;
            console.log(`${a} * ${b} = ${a * b}`);
          },
        )
        .command(
          "div <a> <b>",
          "div desc",
          (yargs) =>
            yargs
              .positional("a", {
                desc: "a desc",
                type: "number",
                required: true,
              })
              .positional("b", {
                desc: "b desc",
                type: "number",
                required: true,
              }),
          (argv) => {
            const { a, b } = argv;
            console.log(`${a} / ${b} = ${a / b}`);
          },
        )
        .command(
          "sum <nums..>",
          "sum desc",
          (yargs) =>
            yargs
              .positional("nums", {
                desc: "nums desc",
                type: "array",
                required: true,
              }),
          (argv) => {
            const { nums } = argv;
            const result = nums.reduce((acc, curr) => acc + curr, 0);
            console.log(`The sum of ${nums} is ${result}`);
          },
        ),
    (_argv) => console.log("Please choose a subcommand"),
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
};

// ---
// Main
// ---

const printSectionTitle = (title) => {
  console.log("\n" + title.toUpperCase() + "\n");
};

const main = async () => {
  printSectionTitle("basic greet (positional)");
  basicGreetPositional();

  printSectionTitle("basic greet (option)");
  basicGreetOption();

  printSectionTitle("basic greet (async)");
  await basicGreetAsync();

  printSectionTitle("basic subcommands");
  basicSubcommands();
};

main();
