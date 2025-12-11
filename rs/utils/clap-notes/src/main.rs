use clap::{Arg, Command, Parser};

fn main() {
    print_section_header(String::from("basic derive"));
    basic_derive();

    print_section_header(String::from("basic builder"));
    basic_builder();

    print_section_header(String::from("basic builder (subcommands)"));
    basic_builder_subcommands();
}

// ---
// Derive
// ---

// Derive requires "derive" feature

// This example uses "parse_from" instead of "parse"
// "parse_from" uses arbitrary arguments
// "parse" will use the args passed to this program

/// Basic greet example (derive)
fn basic_derive() {
    /// Simple program to greet a person
    #[derive(Parser, Debug)]
    #[clap(author, version, about, long_about = None)]
    struct App {
        /// Name of the person to greet
        #[clap(short, long, default_value = "friend")]
        name: String,
        /// Number of times to greet
        #[clap(short, long, default_value_t = 1)]
        count: u8,
    }
    // Handler logic
    let args = App::parse_from(["program", "-n", "Kakashi", "-c", "2"]);
    for _ in 0..args.count {
        println!("Hello {}!", args.name)
    }
}

// ---
// Builder
// ---

// Builder requires "cargo" feature

// This example use "get_matches_from" instead of "get_matches"
// "get_matches_from" uses arbitrary arguments
// "get_matches" will use the args passed to this program

/// Basic greet example (builder)
fn basic_builder() {
    // Command builder
    let cmd = Command::new("program")
        .about("Simple program to greet a person")
        .subcommand_required(false)
        .arg_required_else_help(true)
        .arg(Arg::new("name").short('n').help("Name of the person to greet").default_value("friend"))
        .arg(Arg::new("count").short('c').help("Number of times to greet").default_value("1"));
    // Match and handle
    let matches = cmd.get_matches_from(["program", "-n", "Kakashi", "-c", "2"]);
    let name = matches.value_of("name").unwrap();
    let count = matches.value_of("count").unwrap().parse::<u8>().unwrap_or(1);
    for _ in 0..count {
        println!("Hello {}!", name)
    }
}

/// Basic greet example (builder)(subcommands)
fn basic_builder_subcommands() {
    // Command builder
    let cmd = Command::new("program")
        .about("Simple arithmetic program")
        .subcommand_required(true)
        .arg_required_else_help(true)
        .subcommand(
            clap::Command::new("add")
                .about("Add two numbers")
                .arg(Arg::new("a").required(true).index(1))
                .arg(Arg::new("b").required(true).index(2)),
        )
        .subcommand(
            clap::Command::new("subtract")
                .about("Subtract two numbers")
                .arg(Arg::new("a").required(true).index(1))
                .arg(Arg::new("b").required(true).index(2)),
        )
        .subcommand(
            clap::Command::new("multiply")
                .about("Product two numbers")
                .arg(Arg::new("a").required(true).index(1))
                .arg(Arg::new("b").required(true).index(2)),
        )
        .subcommand(
            clap::Command::new("divide")
                .about("Divide two numbers")
                .arg(Arg::new("a").required(true).index(1))
                .arg(Arg::new("b").required(true).index(2)),
        )
        .subcommand(
            clap::Command::new("sum")
                .about("Sum many numbers")
                .arg(Arg::new("numbers").required(true).index(1).multiple_occurrences(true)),
        );

    // Match and handle subcommands
    let matches = cmd.get_matches_from(["math", "sum", "1", "2", "3"]);
    match matches.subcommand() {
        Some(("add", args)) => {
            let a = str_to_i32(args.value_of("a").unwrap());
            let b = str_to_i32(args.value_of("b").unwrap());
            println!("{} + {} = {}", a, b, a + b);
        }
        Some(("subtract", args)) => {
            let a = str_to_i32(args.value_of("a").unwrap());
            let b = str_to_i32(args.value_of("b").unwrap());
            println!("{} - {} = {}", a, b, a - b);
        }
        Some(("multiply", args)) => {
            let a = str_to_i32(args.value_of("a").unwrap());
            let b = str_to_i32(args.value_of("b").unwrap());
            println!("{} * {} = {}", a, b, a * b);
        }
        Some(("divide", args)) => {
            let a = str_to_i32(args.value_of("a").unwrap());
            let b = str_to_i32(args.value_of("b").unwrap());
            if b == 0 {
                println!("Cannot divide by zero")
            } else {
                println!("{} / {} = {}", a, b, a as f32 / b as f32);
            }
        }
        Some(("sum", args)) => {
            let numbers: Vec<_> = args.values_of("numbers").unwrap().collect();
            let sum: i32 = numbers.iter().map(|&x| str_to_i32(x)).sum();
            println!("Sum: {}", sum);
        }
        _ => unreachable!(),
    }
}

// ---
// utils
// ---

pub fn str_to_i32(s: &str) -> i32 {
    s.parse::<i32>().unwrap_or(0)
}

pub fn print_section_header(header: String) {
    println!("");
    println!("{}", header.to_ascii_uppercase());
    println!("");
}

// ---
// notes
// ---

// App methods
// https://docs.rs/clap/3.1.6/clap/struct.App.html
// https://docs.rs/clap/3.1.6/clap/type.Command.html
// https://docs.rs/clap/3.1.6/clap/struct.Arg.html

// examples
// https://github.com/clap-rs/clap/tree/v3.1.6/examples
