use crate::macros;
use crate::utils;
use std::collections::HashMap;
use std::fs::File;
use std::io;
use std::io::ErrorKind;
use std::io::Read;
use std::io::Write;
use std::path::Path;

/// Example variables usage
/// Type must be specified if not inferable
/// Mutability is dependent on 'mut' keyword
pub fn basic_vars() -> () {
    let first_name = "Kakashi"; // let (immutable)
    let mut last_name = "H"; // let mut (mutable)
    if true {
        last_name = "Hatake";
    }
    let age: u8 = 27;
    // const
    const ID: i32 = 1234; // const (immutable) (needs type)
    println!(
        "Hey! My name is {f} {l}, and I'm {a} years old. (id: {id})",
        f = first_name,
        l = last_name,
        a = age,
        id = ID,
    )
}

/// Basic unused variables usage
/// Variables prefixed with "_" won't trigger warnings if unused
pub fn basic_unused_variables() -> () {
    let _i = 1010;
    println!("No warning here!");
}

/// Example Strings usage
/// std::string::String
/// Strings do not support indexing
pub fn basic_strings() -> () {
    let mut greeting = String::from("Hello");
    greeting.push_str(" Kakashi");
    greeting.push('.');
    greeting = greeting.replace(".", "!");
    let length = greeting.len();
    let empty = greeting.is_empty();
    let contains = greeting.contains("Kakashi");
    let bytes = "Yamato".bytes(); // std::str::Bytes

    // Into: https://doc.rust-lang.org/rust-by-example/conversion/from_into.html
    let _s: String = "Hey there!".into();

    // Concatenate String
    let s1 = String::from("Hello");
    let s2 = String::from(" Kakashi!");
    let concatenated = s1 + &s2; // s1 has been moved and can no longer be used

    // Format String
    let s3 = String::from("Hello");
    let s4 = String::from("Kakashi");
    let s5 = String::from("Sensei!");
    let formatted = format!("{} {} {}", s3, s4, s5);

    // Iterating
    for c in "お前をずっと愛している".chars() {
        println!("{}", c);
    }

    println!("greeting: {}", greeting);
    println!("length: {}", length);
    println!("empty: {}", empty);
    println!("contains: {}", contains);
    println!("bytes: {:?}", bytes);
    println!("concatenation: {}", concatenated);
    println!("format: {}", formatted);
    println!("format: {}", formatted);
}

/// Basic operator usage
pub fn basic_operators() -> () {
    // Math
    let _i = 2 + 3;
    let _i = 2 - 1;
    let _i = 3 * 2;
    let _i = 5 / 3;
    let _f = 5.0 / 3.0;

    // Comparison
    let _b = 5 == 5;
    let _b = 5 != 3;
    let _b = 5 > 3;
    let _b = 5 >= 3;
    let _b = 5 < 3;
    let _b = 5 <= 3;

    // Logical
    let _b = !(5 > 3);
    let _i = (5 > 3) && (2 < 4);
    let _i = (0 > 3) || (2 == 2);

    // Macro expansion (!)
    println!("{}", String::from("Hello!"));

    // Pointers
    // TODO
}

/// Basic numerics usage
pub fn basic_numbers() -> () {
    // power
    let _i = (2 as i32).pow(8);
    let _f = (2.0 as f64).powi(8);
    let _f = (2.0 as f64).powf(8.0);
    let _f = (4.0 as f64).sqrt();
    let _f = (8.0 as f64).cbrt();
    let _f = (2.0 as f64).recip();
    // max, min, clamp
    let _f = (2.0 as f64).max(3.0);
    let _f = (2.0 as f64).min(3.0);
    let _f = (2.0 as f64).clamp(0.0, 10.0);
    // e^x
    let _f = (2.0 as f64).exp();
    // logarithms
    let _f = (1.0 as f64).exp().ln();
    let _f = (100.0 as f64).log10();
    // floor (closes int in negative direction)
    let _f = (3.5 as f64).floor();
    // ceil (closest int in positive direction)
    let _f = (3.5 as f64).ceil();
    // round (closest int, tie rounds away from 0)
    let _f = (3.5 as f64).ceil();
    // trunc (return integer part of number)
    let _f = (3.5 as f64).trunc();
    // abs
    let _f = (-2.5 as f64).abs();
    // classification
    let _b = (2.0 as f64).is_nan();
    let _b = (2.0 as f64).is_finite();
    let _b = (2.0 as f64).is_infinite();
    let _b = (2.0 as f64).is_normal();
    let _b = (2.0 as f64).is_subnormal();

    println!("2^8 is {}", (2 as i32).pow(8));
    println!("|-5| is {}", (-5 as i32).abs());
}

