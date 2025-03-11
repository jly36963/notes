use serde::{Deserialize, Serialize};
use uuid::Uuid;
use wasm_bindgen::prelude::*;
use web_sys::console::{time_end_with_label, time_with_label};

// ---
// Receive simple numeric arguments
// ---

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

// ---
// Vec return type
// ---

#[wasm_bindgen]
pub fn range(start: u32, stop: u32, step: usize) -> Vec<u32> {
    (start..stop).step_by(step).collect()
}

// ---
// Using console log
// ---

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

#[wasm_bindgen]
pub fn simple_greet(name: &str) {
    let greeting = format!("Hey there, {}!", name);
    log(&greeting);
}

// ---
// Optional argument
// ---

#[wasm_bindgen]
pub fn optional_greet(name: Option<String>) {
    let greeting: String = match name {
        Some(n) => format!("Hey there, {}!", n),
        None => "Hey there!".into(),
    };
    log(&greeting);
}

// ---
// Timed operation
// ---

#[wasm_bindgen]
pub fn timed_operation(n: u32, label: Option<String>) -> u32 {
    let label = label.unwrap_or("operation".into());
    time_with_label(label.as_str());
    let value = (0..n).into_iter().fold(0, |acc, curr| acc + curr);
    time_end_with_label(label.as_str());
    value
}

// ---
// Receiving struct argument
// ---

// Wasm + serde
// https://rustwasm.github.io/wasm-bindgen/reference/arbitrary-data-with-serde.html

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Person {
    first_name: String,
    last_name: String,
    age: u32,
}

#[wasm_bindgen]
pub fn greet(value: JsValue) -> Result<String, JsValue> {
    let person: Person = serde_wasm_bindgen::from_value(value).map_err(|e| e.to_string())?;
    let greeting = format!(
        "Hello! My name is {} {} and I am {} years old",
        person.first_name, person.last_name, person.age,
    );
    Ok(greeting)
}

// ---
// Returning struct
// ---

#[wasm_bindgen]
pub fn get_person(id: String) -> Result<JsValue, JsValue> {
    let uuid = Uuid::parse_str(id.as_str()).map_err(|e| JsValue::from(e.to_string()))?;
    log(format!("Fetching user: {}", uuid).as_str());

    let person = Person {
        first_name: "Kakashi".into(),
        last_name: "Hatake".into(),
        age: 27,
    };
    let value = serde_wasm_bindgen::to_value(&person)?;
    Ok(value)
}

// ---
// Fetch
// ---

// https://rustwasm.github.io/wasm-bindgen/examples/fetch.html

// ---
// TODO
// ---

// Opaque objects that js can use
// Use js closure from rs
// Use rs closure from js
// Promises/Futures
// Untyped and duck-typed values
