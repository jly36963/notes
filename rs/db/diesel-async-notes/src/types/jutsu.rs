use chrono;
use diesel;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

diesel::table! {
    jutsus (id) {
        id -> Uuid,
        name -> Varchar,
        chakra_nature -> Varchar,
        description -> Varchar,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
    }
}

#[derive(Serialize, Deserialize, Debug, Queryable, Selectable, PartialEq, Identifiable)]
#[diesel(table_name = jutsus)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Jutsu {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub chakra_nature: String,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Serialize, Deserialize, Debug, Insertable)]
#[diesel(table_name = jutsus)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct JutsuNew {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub chakra_nature: String,
}

#[derive(Serialize, Deserialize, Debug, AsChangeset)]
#[diesel(table_name = jutsus)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct JutsuUpdates {
    pub name: Option<String>,
    pub description: Option<String>,
    pub chakra_nature: Option<String>,
}
