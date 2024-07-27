// ---
// Main
// ---

fn main() {
    print_section_header(String::from("basic vars"));
    basic_vars();

    print_section_header(String::from("basic const vars"));
    basic_const_vars();

    print_section_header(String::from("basic unused variables"));
    basic_unused_variables();

    print_section_header(String::from("basic str"));
    basic_str();

    print_section_header(String::from("basic bytes"));
    basic_bytes();

    print_section_header(String::from("basic strings"));
    basic_strings();

    print_section_header(String::from("basic operators"));
    basic_operators();

    print_section_header(String::from("basic numbers"));
    basic_numbers();

    print_section_header(String::from("basic functions"));
    basic_functions();

    print_section_header(String::from("basic closures"));
    basic_closures();

    print_section_header(String::from("basic if"));
    basic_if();

    print_section_header(String::from("basic loop"));
    basic_loop();

    print_section_header(String::from("basic while"));
    basic_while();

    print_section_header(String::from("basic for loop"));
    basic_for_loop();

    print_section_header(String::from("basic ownership"));
    basic_ownership();

    print_section_header(String::from("basic referencing"));
    basic_referencing();

    print_section_header(String::from("basic options"));
    basic_options();

    print_section_header(String::from("basic options (api)"));
    basic_option_api();

    print_section_header(String::from("basic results"));
    basic_results();

    print_section_header(String::from("basic results (api)"));
    basic_results_api();

    print_section_header(String::from("basic tuples"));
    basic_tuples();

    print_section_header(String::from("basic arrays"));
    basic_arrays();

    print_section_header(String::from("basic slices"));
    basic_slices();

    print_section_header(String::from("basic structs"));
    basic_structs();

    print_section_header(String::from("basic vectors"));
    basic_vectors();

    print_section_header(String::from("basic assert"));
    basic_assert();

    print_section_header(String::from("basic traits"));
    basic_traits();

    print_section_header(String::from("basic iterators"));
    basic_iterators();

    print_section_header(String::from("basic lifetimes"));
    basic_lifetimes();

    print_section_header(String::from("basic macros"));
    basic_macros();

    print_section_header(String::from("basic reflection"));
    basic_reflection();

    print_section_header(String::from("basic generics"));
    basic_generics();
}

// ---
// Utils
// ---

/// Convert a string to uppercase and print it
pub fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

// ---
// Examples
// ---

/// Example variables usage:
/// Type must be specified if not inferable.
/// Mutability is dependent on 'mut' keyword.
pub fn basic_vars() -> () {
    let mut first_name = "Kakashi";
    let mut last_name = "Hatake";
    let age: u8 = 27;
    if age > 18 {
        first_name = "Kaka";
        last_name = "Sensei";
    }

    println!(
        "Hey! I'm {} {}, and I'm {} years old.",
        first_name, last_name, age,
    )
}

/// Example const usage:
/// Constants are compile-time contants.
/// Value/lifetime is static.
/// Type must be specified
pub fn basic_const_vars() -> () {
    const ID: i32 = 1234;
    println!("Id is {}", ID)
}

/// Basic unused variables usage:
/// Variables prefixed with "_" won't trigger warnings if unused.
pub fn basic_unused_variables() -> () {
    let _i = 1010;
    println!("No warning here!");
}

