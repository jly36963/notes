use crate::macros;
use crate::utils;
use std::collections::HashMap;
use std::fs::File;
use std::io;
use std::io::ErrorKind;
use std::io::Read;
use std::io::Write;
use std::path::Path;

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

pub fn basic_strings() -> () {
    // create String
    let mut greeting = String::from("Hello");
    // push & push_str
    greeting.push_str(" Kakashi");
    greeting.push('.');
    // replace
    greeting = greeting.replace(".", "!");
    // len
    let length = greeting.len();
    // is_empty
    let empty = greeting.is_empty();
    // contains
    let contains = greeting.contains("Kakashi");

    // bytes
    let bytes = "Yamato".bytes();

    // concat (+)
    let s1 = String::from("Hello");
    let s2 = String::from(" Kakashi!");
    let concatenated = s1 + &s2; // s1 has been moved and can no longer be used

    // format
    let s3 = String::from("Hello");
    let s4 = String::from("Kakashi");
    let s5 = String::from("Sensei!");
    let formatted = format!("{} {} {}", s3, s4, s5);

    // indexing
    // Strings do not support indexing

    // iterating
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

pub fn basic_operators() -> () {
    // docs: https://doc.rust-lang.org/book/appendix-02-operators.html

    // math

    // addition
    let _i = 2 + 3;
    // subtraction
    let _i = 2 - 1;
    // multiplication
    let _i = 3 * 2;
    // division
    let _i = 5 / 3;
    let _f = 5.0 / 3.0;

    // comparison

    // equality
    let _b = 5 == 5;
    // nonequality
    let _b = !(5 != 3);
    // gt
    let _b = 5 > 3;
    // gte
    let _b = 5 >= 3;
    // lt
    let _b = 5 < 3;
    // lte
    let _b = 5 <= 3;

    // logical

    // negation
    let _b = !(5 > 3);
    // short circuit and
    let _i = (5 > 3) && (2 < 4);
    // short circuit or
    let _i = (0 > 3) || (2 == 2);

    // misc

    // macro expansion
    println!("{}", String::from("Hello!"));

    // pointers

    // TODO
}

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

fn add_i32(a: i32, b: i32) -> i32 {
    return a + b;
}

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

fn get_prime_info_i32(n: i32) -> (bool, bool) {
    let prime = is_prime(n);
    let positive = n > 0;
    return (prime, positive);
}

pub fn basic_functions() -> () {
    // rust does not support default args, function overloading, or variadic args

    // params
    let a = 5;
    let b = 3;
    let sum = add_i32(5, 3);
    println!("The sum of {} and {} is {}", a, b, sum);

    // multiple return types
    let c = 6;
    let (prime, positive) = get_prime_info_i32(c);
    println!(
        "{} is {}, and it is {}.",
        c,
        macros::ternary!(prime, "prime", "not prime"),
        macros::ternary!(positive, "positive", "not positive")
    );
}

pub fn basic_unused_variables() -> () {
    // prefix with _ if unused
    let _i = 1010;
    println!("No warning here!");
}

pub fn basic_closures() -> () {
    // https://doc.rust-lang.org/rust-by-example/fn/closures.html
    // closures are functions that can capture the enclosing environment

    /*
    // example definitions
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
    let a: i32 = 5;
    if a > 3 {
        println!("{} is greater than 3", a);
    } else if a <= 3 {
        println!("{} is less than or equal to 3", a);
    } else {
        println!("How did we get here?");
    }
}

pub fn basic_loop() -> () {
    // loop with break
    let mut i = 0;
    loop {
        println!("i: {}", i);
        i += 1;
        if i > 2 {
            break;
        }
    }
    // loop returning value
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
    // for loop (element)
    for n in numbers.iter() {
        println!("n: {}", n);
    }
    // for loop (index, element)
    for (i, n) in numbers.iter().enumerate() {
        println!("i: {}, n: {}", i, n);
    }
}

pub fn basic_ownership() -> () {
    /*
    // copy scalar value
    let x1 = 5;
    let x2 = 5; // copy the value (scalar value)

    // move compound value (pointer, length, capacity)
    let s1 = String::from("Hello");
    let s2 = s1;  // s2 now has ownership. s1 can no longer be used
    println!("{}", s1); // invalid: value moved to s2

    // deep copy (cloning can negatively impact performance)
    let s1 = String::from("Hello");
    let s2 = s1.clone(); // independent copy of data

    // functions and ownership (scalar)
    let add_one = |n: i32| -> i32 { n + 1 };
    let n1 = 1;
    let n2 = add_one(n1);

    // functions and ownership (compound)
    let add_exclamation = |s: String| -> String { format!("{}!", s) };
    let s1 = String::from("Hello");
    let s2 = add_exclamation(s1);
    println!("{}", s1); // invalid: value moved to s2
    */

    // referencing
    let get_length_bytes = |s: &String| -> usize { s.len() };
    let s1 = String::from("Hello");
    let length_bytes = get_length_bytes(&s1);
    println!("{} is {} bytes", s1, length_bytes); // no error, function used reference and did not take ownership

    // modifying a borrowed value
    let add_exclamation = |s: &mut String| -> () {
        s.push('!');
    };
    let mut s2 = String::from("Hello");
    add_exclamation(&mut s2);
    println!("{}", s2);
}

pub fn basic_options() -> () {
    // Option is an enum that represents Some() or None. It requires unwrapping

    // option + match + code block
    let x1: Option<i32> = Some(2);
    match x1 {
        Some(x) => println!("x is {}", x),
        None => println!("x is null"),
    };
    // option + match + assignment
    let _x2: i32 = match Some(2) {
        Some(x) => x,
        None => 0,
    };
    // option + if let + assignment
    let _x3 = if let Some(x) = Some(2) { x } else { 0 };
    // option + is_some + unwrap (discouraged)
    let o4 = Some(2);
    let _x4 = if o4.is_some() { o4.unwrap() } else { 0 };
    // option + unwrap_or
    let _x5 = Some(2).unwrap_or(0);
}

pub fn basic_tuples() -> () {
    // tuples are a collection of any type
    let kakashi: (String, String, i32) = (String::from("Kakashi"), String::from("Hatake"), 27);
    let (first_name, last_name, age) = kakashi;
    println!(
        "Hello, my name is {} {}, and I am {} years old.",
        first_name, last_name, age
    )
}

pub fn basic_arrays() -> () {
    // arrays have fixed length

    // create array
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
    // access (panic if index out of bounds)
    let first = &months[0];
    println!("The first month is {}", first);
}

pub fn basic_slices() -> () {
    // slices -- immutable ref to a subset of a collection

    // string slices
    let s = String::from("Hello world!");

    let hello = &s[0..5]; // &s[..5]
    let world = &s[6..12]; // &s[6..]
    println!("{} {}", hello, world);

    // array slices
    let a = [1, 2, 3, 4, 5];
    let first_three = &a[0..3];
    assert_eq!(first_three, &[1, 2, 3]);
}

// struct definition
#[derive(Debug)] // trait that allows for println! usage
struct Ninja {
    first_name: String,
    last_name: String,
    age: i32,
}

// implementation block
impl Ninja {
    // struct method
    fn greet(&self) {
        println!("Hey! I'm {} {}.", self.first_name, self.last_name)
    }
}

pub fn basic_structs() -> () {
    // function that uses struct
    let greet = |n: &Ninja| -> () { println!("Hey! I'm {} {}.", n.first_name, n.last_name) };

    // struct instance
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

    // mutate field
    kakashi.last_name = String::from("Sensei");

    // struct update syntax (somewhat similar to spread operator)
    let iruka2 = Ninja {
        last_name: String::from("Sensei"),
        ..iruka // iruka value moved to iruka2
    };

    // use struct function
    greet(&kakashi);
    greet(&iruka2);

    // use struct method
    (&kakashi).greet();
    iruka2.greet(); // automatic referencing/dereferencing

    // print struct
    println!("{:?}", kakashi); // print instance of struct (with Debug trait)
    println!("{:#?}", kakashi); // pretty print instance
}

pub fn basic_vectors() -> () {
    // initialize empty vector
    let _v: Vec<i32> = Vec::new();
    // initialize vector with values
    let mut v = vec![1, 2, 3];
    // push elements
    v.push(4);
    // pop elements
    let _last = v.pop();
    // access elements (indexing)
    let first: &i32 = &v[0];
    println!("first element: {}", first);
    // access (get method)
    let second: Option<&i32> = v.get(1);
    match second {
        Some(x) => println!("second element: {}", x),
        None => println!("No second element"),
    };
    // iterating
    for i in &v {
        println!("{}", i);
    }
}

pub fn basic_hashmaps() -> () {
    // create hashmap
    let mut hm: HashMap<String, i32> = HashMap::new();
    // add keys/values
    hm.insert(String::from("a"), 1);
    hm.insert(String::from("b"), 2);
    hm.insert(String::from("c"), 3);
    // access (option + match)
    let a = hm.get("a"); // let a = hm.get(&String::from("a"));
    match a {
        Some(x) => println!("a: {}", x),
        None => println!("a is null"),
    };
    // access (option + unwrap)
    let z = hm.get("z").unwrap_or(&0);
    println!("z: {}", z);
    // overwrite
    hm.insert(String::from("c"), 30);
    // insert if key doesn't have a value yet
    hm.entry(String::from("d")).or_insert(4);

    println!("{:?}", hm);
}

pub fn basic_iterators() -> () {
    // docs: https://doc.rust-lang.org/book/ch13-02-iterators.html
    // they implement the trait "Iterator"
    // they have a "next" method, which returns Option<Self::Item>

    // for loop
    println!("for loop");
    let v0: Vec<i32> = vec![1, 2, 3];
    for n in v0.iter() {
        println!("{}", n);
    }

    // for loop with enumerate (index)
    println!("for loop (enumerate)");
    let v1 = vec![1, 2, 3];
    for (i, n) in v1.iter().enumerate() {
        println!("{}: {}", i, n);
    }

    // method that uses iterator
    println!("iterator method");
    let v2 = vec![1, 2, 3];
    let sum2: i32 = v2.iter().sum();
    println!("sum: {}", sum2);

    // map (produces another iterator)
    println!("map");
    let v3 = vec![1, 2, 3];
    let iter3 = v3.iter().map(|&x| (x as i32).pow(2));
    for n in iter3 {
        println!("{}", n);
    }

    // filter (produces another iterator) (cloning can negatively impact performance)
    println!("filter");
    let v4 = vec![1, 2, 3];
    let iter4 = v4.iter().filter(|&&x| x > 1);
    for n in iter4 {
        println!("{}", n);
    }

    // filter (return new vector)
    println!("filter (returning a new vector)");
    let v5 = vec![1, 2, 3];
    let new_v5 = v5.iter().filter(|&&x| x > 1).cloned().collect::<Vec<i32>>();
    println!("{:?}", new_v5);

    // reduce (returns Option)
    // uses "into_iter": https://stackoverflow.com/a/34745885
    println!("reduce");
    let v6 = vec![1, 2, 3];
    let prod6 = v6.into_iter().reduce(|curr, acc| curr * acc).unwrap();
    println!("product: {}", prod6);

    // find (returns Option)
    println!("find");
    let v7 = vec![1, 2, 3];
    let i7 = v7.iter().find(|&&x| x > 5).unwrap_or(&0);
    println!("{}", i7);
}

pub fn basic_traits() -> () {
    // https://doc.rust-lang.org/book/ch10-02-traits.html
    // TODO
}

pub fn basic_lifetimes() -> () {
    // TODO
}

pub fn basic_io() -> () {
    // docs: https://doc.rust-lang.org/std/fs/struct.File.html

    // Result enum has Ok and Err
    // unwrap is optimistic -- unwrapping a Result will panic if Err

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

pub fn basic_assert() -> () {
    assert_eq!(2, 2);
    println!("Yay, no panicking here.");
}

pub fn basic_macros() -> () {
    // println! -- "!" denotes a macro
    // macros are executed at compile time.
    // macros expand into new code that needs further processing.

    for n in 1..6 {
        let parity = macros::ternary!(n % 2 == 0, "even", "odd");
        println!("{} is {}", n, parity);
    }
}

pub fn basic_reflection() -> () {
    let s1 = String::from("Hello!");
    let t = utils::type_of(&s1);

    println!("type: {}", t);
}

// ---
// not used
// ---

fn _result_with_match() -> () {
    let _f = File::open("hello.txt");
    // match (Ok/Error)
    match _f {
        // handle Ok (success)
        Ok(file) => file,
        // handle Err (failure)
        Err(error) => match error.kind() {
            // handle specific kind of error
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            // wildcard (catch all)
            other_error => {
                panic!("Problem opening the file: {:?}", other_error)
            }
        },
    };
}

fn _result_with_unwrap_or_else() -> () {
    // unwrap_or_else
    let _f = File::open("hello.txt").unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello.txt").unwrap_or_else(|error| {
                panic!("Problem creating the file: {:?}", error);
            })
        } else {
            panic!("Problem opening the file: {:?}", error);
        }
    });
}

fn _result_with_unwrap() -> () {
    // unwrap (panics if not ok)
    let _f = File::open("hello.txt").unwrap();
}

fn _result_with_expect() -> () {
    // expect (panic if not ok, provide error message)
    let _f = File::open("hello.txt").expect("Failed to open hello.txt");
}

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

fn _result_with_propogate_qm_operator() -> Result<String, io::Error> {
    let mut f = File::open("hello.txt")?;
    let mut s = String::new();
    f.read_to_string(&mut s)?; // ? returns early if Err (and return type is Result)
    Ok(s)
}

fn _result_with_propogate_qm_operator_2() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}

fn _basic_result() -> () {
    _result_with_match();
    _result_with_unwrap_or_else();
    _result_with_unwrap();
    _result_with_expect();
    let _result = _result_with_propogate();
    let _result = _result_with_propogate_qm_operator();
    let _result = _result_with_propogate_qm_operator_2();
}
