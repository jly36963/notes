use chrono;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct NinjaNew {
    pub first_name: String,
    pub last_name: String,
    pub age: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Ninja {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub age: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub jutsus: Option<Vec<Jutsu>>,
}

pub struct NinjaUpdates {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub age: Option<i32>,
}

#[derive(sqlx::FromRow)]
pub struct NinjaSqlx {
    pub id: sqlx::types::Uuid,
    pub first_name: String,
    pub last_name: String,
    pub age: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JutsuNew {
    pub name: String,
    pub description: String,
    pub chakra_nature: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Jutsu {
    pub id: String,
    pub name: String,
    pub description: String,
    pub chakra_nature: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub ninjas: Option<Vec<Ninja>>,
}

pub struct JutsuUpdates {
    pub name: Option<String>,
    pub description: Option<String>,
    pub chakra_nature: Option<String>,
}

#[derive(sqlx::FromRow)]
pub struct JutsuSqlx {
    pub id: sqlx::types::Uuid,
    pub name: String,
    pub description: String,
    pub chakra_nature: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}