/// &str is an immutable reference to a string slice.
pub fn basic_str() -> () {
    let str1 = "Quem são vocês?";

    let results: Vec<String> = vec![
        format!("str1: {}", str1),
        format!("str1.as_bytes(): {:?}", str1.as_bytes()),
        format!("str1.bytes(): {:?}", str1.bytes()),
        format!(
            "\"Not even Squidward's house\".contains(\"id\"): {}",
            "Not even Squidward's house".contains("id")
        ),
        format!(
            "\"Help me boy or you're fired\".ends_with(\"fired\"): {}",
            "Help me boy or you're fired".ends_with("fired")
        ),
        format!("str1.is_ascii(): {:?}", str1.is_ascii()),
        format!(
            "\"Mr. Krabs, I have an idea!\".is_empty(): {}",
            "Mr. Krabs, I have an idea!".is_empty(),
        ),
        format!("str1.len(): {}", str1.len()),
        format!("\"I'm ready!  \".repeat(3): {}", "I'm ready!  ".repeat(3)),
        format!(
            "\"I'm ready!\".replace(\"ready\", \"not ready\"): {}",
            "I'm ready!".replace("ready", "not ready"),
        ),
        format!(
            "\"Your ceiling is talking to me!\".split(\" \"): {:?}",
            "Your ceiling is talking to me!".split(" "),
        ),
        format!(
            "\"It's okay, take your time\".starts_with(\"I\"): {}",
            "It's okay, take your time".starts_with("I"),
        ),
        format!(
            "\"   This is a load of barnacles!   \".trim(): {}",
            "   This is a load of barnacles!   ".trim(),
        ),
        format!(
            "\"I CAN'T SEE MY FOREHEAD\".to_lowercase(): {}",
            "I CAN'T SEE MY FOREHEAD".to_lowercase(),
        ),
        format!("\"moar!\".to_uppercase(): {}", "moar!".to_uppercase(),),
    ];

    results.iter().for_each(|s| println!("{}", s));
}

pub fn basic_bytes() -> () {
    // https://doc.rust-lang.org/std/str/struct.Bytes.html
}

/// Example Strings usage:
/// std::string::String.
/// Strings do not support indexing.
/// String is a mutable string buffer.
/// &str -> String using `s.to_string()` or `String::from(s)`.
/// Can use most &str methods (deref)
pub fn basic_strings() -> () {
    let str1 = String::from("Quem são vocês?");
    let str2 = String::from("お前をずっと愛している");
    let str3 = String::from("Finland!");

    let results: Vec<String> = vec![
        format!("str1: {}", str1),
        format!("str2: {}", str2),
        format!("str3: {}", str3),
        format!(
            "String::from(\"Bar\") + \"nacles\": {}",
            String::from("Bar") + "nacles"
        ),
        format!("str1.as_bytes(): {:?}", str1.as_bytes()),
        format!("str1.as_str(): {:?}", str1.as_str()),
        format!("str1.capacity(): {}", str1.capacity()),
        format!("str2.chars(): {:?}", str2.chars()),
        format!("str2.into_bytes(): {:?}", str2.into_bytes()),
        format!("str3.is_empty(): {:?}", str3.is_empty()),
        format!("str1.len(): {}", str1.len()),
    ];

    results.iter().for_each(|s| println!("{}", s));

    // In-place mutations
    // clear, pop, push, push_str, reserve, shrink_to, truncate
}

/// Basic operator usage
pub fn basic_operators() -> () {
    let results = vec![
        // Math
        format!("2 + 3: {}", 2 + 3),
        format!("2 - 1: {}", 2 - 1),
        format!("3 * 2: {}", 3 * 2),
        format!("5 / 3: {}", 5 / 3),
        format!("5.0 / 3.0: {}", 5.0 / 3.0),
        // Comparison
        format!("5 == 5: {}", 5 == 5),
        format!("5 != 3: {}", 5 != 3),
        format!("5 > 3: {}", 5 > 3),
        format!("5 >= 3: {}", 5 >= 3),
        format!("5 < 3: {}", 5 < 3),
        format!("5 <= 3: {}", 5 <= 3),
        // Logical
        format!("!(5 > 3): {}", !(5 > 3)),
        format!("(5 > 3) && (2 < 4): {}", (5 > 3) && (2 < 4)),
        format!("(0 > 3) || (2 == 2): {}", (0 > 3) || (2 == 2)),
    ];

    results.iter().for_each(|s| println!("{}", s));
}

