use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct PersonNew {
    pub name: String,
    pub username: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Person {
    pub id: i32,
    pub name: String,
    pub username: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PersonUpdates {
    pub name: Option<String>,
    pub username: Option<String>,
}
