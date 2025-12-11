#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use napi;
use std::time::Instant;
use uuid::Uuid;

// ---
// Receive simple numeric arguments
// ---

#[napi]
pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

// ---
// Vec return type
// ---

#[napi]
pub fn range(start: u32, stop: u32, step: u32) -> Vec<u32> {
    (start..stop).step_by(step as usize).collect()
}

// ---
// Logging
// ---

#[napi]
pub fn simple_greet(name: String) {
    let greeting = format!("Hey there, {}!", name);
    println!("{}", greeting);
}

// ---
// Optional argument
// ---

#[napi]
pub fn optional_greet(name: Option<String>) {
    let greeting: String = match name {
        Some(n) => format!("Hey there, {}!", n),
        None => "Hey there!".into(),
    };
    println!("{}", greeting);
}

// ---
// Timed operation
// ---

#[napi]
pub fn timed_operation(n: u32) -> u32 {
    let start = Instant::now();
    let value = (0..n).into_iter().fold(0, |acc, curr| acc + curr);
    let duration = start.elapsed();
    println!("Duration: {:?}", duration);
    value
}

// ---
// Receiving struct argument
// ---

#[napi(object)]
pub struct Person {
    pub first_name: String,
    pub last_name: String,
    pub age: u32,
}

#[napi]
pub fn greet(person: Person) -> String {
    let greeting = format!(
        "Hello! My name is {} {} and I am {} years old",
        person.first_name, person.last_name, person.age,
    );
    greeting
}

// ---
// Returning struct
// ---

#[napi]
pub fn get_person(id: String) -> napi::Result<Person> {
    let uuid = Uuid::parse_str(id.as_str())
        .map_err(|e| napi::Error::new(napi::Status::InvalidArg, e.to_string()))?;
    println!("Fetching user: {}", uuid);

    let person = Person {
        first_name: "Kakashi".into(),
        last_name: "Hatake".into(),
        age: 27,
    };
    Ok(person)
}

// ---
// TODO
// ---

// Opaque objects that js can use
// Use js closure from rs
// Use rs closure from js
// Promises/Futures
// Untyped and duck-typed values
