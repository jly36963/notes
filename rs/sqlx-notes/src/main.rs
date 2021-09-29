use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx;
use sqlx::postgres::PgPoolOptions;

// ---
// Main
// ---

#[tokio::main]
async fn main() {
    // Connection
    let pg_conn_str = "postgresql://postgres:postgres@localhost:5432/practice";
    let pg_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(pg_conn_str)
        .await
        .unwrap();
    // Create instance of DAL
    let pg_dal = PgDAL { pg_pool };

    // ---
    // Ninjas
    // ---

    // Insert one
    let ninja_new = NinjaNew {
        first_name: "Kakashi".to_string(),
        last_name: "Hatake".to_string(),
        age: 27,
    };
    let result = pg_dal.create_ninja(ninja_new).await.unwrap();
    println!("result: {:#?}", result);

    // Find one
    let result = pg_dal.get_ninja_by_id(result.id).await.unwrap();
    println!("result: {:#?}", result);

    // Update one
    // TODO

    // Delete one
    // TODO

    // Insert many
    // TODO

    // Find
    // TODO

    // ---
    // Jutsus
    // ---

    // TODO

    // ---
    // NinjasJutsus
    // ---

    // TODO
}

// ---
// DAL
// ---

struct PgDAL {
    pg_pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait]
pub trait TPgDAL {
    async fn create_ninja(&self, ninja_new: NinjaNew) -> Result<Ninja, sqlx::Error>;
    async fn get_ninja_by_id(&self, id: String) -> Result<Ninja, sqlx::Error>;
}

#[async_trait]
impl TPgDAL for PgDAL {
    async fn create_ninja(&self, ninja_new: NinjaNew) -> Result<Ninja, sqlx::Error> {
        let rec = sqlx::query_as::<_, NinjaSqlx>(
            "INSERT INTO ninjas (first_name, last_name, age) VALUES ( $1, $2, $3 ) RETURNING *;",
        )
        .bind(ninja_new.first_name)
        .bind(ninja_new.last_name)
        .bind(ninja_new.age)
        .fetch_one(&self.pg_pool)
        .await?;

        Ok(Ninja {
            id: rec.id.to_string(),
            first_name: rec.first_name,
            last_name: rec.last_name,
            age: rec.age,
        })
    }
    async fn get_ninja_by_id(&self, id: String) -> Result<Ninja, sqlx::Error> {
        let uuid = sqlx::types::Uuid::parse_str(&id).unwrap();
        let rec = sqlx::query_as::<_, NinjaSqlx>("SELECT * FROM ninjas WHERE id = $1")
            .bind(uuid)
            .fetch_one(&self.pg_pool)
            .await?;

        Ok(Ninja {
            id: rec.id.to_string(),
            first_name: rec.first_name,
            last_name: rec.last_name,
            age: rec.age,
        })
    }
}

// ---
// Structs
// ---

#[derive(Serialize, Deserialize, Debug)]
pub struct NinjaNew {
    first_name: String,
    last_name: String,
    age: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Ninja {
    id: String,
    first_name: String,
    last_name: String,
    age: i32,
}

#[derive(sqlx::FromRow)]
pub struct NinjaSqlx {
    id: sqlx::types::Uuid,
    first_name: String,
    last_name: String,
    age: i32,
}