/// add_i32 returns the result of adding two i32 numbers
fn add_i32(a: i32, b: i32) -> i32 {
    return a + b;
}

/// is_prime returns whether or not a number is prime
fn is_prime(n: i32) -> bool {
    if n < 2 {
        return false;
    }
    for a in 2..n {
        if n % a == 0 {
            return false;
        }
    }
    return true;
}

/// get_is_prime_and_sign takes a number and returns whether or not it's 1) prime 2) positive
fn get_is_prime_and_sign(n: i32) -> (bool, bool) {
    let prime = is_prime(n);
    let positive = n > 0;
    return (prime, positive);
}

/// Basic function usage
/// Rust does not support default args, function overloading, or variadic args
pub fn basic_functions() -> () {
    // Params
    let a = 5;
    let b = 3;
    let sum = add_i32(5, 3);
    println!("The sum of {} and {} is {}", a, b, sum);

    // Return multiple
    let c = 6;
    let (prime, positive) = get_is_prime_and_sign(c);
    println!(
        "{} is {}, and it is {}.",
        c,
        macros::ternary!(prime, "prime", "not prime"),
        macros::ternary!(positive, "positive", "not positive")
    );
}

/// Basic closure usage
/// Closures: functions that can capture the enclosing environment
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

/// Basic if / else if / else statements
pub fn basic_if() -> () {
    let a: i32 = 5;
    if a > 3 {
        println!("{} is greater than 3", a);
    } else if a <= 3 {
        println!("{} is less than or equal to 3", a);
    } else {
        println!("How did we get here?");
    }
}

/// Basic loop usage
pub fn basic_loop() -> () {
    // Loop with break
    let mut i = 0;
    loop {
        println!("i: {}", i);
        i += 1;
        if i > 2 {
            break;
        }
    }
    // Loop returning value
    let mut value = 1;
    let mut power = 0;
    let less_than_150: bool = loop {
        value *= 2;
        power += 1;
        if value > 100 {
            break value < 150;
        }
    };
    println!(
        "The first value of 2^n > 100 is {} (2^{}), which is {}",
        value,
        power,
        macros::ternary!(less_than_150, "less than 150", "not less than 150"),
    );
}

/// Basic while loop usage
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

/// Basic for loop usage
pub fn basic_for_loop() -> () {
    let numbers: [i32; 3] = [1, 2, 3];
    // For loop
    for n in numbers.iter() {
        println!("n: {}", n);
    }
    // For loop with index
    for (i, n) in numbers.iter().enumerate() {
        println!("i: {}, n: {}", i, n);
    }
}

/// Basic ownership rules
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

