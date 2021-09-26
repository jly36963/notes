use async_trait::async_trait;
use mongodb::{bson::doc, options::ClientOptions, Client};
use serde::{Deserialize, Serialize};

// ---
// Main
// ---

#[tokio::main]
async fn main() {
    // Connection
    let mongo_conn = String::from("mongodb://localhost:27017");
    let client_options = ClientOptions::parse(mongo_conn).await.unwrap();
    let client = Client::with_options(client_options).unwrap();
    let db = client.database("practice");
    // Create instance of DAL
    let mongo_dal = MongoDAL { db };
    // Insert one
    let ninja_new = NinjaNew {
        first_name: "Kakashi".to_string(),
        last_name: "Hatake".to_string(),
        age: 27,
    };
    let result = mongo_dal.create_ninja(ninja_new).await;
    match result {
        Ok(r) => match r {
            Some(n) => println!("Ninja insert_one result: {:#?}", n),
            None => println!("Could not find newly inserted ninja"),
        },
        Err(e) => println!("Ninja insert_one error: {:#?}", e),
    };
    // Find one
    let id = result.unwrap().unwrap().id;
    let result = mongo_dal.get_ninja_by_id(id).await;
    match result {
        Ok(r) => match r {
            Some(n) => println!("Ninja find_one result: {:#?}", n),
            None => println!("Could not find ninja with id: {}", id),
        },
        Err(e) => println!("Ninja find_one error: {:#?}", e),
    };
    // Update one
    // TODO
    // Delete one
    // TODO
    // Insert many
    // TODO
    // Find
    // TODO
}

// ---
// DAL
// ---

struct MongoDAL {
    db: mongodb::Database,
}

#[async_trait]
pub trait TMongoDAL {
    async fn create_ninja(&self, ninja: NinjaNew) -> Result<Option<Ninja>, mongodb::error::Error>;
    async fn get_ninja_by_id(&self, id: String) -> Result<Option<Ninja>, mongodb::error::Error>;
}

#[async_trait]
impl TMongoDAL for MongoDAL {
    async fn create_ninja(
        &self,
        ninja_new: NinjaNew,
    ) -> Result<Option<Ninja>, mongodb::error::Error> {
        // Insert ninja
        let result = self
            .db
            .collection::<NinjaNew>("ninjas")
            .insert_one(ninja_new, None)
            .await?;
        // Get newly inserted ninja (TODO: combine into single operation?)
        let id = result.inserted_id;
        let result = self
            .db
            .collection::<Ninja>("ninjas")
            .find_one(doc! { id }, None)
            .await;
        result
    }
    async fn get_ninja_by_id(&self, id: String) -> Result<Option<Ninja>, mongodb::error::Error> {
        let result = self
            .db
            .collection::<Ninja>("ninjas")
            .find_one(doc! { id }, None)
            .await;
        result
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
