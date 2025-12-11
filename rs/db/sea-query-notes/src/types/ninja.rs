use chrono;
use sea_query::Iden;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Iden)]
#[iden = "ninjas"]
pub enum NinjaSql {
    Table,
    Id,
    FirstName,
    LastName,
    Age,
    CreatedAt,
    UpdatedAt,
}

#[derive(sqlx::FromRow, PartialEq, Serialize, Deserialize, Debug)]
pub struct Ninja {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub age: i32,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NinjaNew {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub age: i32,
}

pub struct NinjaUpdates {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub age: Option<i32>,
}
