use crate::types::jutsu::{jutsus, Jutsu};
use crate::types::ninja::{ninjas, Ninja};
use diesel;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// Schema

diesel::table! {
    ninjas_jutsus (id) {
        id -> Uuid,
        ninja_id -> Uuid,
        jutsu_id -> Uuid,
    }
}

joinable!(ninjas_jutsus -> ninjas (ninja_id));
joinable!(ninjas_jutsus -> jutsus (jutsu_id));

allow_tables_to_appear_in_same_query!(ninjas, ninjas_jutsus, jutsus);

// Model

#[derive(
    Serialize, Deserialize, Debug, Queryable, Selectable, PartialEq, Identifiable, Associations,
)]
#[diesel(table_name = ninjas_jutsus)]
#[diesel(belongs_to(Ninja))]
#[diesel(belongs_to(Jutsu))]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct NinjaJutsu {
    pub id: Uuid,
    pub ninja_id: Uuid,
    pub jutsu_id: Uuid,
}

#[derive(Serialize, Deserialize, Debug, Insertable)]
#[diesel(table_name = ninjas_jutsus)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct NinjaJutsuNew {
    pub id: Uuid,
    pub ninja_id: Uuid,
    pub jutsu_id: Uuid,
}