/// Basic numerics usage
pub fn basic_numbers() -> () {
    let results = vec![
        // Absolute
        format!("(-2.5 as f64).abs(): {}", (-2.5 as f64).abs()),
        // Exponents
        format!("(2 as i32).pow(8): {}", (2 as i32).pow(8)),
        format!("(2.0 as f64).powi(8): {}", (2.0 as f64).powi(8)),
        format!("(2.0 as f64).powf(8.0): {}", (2.0 as f64).powf(8.0)),
        format!("(4.0 as f64).sqrt(): {}", (4.0 as f64).sqrt()),
        format!("(8.0 as f64).cbrt(): {}", (8.0 as f64).cbrt()),
        format!("(2.0 as f64).recip(): {}", (2.0 as f64).recip()), // 1 / x
        // Logarithms
        format!("(2.0 as f64).exp(): {}", (2.0 as f64).exp()), // e^x
        format!("(1.0 as f64).exp().ln(): {}", (1.0 as f64).exp().ln()),
        format!("(100.0 as f64).log10(): {}", (100.0 as f64).log10()),
        // min, max, clamp
        format!("(2.0 as f64).max(3.0): {}", (2.0 as f64).max(3.0)),
        format!("(2.0 as f64).min(3.0): {}", (2.0 as f64).min(3.0)),
        format!(
            "(2.0 as f64).clamp(0.0, 10.0): {}",
            (2.0 as f64).clamp(0.0, 10.0)
        ),
        // Rounding
        format!("(3.5 as f64).floor(): {}", (3.5 as f64).floor()), // round negative direction
        format!("(3.5 as f64).ceil(): {}", (3.5 as f64).ceil()),   // round positive direction
        format!("(3.5 as f64).round(): {}", (3.5 as f64).round()), // round to closest
        format!("(3.5 as f64).trunc(): {}", (3.5 as f64).trunc()), // drop decimals
        // Classification
        format!("(2.0 as f64).is_nan(): {}", (2.0 as f64).is_nan()),
        format!("(2.0 as f64).is_finite(): {}", (2.0 as f64).is_finite()),
        format!("(2.0 as f64).is_infinite(): {}", (2.0 as f64).is_infinite()),
        format!("(2.0 as f64).is_normal(): {}", (2.0 as f64).is_normal()),
        format!(
            "(2.0 as f64).is_subnormal(): {}",
            (2.0 as f64).is_subnormal()
        ),
    ];

    results.iter().for_each(|s| println!("{}", s));
}

/// Returns the result of adding two i32 numbers
fn add_i32(a: i32, b: i32) -> i32 {
    return a + b;
}

/// Split &str into (first, rest)
fn split_first_char(s: &str) -> Option<(char, &str)> {
    let mut chars = s.chars();
    chars.next().map(|c| (c, chars.as_str()))
}

/// Basic function usage:
/// Rust does not support default args, function overloading, or variadic args.
pub fn basic_functions() -> () {
    // Params
    let a = 5;
    let b = 3;
    let sum = add_i32(5, 3);
    println!("The sum of {} and {} is {}", a, b, sum);

    // Return multiple
    let str1 = "Barnacles";
    let (first, rest) = split_first_char(str1).unwrap();
    println!(
        "When splitting {} into first/rest, I get {} and {}",
        str1, first, rest,
    );
}

/// Closures: functions that can capture the enclosing environment.
pub fn basic_closures() -> () {
    /*
    // Example definitions
    fn  add_one_v1   (x: u32) -> u32 { x + 1 }
    let add_one_v2 = |x: u32| -> u32 { x + 1 };
    let add_one_v3 = |x|             { x + 1 };
    let add_one_v4 = |x|               x + 1  ;
    */

    let add_one = |n: i32| -> i32 { n + 1 };
    let n1 = 1;
    let n2 = add_one(n1);
    println!("{} + 1 = {}", n1, n2);
}

pub fn basic_if() -> () {
    let num1: i32 = 5;
    let res: &str;

    if num1 > 0 {
        res = "positive"
    } else if num1 < 0 {
        res = "negative"
    } else {
        res = "zero"
    }
    println!("{} is {}", num1, res)
}

pub fn basic_loop() -> () {
    let mut i = 0;
    loop {
        i += 1;
        if i % 2 == 0 {
            continue;
        }
        if i > 10 {
            break;
        }
        println!("i: {}", i);
    }
}

