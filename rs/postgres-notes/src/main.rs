mod providers;
mod types;

use bb8::Pool;
use bb8_postgres::PostgresConnectionManager;
use providers::pg;
use providers::pg::TPostgresDAL;
use std::str::FromStr;
use tokio_postgres::NoTls;

#[tokio::main]
async fn main() {
    // Connection
    let pg_conn_str = "postgresql://postgres:postgres@localhost:5432/practice";
    let pg_config = tokio_postgres::config::Config::from_str(pg_conn_str).unwrap();
    let pg_manager = PostgresConnectionManager::new(pg_config, NoTls);
    let pg_pool = Pool::builder().build(pg_manager).await.unwrap();
    // Set up providers
    let providers = providers::Providers {
        pgdal: pg::PostgresDAL { pg_pool },
    };

    // Create ninja
    let ninja_new = types::NinjaNew {
        first_name: String::from("Kakashi"),
        last_name: String::from("Hatake"),
        age: 27,
    };
    let ninja = providers
        .pgdal
        .create_ninja(ninja_new)
        .await
        .unwrap()
        .unwrap();
    println!("Create ninja result: {:#?}", ninja);
    let ninja_id = ninja.id;

    // Select ninja
    let ninja = providers.pgdal.get_ninja(ninja_id.clone()).await.unwrap();
    println!("Select ninja result: {:#?}", ninja);

    // Update ninja
    let ninja_updates = types::NinjaUpdates {
        first_name: None,
        last_name: Some(String::from("Sensei")),
        age: None,
    };
    let ninja = providers
        .pgdal
        .update_ninja(ninja_id.clone(), ninja_updates)
        .await
        .unwrap()
        .unwrap();
    println!("Update ninja result: {:#?}", ninja);

    // Create jutsu
    let jutsu_new = types::JutsuNew {
        name: String::from("Chidori"),
        description: String::from("Plover / a thousand birds"),
        chakra_nature: String::from("Lightning"),
    };
    let jutsu = providers
        .pgdal
        .create_jutsu(jutsu_new)
        .await
        .unwrap()
        .unwrap();
    println!("Create jutsu result: {:#?}", jutsu);
    let jutsu_id = jutsu.id;

    // Select jutsu
    let jutsu = providers
        .pgdal
        .get_jutsu(jutsu_id.clone())
        .await
        .unwrap()
        .unwrap();
    println!("Select jutsu result: {:#?}", jutsu);

    // Update jutsu
    let jutsu_updates = types::JutsuUpdates {
        name: None,
        description: Some(String::from("Lightning blade")),
        chakra_nature: None,
    };
    let jutsu = providers
        .pgdal
        .update_jutsu(jutsu_id.clone(), jutsu_updates)
        .await
        .unwrap()
        .unwrap();
    println!("Update jutsu result: {:#?}", jutsu);

    // Associate ninja & jutsu
    let _ = providers
        .pgdal
        .associate_ninja_and_jutsu(ninja_id.clone(), jutsu_id.clone())
        .await;
    println!("Associate ninja and jutsu result: ok");

    // Get ninja with jutsus
    let ninja = providers
        .pgdal
        .get_ninja_with_jutsus(ninja_id.clone())
        .await
        .unwrap();
    println!("Select ninja with jutsus result: {:#?}", ninja);

    // Dissociate ninja & jutsu
    let _ = providers
        .pgdal
        .dissociate_ninja_and_jutsu(ninja_id.clone(), jutsu_id.clone())
        .await;
    println!("Dissociate ninja and jutsu result: ok");

    // Get ninja with jutsus (post dissociation)
    let ninja = providers
        .pgdal
        .get_ninja_with_jutsus(ninja_id.clone())
        .await
        .unwrap();
    println!(
        "Select ninja with jutsus (post dissociation) result: {:#?}",
        ninja
    );

    // Delete ninja
    let ninja = providers
        .pgdal
        .delete_ninja(ninja_id.clone())
        .await
        .unwrap();
    println!("Delete ninja result: {:#?}", ninja);

    // Delete jutsu
    let jutsu = providers.pgdal.delete_jutsu(jutsu.id).await.unwrap();
    println!("Delete jutsu result: {:#?}", jutsu);
}
