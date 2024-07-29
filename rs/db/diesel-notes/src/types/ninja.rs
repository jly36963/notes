use chrono;
use diesel;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

diesel::table! {
    ninjas (id) {
        id -> Uuid,
        first_name -> Varchar,
        last_name -> Varchar,
        age -> Int4,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
    }
}

#[derive(Queryable, Selectable, Identifiable, PartialEq, Serialize, Deserialize, Debug)]
#[diesel(table_name = ninjas)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Ninja {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub age: i32,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
    // pub jutsus: Option<Vec<Jutsu>>,
}

#[derive(Insertable)]
#[diesel(table_name = ninjas)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[derive(Serialize, Deserialize, Debug)]
pub struct NinjaNew {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub age: i32,
}

#[derive(AsChangeset)]
#[diesel(table_name = ninjas)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct NinjaUpdates {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub age: Option<i32>,
}