pub fn basic_while() -> () {
    let n = 5;
    let mut i = 1;
    let mut result = 1;
    while i <= n {
        result *= i;
        i += 1;
    }
    println!("{}! is {}", n, result)
}

pub fn basic_for_loop() -> () {
    let numbers: [i32; 3] = [1, 2, 3];
    for n in numbers.iter() {
        println!("n: {}", n);
    }
    for (i, n) in numbers.iter().enumerate() {
        println!("i: {}, n: {}", i, n);
    }
}

pub fn basic_ownership() -> () {
    /*
    // Copy scalar value
    let x1 = 5;
    let x2 = x1; // scalar value is copied
    println!("{}", x1); // x1 can still be accessed

    // Move compound value (pointer, length, capacity)
    let s1 = String::from("Hello");
    let s2 = s1;  // s2 now has ownership. s1 can no longer be used
    println!("{}", s1); // invalid: value moved to s2

    // Deep copy (cloning can negatively impact performance)
    let s1 = String::from("Hello");
    let s2 = s1.clone(); // independent copy of data
    println!("{}", s1); // s1 can still be accessed

    // Functions and ownership (scalar)
    let add_one = |n: i32| -> i32 { n + 1 };
    let n1 = 1;
    let n2 = add_one(n1);

    // Functions and ownership (compound)
    let add_exclamation = |s: String| -> String { format!("{}!", s) };
    let s1 = String::from("Hello");
    let s2 = add_exclamation(s1);
    println!("{}", s1); // invalid: value moved to s2
    */

    println!("...");
}

/// Basic reference usage
/// Referencing: access data that is owned by another variable
/// Borrowing: creating a reference
/// Mutable reference: allows a function to borrow and mutate
pub fn basic_referencing() -> () {
    // Referencing (function will access value without taking ownership)
    let get_length_bytes = |s: &String| -> usize { s.len() };
    let s1 = String::from("Hello");
    let length_bytes = get_length_bytes(&s1);
    println!("{} is {} bytes", s1, length_bytes); // no error

    // Modifying a borrowed value (function will use mutable reference)
    let add_exclamation = |s: &mut String| -> () {
        s.push('!');
    };
    let mut s2 = String::from("Hello");
    add_exclamation(&mut s2);
    println!("{}", s2); // no error
}

/// Option is an enum that represents Some() or None.
/// Using inner values requires unwrapping.
pub fn basic_options() -> () {
    // match (block)
    let x1: Option<i32> = Some(2);
    match x1 {
        Some(x) => println!("x is {}", x),
        None => println!("x is null"),
    };

    // match (assign)
    let _x2: i32 = match Some(2) {
        Some(x) => x,
        None => 0,
    };

    // if let
    let _x3 = if let Some(x) = Some(2) { x } else { 0 };
}

pub fn basic_option_api() -> () {
    let opt1 = Some(2);
    let opt2 = None::<i32>;

    let results = vec![
        format!("opt1: {:?}", opt1),
        format!("opt2: {:?}", opt2),
        format!("opt1.is_some(): {:?}", opt1.is_some()),
        format!("opt1.is_none(): {:?}", opt1.is_none()),
        format!("opt1.and(opt1): {:?}", opt1.and(opt1)),
        format!("opt1.and(opt2): {:?}", opt1.and(opt2)),
        format!("opt2.and(opt1): {:?}", opt2.and(opt1)),
        format!("opt2.and(opt2): {:?}", opt2.and(opt2)),
        format!(
            "opt1.and_then(|n| Some(n + 2)): {:?}",
            opt1.and_then(|n| Some(n + 2))
        ),
        format!(
            "opt1.filter(|n| n % 2 == 0): {:?}",
            opt1.filter(|n| n % 2 == 0)
        ),
        format!("opt1.or(opt1): {:?}", opt1.or(opt1)),
        format!("opt1.or(opt2): {:?}", opt1.or(opt2)),
        format!("opt2.or(opt1): {:?}", opt2.or(opt1)),
        format!("opt2.or(opt2): {:?}", opt2.or(opt2)),
        format!("opt1.or_else(|| opt1): {:?}", opt1.or_else(|| opt1)),
        format!("opt1.xor(opt1): {:?}", opt1.xor(opt1)),
        format!("opt1.xor(None): {:?}", opt1.xor(None)),
        format!("opt2.xor(opt1): {:?}", opt2.xor(opt1)),
        format!("opt2.xor(None): {:?}", opt2.xor(None)),
        format!("opt1.map(|n| n + 2): {:?}", opt1.map(|n| n + 2)),
        format!("opt1.map_or(0, |n| n + 3): {:?}", opt1.map_or(0, |n| n + 3)),
        format!(
            "opt1.map_or_else(|| 0, |n| n + 3): {:?}",
            opt1.map_or_else(|| 0, |n| n + 3)
        ),
        format!("opt1.unwrap_or(0): {:?}", opt1.unwrap_or(0)),
    ];

    results.iter().for_each(|s| println!("{}", s));

    // Mutate: get_or_insert, get_or_insert_with
}

