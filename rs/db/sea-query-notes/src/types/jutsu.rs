use chrono;
use sea_query::Iden;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Iden)]
#[iden = "jutsus"]
pub enum JutsuSql {
    Table,
    Id,
    Name,
    Description,
    ChakraNature,
    CreatedAt,
    UpdatedAt,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, PartialEq)]
pub struct Jutsu {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub chakra_nature: String,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
    // pub ninjas: Option<Vec<Ninja>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JutsuNew {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub chakra_nature: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JutsuUpdates {
    pub name: Option<String>,
    pub description: Option<String>,
    pub chakra_nature: Option<String>,
}
