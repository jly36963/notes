use chrono;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

fn main() {
    print_section_header(String::from("basic json"));
    basic_json();

    print_section_header(String::from("basic yaml"));
    basic_yaml();

    print_section_header(String::from("basic msgpack"));
    basic_msgpack();
}

fn basic_json() {
    let now = chrono::Utc::now().naive_utc();

    let jutsu = Jutsu {
        id: Uuid::new_v4(),
        name: "Chidori".into(),
        description: "Lightning blade".into(),
        chakra_nature: "Lightning".into(),
        created_at: now.clone(),
        updated_at: None,
        ninjas: None,
    };

    let ninja = Ninja {
        id: Uuid::new_v4(),
        first_name: String::from("Kakashi"),
        last_name: String::from("Hatake"),
        age: 27,
        created_at: now,
        updated_at: None,
        jutsus: Some(vec![jutsu]),
    };

    // Serialize
    let ninja_serialized = serde_json::to_string(&ninja.clone()).unwrap();
    println!("ninja_serialized: {}", ninja_serialized);
    let ninja_serialized_pretty = serde_json::to_string_pretty(&ninja).unwrap();
    println!("ninja_serialized_pretty: {}", ninja_serialized_pretty);

    // Deserialize
    let ninja_deserialized: Ninja = serde_json::from_str(&ninja_serialized).unwrap();
    println!("ninja_deserialized: {:#?}", ninja_deserialized);
}

fn basic_yaml() {
    // ---
    // Struct -> yaml
    // ---

    let now = chrono::Utc::now().naive_utc();

    let ninja = Ninja {
        id: Uuid::new_v4(),
        first_name: String::from("Kakashi"),
        last_name: String::from("Hatake"),
        age: 27,
        created_at: now,
        updated_at: None,
        jutsus: None,
    };

    let ninja_yaml = serde_yaml::to_string(&ninja).unwrap();
    println!("ninja_yaml: \n{}", ninja_yaml);

    let ninja_yaml_deserialized: Ninja = serde_yaml::from_str(&ninja_yaml).unwrap();
    println!("ninja_yaml_deserialized: {:#?}", ninja_yaml_deserialized);

    // ---
    // BTreeMap -> yaml
    // ---

    // TODO
}

fn basic_msgpack() {
    println!("TODO");
}

// ---
// Types
// ---

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone)]
pub struct Ninja {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub age: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub jutsus: Option<Vec<Jutsu>>,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone)]
pub struct Jutsu {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub chakra_nature: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub ninjas: Option<Vec<Ninja>>,
}

// ---
// utils
// ---

pub fn print_section_header(header: String) {
    println!("");
    println!("{}", header.to_ascii_uppercase());
    println!("");
}