/// Result: a generic enum that represents Ok() or Err().
/// Used where an operation might fail
pub fn basic_results() -> () {
    let fp = "./Makefile";
    let r = std::fs::read_to_string(fp);

    // Match
    match r {
        Ok(s) => println!("Makefile:\n\n{}", s),
        Err(e) => println!("Error while reading file ({}): {}", fp, e),
    }
}

pub fn basic_results_api() -> () {
    let res1: Result<i32, &str> = Ok(2);
    let res2: Result<i32, &str> = Err("Oops");

    let results = vec![
        format!("res1.and(Ok(3)): {:?}", res1.and(Ok(3))),
        format!("res1.and(res2): {:?}", res1.and(res2)),
        format!("res2.and(Ok(3)): {:?}", res2.and(Ok(3))),
        format!("res2.and(res2): {:?}", res2.and(res2)),
        format!(
            "res1.or(Ok::<i32, &str>(3)): {:?}",
            res1.or(Ok::<i32, &str>(3))
        ),
        format!("res1.or(res2): {:?}", res1.or(res2)),
        format!(
            "res2.or(Ok::<i32, &str>(3)): {:?}",
            res2.or(Ok::<i32, &str>(3))
        ),
        format!("res2.or(res2): {:?}", res2.or(res2)),
        format!("res1.map(|n| n + 3): {:?}", res1.map(|n| n + 3)),
        format!(
            "res2.map_err(|e| format!(\"error: {{}}\", e)): {:?}",
            res2.map_err(|e| format!("error: {:?}", e))
        ),
        format!("res1.map_or(0, |n| n + 3): {}", res1.map_or(0, |n| n + 3)),
        format!(
            "res1.map_or_else(|_e| 0, |n| n + 3): {}",
            res1.map_or_else(|_e| 0, |n| n + 3)
        ),
        format!("res1.map(|n| n + 3): {:?}", res1.map(|n| n + 3)),
        format!("res1.is_ok(): {:?}", res1.is_ok()),
        format!("res1.is_err(): {:?}", res1.is_err()),
        format!("res1.ok().unwrap_or(2): {:?}", res1.ok().unwrap_or(2)),
        format!(
            "res2.err().unwrap_or(\"Barnacles!\"): {:?}",
            res2.err().unwrap_or("Barnacles!")
        ),
        format!(
            "res2.unwrap_or_else(|_e| 3): {}",
            res2.unwrap_or_else(|_e| 3)
        ),
        format!("res1.unwrap_or_default(): {:?}", res1.unwrap_or_default()),
        format!("res1.unwrap_or(2): {:?}", res1.unwrap_or(2)),
        format!("res1.unwrap(): {:?}", res1.unwrap()),
        format!("res1.expect(\"Oh no!\"): {:?}", res1.expect("Oh no!")),
    ];

    results.iter().for_each(|s| println!("{}", s));
}

/// Basic tuple usage
/// Tuples: collections of any/multiple type(s)
pub fn basic_tuples() -> () {
    let kakashi: (String, String, i32) = (String::from("Kakashi"), String::from("Hatake"), 27);
    let (first_name, last_name, age) = kakashi;
    println!(
        "Hello, my name is {} {}, and I am {} years old.",
        first_name, last_name, age
    )
}