/// Basic option enum usage
/// Option is an enum that represents Some() or None.
/// Using inner values requires unwrapping
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

    // and
    Some(2).and(Some(3)); // Some(3)
    Some(2).and::<i32>(None); // None
    None::<i32>.and(Some(3)); // None
    None::<i32>.and::<i32>(None); // None

    // and_then (Some: apply func; None: do nothing)
    Some(2).and_then(|n| Some(n + 2));

    // filter (Some: None if fails predicate; None: None)
    Some(2).filter(|n| n % 2 == 0);

    // or
    Some(2).or(Some(3)); // Some(3)
    Some(2).or(None); // Some(2)
    None::<i32>.or(Some(3)); // Some(3)
    None::<i32>.or(None); // None

    // or_else (Some: Some; None: use func for value)
    Some(2).or_else(|| Some(3));

    // xor
    Some(2).xor(Some(3)); // None
    Some(2).xor(None); // Some(2)
    None::<i32>.xor(Some(3)); // Some(3)
    None::<i32>.xor(None); // None

    // get_or_insert (insert value if option is None, then return mutable reference)
    Some(2).get_or_insert(3); // &2

    // get_or_insert_with
    None::<i32>.get_or_insert_with(|| 3); // &3

    // is_some & is_none
    let o4 = Some(2);
    let mut _x4: i32;
    _x4 = if o4.is_some() { o4.unwrap() } else { 0 };
    _x4 = if o4.is_some() { 0 } else { o4.unwrap() };

    // map
    Some(2).map(|n| n + 2); // Some(4)

    // map_or (map with fallback value)
    Some(2).map_or(0, |n| n + 3); // Some(5)

    // map_or_else (None func, Some func)
    Some(2).map_or_else(|| 0, |n| n + 3);

    // unwrap_or
    let _x5 = Some(2).unwrap_or(0);
}

/// Basic result enum usage
/// Result is an enum that represents Ok() or Err().
/// Using inner values requires unwrapping
pub fn basic_results() -> () {
    let fp = "./Makefile";
    let r = std::fs::read_to_string(fp);

    // match
    match r {
        Ok(s) => println!("Makefile: {}", s),
        Err(e) => println!("Error while reading file ({}): {}", fp, e),
    }

    // and
    #[allow(unused_must_use)] // Normally, results must be used
    {
        // and
        // All results in this example are of type Result<i32, &str)
        Ok::<i32, &str>(5).and(Ok(3)); // Ok(3)
        Ok::<i32, &str>(5).and(Err::<i32, &str>("Oops")); // Err
        Err::<i32, &str>("Oops").and(Ok(3)); // Err
        Err::<i32, &str>("Oops").and(Err::<i32, &str>("Oops")); // Err

        // or
        // All results in this example are of type Result<i32, &str)
        Ok::<i32, &str>(5).or(Ok::<i32, &str>(3)); // Ok(3)
        Ok::<i32, &str>(5).or(Err::<i32, &str>("Oops")); // Ok(5)
        Err::<i32, &str>("Oops").or(Ok::<i32, &str>(3)); // Ok(3)
        Err::<i32, &str>("Oops").or(Err::<i32, &str>("Oops")); // Err

        // map
        Ok::<i32, &str>(3).map(|n| n + 3);

        // map_err
        Err::<i32, String>("Oops".into()).map_err(|e| format!("error: {}", e));

        // map_or
        Ok::<i32, &str>(3).map_or(0, |n| n + 3);

        // map_or_else
        Ok::<i32, &str>(3).map_or_else(|_e| 0, |n| n + 3);

        // is_err & is_ok
        Ok::<i32, &str>(3).map(|n| n + 3);

        let res: Result<i32, &str> = Ok(2);
        let mut _i: i32;
        _i = if res.is_ok() { res.unwrap() } else { 0 };
        _i = if res.is_err() { 0 } else { res.unwrap() };

        // ok & err (converts to Option)
        Ok::<i32, &str>(3).ok().unwrap_or(2);
        Err::<i32, &str>("Oops").err().unwrap_or("Barnacles!");

        // unwrap_or_else
        Err::<i32, &str>("Oops").unwrap_or_else(|_e| 3);

        // unwrap_or_default (default value of type)
        Ok::<i32, &str>(3).unwrap_or_default(); // 0

        // unwrap_or
        Ok::<i32, &str>(3).unwrap_or(2);

        // unwrap (panicks if Err)
        Ok::<i32, &str>(3).unwrap();

        // expect
        Ok::<i32, &str>(3).expect("Oops, result wasn't ok");
    }
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

/// Basic array usage
/// Array: generic container of fixed length
/// Can be created without keyword or explitic type (eg: `let a = [1,2,3,4,5]; // [i32; 5]`)
pub fn basic_arrays() -> () {
    // Create array
    let months: [String; 12] = [
        String::from("January"),
        String::from("February"),
        String::from("March"),
        String::from("April"),
        String::from("May"),
        String::from("June"),
        String::from("July"),
        String::from("August"),
        String::from("September"),
        String::from("October"),
        String::from("November"),
        String::from("December"),
    ];

    // Access (panic if index out of bounds)
    let first = &months[0];
    println!("The first month is {}", first);

    // Simple initialization
    let ints = [1, 2, 3, 4, 5];
    let count = ints.iter().count();
    println!("ints count: {}", count);
}

/// Basic slice usage
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
    fn greet(&self) {
        println!(
            "Hey! I'm {} {}, and I'm {} years old.",
            self.first_name, self.last_name, self.age
        )
    }
}

