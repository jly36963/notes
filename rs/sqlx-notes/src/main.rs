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
    let ninja_updates = NinjaUpdates {
        first_name: None,
        last_name: Some("Sensei".to_string()),
        age: None,
    };
    let result = pg_dal.update_ninja(result.id, ninja_updates).await.unwrap();
    println!("result: {:#?}", result);

    // Delete one
    let result = pg_dal.delete_ninja(result.id).await.unwrap();
    println!("result: {:#?}", result);

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
    async fn update_ninja(
        &self,
        id: String,
        ninja_updates: NinjaUpdates,
    ) -> Result<Ninja, sqlx::Error>;
    async fn delete_ninja(&self, id: String) -> Result<Ninja, sqlx::Error>;
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
    // TODO: make this not a horrible nightmare :)
    async fn update_ninja(
        &self,
        id: String,
        ninja_updates: NinjaUpdates,
    ) -> Result<Ninja, sqlx::Error> {
        let uuid = sqlx::types::Uuid::parse_str(&id).unwrap();
        let mut update_clause = String::from("SET ");
        // get fields
        let first_name = ninja_updates.first_name;
        let last_name = ninja_updates.last_name;
        let age = ninja_updates.age;
        // determine which fields have updating
        let mut update_fields: Vec<String> = Vec::new();
        let mut current_param = 1;
        if first_name.is_some() {
            update_fields.push(format!("first_name = ${}", current_param));
            current_param += 1;
        }
        if last_name.is_some() {
            update_fields.push(format!("last_name = ${}", current_param));
            current_param += 1;
        }
        if age.is_some() {
            update_fields.push(format!("age = ${}", current_param));
            current_param += 1;
        }
        // Check if at least one field is being updated
        if update_fields.len() == 0 {
            // TODO: handle no update fields (no-op)
        }
        // get querybuilder
        update_clause.push_str(&update_fields.join(", "));
        let query = format!(
            "UPDATE ninjas {} WHERE id = ${} RETURNING *;",
            update_clause, current_param
        );
        let mut qb = sqlx::query_as::<_, NinjaSqlx>(&query);
        // bind params
        if first_name.is_some() {
            qb = qb.bind(first_name.unwrap());
        }
        if last_name.is_some() {
            qb = qb.bind(last_name.clone().unwrap());
        }
        if age.is_some() {
            qb = qb.bind(age.clone().unwrap());
        }
        qb = qb.bind(uuid);
        // fetch record
        let rec = qb.fetch_one(&self.pg_pool).await?;
        // return ninja
        Ok(Ninja {
            id: rec.id.to_string(),
            first_name: rec.first_name,
            last_name: rec.last_name,
            age: rec.age,
        })
    }
    async fn delete_ninja(&self, id: String) -> Result<Ninja, sqlx::Error> {
        let uuid = sqlx::types::Uuid::parse_str(&id).unwrap();
        let rec = sqlx::query_as::<_, NinjaSqlx>("DELETE FROM ninjas WHERE id = $1 RETURNING *;")
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

pub struct NinjaUpdates {
    first_name: Option<String>,
    last_name: Option<String>,
    age: Option<i32>,
}

#[derive(sqlx::FromRow)]
pub struct NinjaSqlx {
    id: sqlx::types::Uuid,
    first_name: String,
    last_name: String,
    age: i32,
}
