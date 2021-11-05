use providers::pg;
use providers::pg::TPostgresDAL;
use sqlx;
use sqlx::postgres::PgPoolOptions;
mod providers;
mod types;

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
    // Set up providers
    let providers = providers::Providers {
        pgdal: pg::PostgresDAL { pg_pool },
    };

    // Create ninja
    let ninja_new = types::NinjaNew {
        first_name: "Kakashi".to_string(),
        last_name: "Hatake".to_string(),
        age: 27,
    };
    let ninja = providers.pgdal.create_ninja(ninja_new).await.unwrap();
    println!("Create ninja result: {:#?}", ninja);
    let ninja_id = ninja.id;

    // Select ninja
    let ninja = providers.pgdal.get_ninja(ninja_id.clone()).await.unwrap();
    println!("Select ninja result: {:#?}", ninja);

    // Update ninja
    let ninja_updates = types::NinjaUpdates {
        first_name: None,
        last_name: Some("Sensei".to_string()),
        age: None,
    };
    let ninja = providers
        .pgdal
        .update_ninja(ninja_id.clone(), ninja_updates)
        .await
        .unwrap();
    println!("Update ninja result: {:#?}", ninja);

    // Create jutsu
    let jutsu_new = types::JutsuNew {
        name: "Chidori".to_string(),
        description: "Plover / a thousand birds".to_string(),
        chakra_nature: "Lightning".to_string(),
    };
    let jutsu = providers.pgdal.create_jutsu(jutsu_new).await.unwrap();
    println!("Create jutsu result: {:#?}", jutsu);
    let jutsu_id = jutsu.id;

    // Select jutsu
    let jutsu = providers.pgdal.get_jutsu(jutsu_id.clone()).await.unwrap();
    println!("Select jutsu result: {:#?}", jutsu);

    // Update jutsu
    let jutsu_updates = types::JutsuUpdates {
        name: None,
        description: Some("Lightning blade".to_string()),
        chakra_nature: None,
    };
    let jutsu = providers
        .pgdal
        .update_jutsu(jutsu_id.clone(), jutsu_updates)
        .await
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
    println!("result: {:#?}", ninja);

    // Delete jutsu
    let jutsu = providers.pgdal.delete_jutsu(jutsu.id).await.unwrap();
    println!("result: {:#?}", jutsu);
}