/// Array: generic container of fixed length
/// Can be created without keyword or explitic type (eg: `let a = [1,2,3,4,5]; // [i32; 5]`)
pub fn basic_arrays() -> () {
    // Create array (explicit type)
    let numbers: [i32; 5] = [1, 2, 3, 4, 5];
    let first = &numbers[0]; // panic if index is out of bounds
    println!("The first number in {:?} is {}", numbers, first);

    // Create array (implicit type)
    let ints = [1, 2, 3, 4, 5];
    let count = ints.iter().count();
    println!("The number of elements in {:?} is {}", ints, count);
}

/// Slice: immutable ref to a subset of a collection
pub fn basic_slices() -> () {
    // String slices
    let s = String::from("Hello world!");
    let hello = &s[0..5]; // &s[..5]
    let world = &s[6..12]; // &s[6..]
    println!("{} {}", hello, world);

    // Array slices
    let a = [1, 2, 3, 4, 5];
    let first_three = &a[0..3];
    assert_eq!(first_three, &[1, 2, 3]);
}

#[derive(Debug)] // Debug trait: allows for println! usage
struct Ninja {
    first_name: String,
    last_name: String,
    age: i32,
}

impl Ninja {
    // Associated function (no `self`)
    pub fn new(first_name: String, last_name: String, age: i32) -> Ninja {
        Ninja {
            first_name,
            last_name,
            age,
        }
    }

    // Method (uses `self`, `&self`, or `&mut self`)
    pub fn greet(&self) {
        println!(
            "Hey! I'm {} {}, and I'm {} years old.",
            self.first_name, self.last_name, self.age
        )
    }
}

/// Struct: custom type with user-defined properties
/// Implementation block: where struct methods are defined
/// Trait: shared behavior (like interfaces or abstract base classes)
pub fn basic_structs() -> () {
    // Struct instantiation
    let mut kakashi = Ninja {
        first_name: String::from("Kakashi"),
        last_name: String::from("Hatake"),
        age: 27,
    };
    // Struct using associated function
    let iruka = Ninja::new(String::from("Iruka"), String::from("Umino"), 25);

    // Mutate struct field
    kakashi.last_name = String::from("Sensei");

    // Struct update syntax (somewhat similar to spread operator)
    let iruka2 = Ninja {
        last_name: String::from("Sensei"),
        ..iruka // iruka value moved to iruka2
    };

    // Use struct as param
    let greet = |n: &Ninja| -> () { println!("Hey! I'm {} {}.", n.first_name, n.last_name) };
    greet(&kakashi);
    greet(&iruka2);

    // Use struct method (from implementation block)
    kakashi.greet();
    iruka2.greet();

    // Print struct (using Debug trait)
    println!("{:?}", kakashi);
    println!("{:#?}", kakashi); // pretty print
}

/// Vectors indicate ownership, slices indicate borrow of memory
pub fn basic_vectors() -> () {
    let vec0: Vec<i32> = Vec::new();
    let mut vec1 = vec![1, 2, 3];
    vec1.push(4);
    vec1.append(&mut vec![5, 6]);
    vec1.pop();

    let results = vec![
        format!("vec0: {:?}", vec0),
        format!("vec1: {:?}", vec1),
        format!("&vec1[0]: {:?}", &vec1[0]),
        format!("vec1.get(1): {:?}", vec1.get(1)),
        format!("vec1.capacity(): {:?}", vec1.capacity()),
        format!("vec1.len(): {:?}", vec1.len()),
        format!("vec1.is_empty(): {:?}", vec1.is_empty()),
        format!("vec1.chunks(2): {:?}", vec1.chunks(2)),
        format!("vec1.contains(&2): {:?}", vec1.contains(&2)),
        format!("vec1.ends_with(&vec![2]): {:?}", vec1.ends_with(&vec![2])),
        format!("vec1.first(): {:?}", vec1.first()),
        format!("vec1.last(): {:?}", vec1.last()),
        format!(
            "vec1.iter().map(|n| n * 2): {:?}",
            vec1.iter().map(|n| n * 2)
        ),
        format!("vec1.repeat(2): {:?}", vec1.repeat(2)),
    ];
    results.iter().for_each(|s| println!("{}", s));

    println!("For loop through vec1");
    for i in &vec1 {
        println!("{}", i);
    }
}

