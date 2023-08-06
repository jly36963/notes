use async_trait::async_trait;
use mongodb::{
    bson::{doc, Bson},
    options::{ClientOptions, FindOneAndUpdateOptions},
    Client,
};
use serde::{Deserialize, Serialize};

// ---
// Main
// ---

#[tokio::main]
async fn main() {
    // Connection
    let mongo_conn = String::from("mongodb://root:example@localhost:27017");
    let client_options = ClientOptions::parse(mongo_conn).await.unwrap();
    let client = Client::with_options(client_options).unwrap();
    let db = client.database("practice");
    // Create instance of DAL
    let mongo_dal = MongoDAL { db };

    // ---
    // Ninjas
    // ---

    // Insert one
    println!("insert_one example");
    let ninja_new = NinjaNew {
        first_name: "Kakashi".to_string(),
        last_name: "Hatake".to_string(),
        age: 27,
    };
    let result = mongo_dal.create_ninja(ninja_new).await;
    let _id = result.unwrap().unwrap()._id;
    println!("Ninja insert_one result: {}", _id);

    // Find one
    println!("find_one example");
    let result = mongo_dal.get_ninja_by_id(_id).await;
    let ninja = result.unwrap().unwrap();
    println!("Ninja find_one result: {:#?}", ninja);

    // Update one
    println!("find_one_and_update example");
    let result = mongo_dal.update_ninja_last_name(ninja._id, "Sensei".to_string()).await;
    let ninja = result.unwrap().unwrap();
    println!("Ninja find_one_and_update result: {:#?}", ninja);

    // Delete one
    println!("find_one_and_delete example");
    let result = mongo_dal.delete_ninja(ninja._id).await;
    let ninja = result.unwrap().unwrap();
    println!("Ninja delete result: {:#?}", ninja);

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

struct MongoDAL {
    db: mongodb::Database,
}

#[async_trait]
pub trait TMongoDAL {
    async fn create_ninja(&self, ninja: NinjaNew) -> Result<Option<Ninja>, mongodb::error::Error>;
    async fn get_ninja_by_id(&self, _id: Bson) -> Result<Option<Ninja>, mongodb::error::Error>;
    async fn update_ninja_last_name(&self, _id: Bson, last_name: String) -> Result<Option<Ninja>, mongodb::error::Error>;
    async fn delete_ninja(&self, _id: Bson) -> Result<Option<Ninja>, mongodb::error::Error>;
}

#[async_trait]
impl TMongoDAL for MongoDAL {
    async fn create_ninja(&self, ninja_new: NinjaNew) -> Result<Option<Ninja>, mongodb::error::Error> {
        // Insert ninja
        let result = self.db.collection::<NinjaNew>("ninjas").insert_one(ninja_new, None).await?;
        // Get newly inserted ninja (TODO: combine into single operation?)
        let _id = result.inserted_id;
        let result = self.db.collection::<Ninja>("ninjas").find_one(doc! { "_id": _id }, None).await;
        result
    }
    async fn get_ninja_by_id(&self, _id: Bson) -> Result<Option<Ninja>, mongodb::error::Error> {
        let result = self.db.collection::<Ninja>("ninjas").find_one(doc! { "_id": _id }, None).await;
        result
    }
    async fn update_ninja_last_name(&self, _id: Bson, last_name: String) -> Result<Option<Ninja>, mongodb::error::Error> {
        let result = self
            .db
            .collection::<Ninja>("ninjas")
            .find_one_and_update(
                doc! { "_id": _id },
                doc! { "$set": { "last_name": last_name }},
                FindOneAndUpdateOptions::builder()
                    .return_document(mongodb::options::ReturnDocument::After)
                    .build(),
            )
            .await;
        result
    }
    async fn delete_ninja(&self, _id: Bson) -> Result<Option<Ninja>, mongodb::error::Error> {
        let result = self.db.collection::<Ninja>("ninjas").find_one_and_delete(doc! { "_id": _id }, None).await;
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
    _id: mongodb::bson::Bson,
    first_name: String,
    last_name: String,
    age: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NinjaUpdates {
    first_name: Option<String>,
    last_name: Option<String>,
    age: Option<i32>,
}