/// Basic struct usage
/// Struct: custom type with user-defined properties
/// Implementation block: where struct methods are defined
/// Trait: shared behavior (like interfaces or abstract base classes)
pub fn basic_structs() -> () {
    // Struct as param
    let greet = |n: &Ninja| -> () { println!("Hey! I'm {} {}.", n.first_name, n.last_name) };

    // Struct instantiation
    let mut kakashi = Ninja {
        first_name: String::from("Kakashi"),
        last_name: String::from("Hatake"),
        age: 27,
    };
    let iruka = Ninja {
        first_name: String::from("Iruka"),
        last_name: String::from("Umino"),
        age: 25,
    };

    // Mutate struct field
    kakashi.last_name = String::from("Sensei");

    // Struct update syntax (somewhat similar to spread operator)
    let iruka2 = Ninja {
        last_name: String::from("Sensei"),
        ..iruka // iruka value moved to iruka2
    };

    // Use struct function (closure technically)
    greet(&kakashi);
    greet(&iruka2);

    // Use struct method (from implementation block)
    (&kakashi).greet();
    iruka2.greet(); // automatic referencing/dereferencing

    // Print struct
    println!("{:?}", kakashi); // print instance of struct (using Debug trait)
    println!("{:#?}", kakashi); // pretty print instance
}

/// Basic vector usage
/// Vectors indicate ownership, slices indicate borrow of memory
pub fn basic_vectors() -> () {
    // Initialize empty vector
    let _v: Vec<i32> = Vec::new();
    // Initialize vector with values
    let mut v = vec![1, 2, 3];
    // Push elements
    v.push(4);
    // Pop elements
    let _last = v.pop();
    // Access elements (indexing)
    let first: &i32 = &v[0];
    println!("first element: {}", first);
    // Access (get method)
    let second: Option<&i32> = v.get(1);
    match second {
        Some(x) => println!("second element: {}", x),
        None => println!("No second element"),
    };
    // Iterating
    for i in &v {
        println!("{}", i);
    }
}

/// Basic hashmap usage
pub fn basic_hashmaps() -> () {
    // Create hashmap
    let mut hm: HashMap<String, i32> = HashMap::new();
    // Add keys/values
    hm.insert(String::from("a"), 1);
    hm.insert(String::from("b"), 2);
    hm.insert(String::from("c"), 3);
    // Access (option + match)
    let a = hm.get("a"); // let a = hm.get(&String::from("a"));
    match a {
        Some(x) => println!("a: {}", x),
        None => println!("a is null"),
    };
    // Access (option + unwrap)
    let z = hm.get("z").unwrap_or(&0);
    println!("z: {}", z);
    // Overwrite
    hm.insert(String::from("c"), 30);
    // Insert if key doesn't have a value yet
    hm.entry(String::from("d")).or_insert(4);
    // Print hashmap
    println!("{:?}", hm);
}

/// Basic iterator usage
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

/// Basic trait usage
pub fn basic_traits() -> () {
    // https://doc.rust-lang.org/book/ch10-02-traits.html
    // TODO
}

/// Basic lifetimes
pub fn basic_lifetimes() -> () {
    // https://doc.rust-lang.org/rust-by-example/scope/lifetime.html
    // TODO
}

