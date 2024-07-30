use sea_query::Iden;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Iden)]
#[iden = "ninjas_jutsus"]
pub enum NinjaJutsuSql {
    Table,
    Id,
    NinjaId,
    JutsuId,
}

#[derive(sqlx::FromRow, PartialEq, Serialize, Deserialize, Debug)]
pub struct NinjaJutsu {
    pub id: Uuid,
    pub ninja_id: Uuid,
    pub jutsu_id: Uuid,
}

// #[derive(Serialize, Deserialize, Debug)]
// pub struct NinjaJutsuNew {
//     pub id: Uuid,
//     pub ninja_id: Uuid,
//     pub jutsu_id: Uuid,
// }
