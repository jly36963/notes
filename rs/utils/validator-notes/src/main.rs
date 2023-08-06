use chrono;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator;
use validator::Validate;

// ---
// Constants
// ---

const VALID_USER_JSON: &'static str = r#"
{
  "email": "kakashi.hatake@gmail.com",
  "firstName": "Kakashi",
  "lastName": "Hatake",
  "age": 27
}
"#;

const INVALID_USER_JSON: &'static str = r#"
{
  "email": "abc123@gmail.com",
  "firstName": "",
  "lastName": "",
  "age": 250
}
"#;

// ---
// Main
// ---

fn main() {
    // Inputs
    let user_inputs = [
        (
            "valid from struct",
            UserNew {
                email: "kakashi.hatake@gmail.com".into(),
                first_name: "Kakashi".into(),
                last_name: "Hatake".into(),
                age: 27,
            },
        ),
        ("valid from json", serde_json::from_str(&VALID_USER_JSON).unwrap()),
        ("inalid from json", serde_json::from_str(&INVALID_USER_JSON).unwrap()),
    ];

    // Iterate through inputs, validating and handling result
    for (title, user_new) in user_inputs.iter() {
        print_section_header(title.to_string());
        println!("User input:\n{}", serde_json::to_string_pretty(&user_new).unwrap());
        match user_new.validate() {
            Ok(_) => (),
            Err(e) => {
                println!("Error: {}", e);
                continue;
            }
        };
        let user = User {
            id: Uuid::new_v4(),
            email: user_new.email.clone(),
            first_name: user_new.first_name.clone(),
            last_name: user_new.last_name.clone(),
            age: user_new.age,
            created_at: chrono::Utc::now().naive_utc(),
            updated_at: None,
        };
        println!("User:\n{}", serde_json::to_string_pretty(&user).unwrap());
    }
}

// ---
// Utils
// ---

pub fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

// ---
// Types
// ---

#[derive(Serialize, Deserialize, Validate, Debug, Clone)]
pub struct UserNew {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 1))]
    #[serde(rename = "firstName")]
    pub first_name: String,
    #[validate(length(min = 1))]
    #[serde(rename = "lastName")]
    pub last_name: String,
    #[validate(range(min = 8, max = 200))]
    pub age: i32,
}

#[derive(Serialize, Deserialize, Validate, Debug, Clone)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    #[serde(rename = "firstName")]
    pub first_name: String,
    #[serde(rename = "lastName")]
    pub last_name: String,
    pub age: i32,
    #[serde(rename = "createdAt")]
    pub created_at: chrono::NaiveDateTime,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<chrono::NaiveDateTime>,
}