/// Basic io usage
pub fn basic_io() -> () {
    // docs: https://doc.rust-lang.org/std/fs/struct.File.html

    // get path
    let path = Path::new("hello.txt");
    // create (if ok, returns write-only file descriptor)
    let mut fd = File::create(&path).unwrap();
    // write (requires `use std::io::Write;`)
    fd.write_all(b"Hello, world!").unwrap();
    // open (if ok, returns read-only file descriptor)
    let mut fd = File::open(&path).unwrap();
    // read
    let mut contents = String::new();
    fd.read_to_string(&mut contents).unwrap();
    println!("contents: {}", contents);
    // delete
    std::fs::remove_file(&path).unwrap();
}

/// Basic assert usage
pub fn basic_assert() -> () {
    assert_eq!(2, 2);
    println!("Yay, no panicking here.");
}

/// Basic macro usage
/// println! -- "!" denotes a macro
/// macros are executed at compile time.
/// macros expand into new code that needs further processing.
pub fn basic_macros() -> () {
    for n in 1..6 {
        let parity = macros::ternary!(n % 2 == 0, "even", "odd");
        println!("{} is {}", n, parity);
    }
}

/// Basic reflection
pub fn basic_reflection() -> () {
    let s1 = String::from("Hello!");
    let t = utils::type_of(&s1);

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
    let _i32_sum = generic_add(1, 2);
    let _f64_sum = generic_add(1.0, 2.0);
}

/// Basic result usage
/// Result: Ok, Err
/// Generic enum (Ok and Err types must be specified)
/// Used where an operation might fail
/// Lots of ways to handle: match, unwrap, unwrap_or, unwrap_or_else, ?,
pub fn _basic_result() -> () {
    // ---
    // match
    // ---

    // Match: similar to a switch, handle each case
    // Kind: allows multiple types of errors to be handled (or wildcard/catchall)

    let _f = File::open("hello.txt"); // std::result::Result<std::fs::File, std::io::Error>
    match _f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            other_error => {
                panic!("Problem opening the file: {:?}", other_error)
            }
        },
    };

    // ---
    // unwrap_or_else
    // ---

    // Get value from Ok, or compute it from the error using a closure

    let _f = File::open("hello.txt").unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello.txt").unwrap_or_else(|error| {
                panic!("Problem creating the file: {:?}", error);
            })
        } else {
            panic!("Problem opening the file: {:?}", error);
        }
    });

    // ---
    // unwrap_or
    // ---

    // Get value from Ok or provide a fallback value

    let mut contents = String::new();
    match File::open("hello.txt") {
        Ok(mut f) => {
            let bytes_read = f.read_to_string(&mut contents).unwrap_or(0);
            println!("{} bytes were read", bytes_read);
        }
        Err(_) => {
            println!("Oops! failed to open the file");
        }
    }

    // ---
    // unwrap
    // ---

    // Get value if Ok, panic if Err

    let _f = File::open("hello.txt").unwrap();

    // ---
    // expect
    // ---

    // panic if Err, with message

    let _f = File::open("hello.txt").expect("Failed to open hello.txt");
}

/// Basic propogation
/// The last expression evaluates to a result of the same type declared by the parent function
fn _result_with_propogate() -> Result<String, io::Error> {
    let f = File::open("hello.txt");

    let mut f = match f {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut s = String::new();

    match f.read_to_string(&mut s) {
        Ok(_) => Ok(s),
        Err(e) => Err(e),
    }
}

/// Basic propogation (?)
/// When a result is the same type as the parent function
/// result? -- continue function if Ok, return early with Err(e) if error
fn _result_with_propogate_qm_operator() -> Result<String, io::Error> {
    let mut f = File::open("hello.txt")?;
    let mut s = String::new();
    f.read_to_string(&mut s)?; // return early if Err
    Ok(s) // result must have been Ok
}

/// Basic propogation (multiple ?)
/// Both expressions return the same result, an Err from either will cause early return
fn _result_with_propogate_qm_operator_2() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