/// Iterator: implements the "Iterator" trait
/// Has a "next" method, which returns Option<Self::Item>
pub fn basic_iterators() -> () {
    // For loop
    println!("for loop");
    let v0: Vec<i32> = vec![1, 2, 3];
    for n in v0.iter() {
        println!("{}", n);
    }

    // For loop with enumerate (index)
    println!("for loop (enumerate)");
    let v1 = vec![1, 2, 3];
    for (i, n) in v1.iter().enumerate() {
        println!("{}: {}", i, n);
    }

    // Method that uses iterator
    println!("iterator method");
    let v2 = vec![1, 2, 3];
    let sum2: i32 = v2.iter().sum();
    println!("sum: {}", sum2);

    // Map (produces another iterator)
    println!("map");
    let v3 = vec![1, 2, 3];
    let iter3 = v3.iter().map(|&x| (x as i32).pow(2));
    for n in iter3 {
        println!("{}", n);
    }

    // Filter (produces another iterator) (cloning can negatively impact performance)
    println!("filter");
    let v4 = vec![1, 2, 3];
    let iter4 = v4.iter().filter(|&&x| x > 1);
    for n in iter4 {
        println!("{}", n);
    }

    // Filter (return new vector)
    println!("filter (returning a new vector)");
    let v5 = vec![1, 2, 3];
    let new_v5 = v5.iter().filter(|&&x| x > 1).cloned().collect::<Vec<i32>>();
    println!("{:?}", new_v5);

    // Reduce (returns Option)
    // uses "into_iter": https://stackoverflow.com/a/34745885
    println!("reduce");
    let v6 = vec![1, 2, 3];
    let prod6 = v6.into_iter().reduce(|curr, acc| curr * acc).unwrap();
    println!("product: {}", prod6);

    // Fold
    // like reduce, but allows for a starting place
    println!("fold");
    let v7 = vec![1, 2, 3];
    let sum7 = v7.into_iter().fold(0, |acc, curr| acc + curr);
    println!("{}", sum7);

    // Find (returns Option)
    println!("find");
    let v8 = vec![1, 2, 3];
    let item8 = v8.iter().find(|&&x| x > 5).unwrap_or(&0);
    println!("{}", item8);
}

pub fn basic_traits() -> () {
    println!("TODO");
}

pub fn basic_lifetimes() -> () {
    println!("TODO");
}

/// Basic assert usage
pub fn basic_assert() -> () {
    assert_eq!(2, 2);
    println!("Nice, no panicking here!");
}

/// Declarative, procedural, and derive macros
/// println! -- "!" denotes a macro
/// macros are executed at compile time.
/// macros expand into new code that needs further processing.
pub fn basic_macros() -> () {
    println!("TODO");
}

/// Get the type name of a value as a String
pub fn type_of<T>(_: &T) -> String {
    format!("{}", std::any::type_name::<T>())
}

/// Basic reflection
pub fn basic_reflection() -> () {
    let s1 = String::from("Hello!");
    let t = type_of(&s1);

    println!("type: {}", t);
}

/// generic_add adds two arguments of the same type (that have the Add trait)
fn generic_add<T>(a: T, b: T) -> T
where
    T: std::ops::Add<T, Output = T>,
{
    a + b
}

/// Basic generics usage
/// Generic functions: a function with generalized types, often confined to specific trait behavior
pub fn basic_generics() -> () {
    let i32_sum = generic_add(1, 2);
    let f64_sum = generic_add(1.0, 2.0);
    println!("generic_add (i32) sum: {}", i32_sum);
    println!("generic_add (f64) sum: {}", f64_sum);
}
