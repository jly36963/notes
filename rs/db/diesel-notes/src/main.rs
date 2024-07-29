use providers::pg;
use providers::pg::{get_pg_pool, TPostgresDAL};
mod providers;
pub mod types;
use types::jutsu::{JutsuNew, JutsuUpdates};
use types::ninja::{NinjaNew, NinjaUpdates};
use uuid::Uuid;

#[tokio::main]
async fn main() {
    // Connection
    let pg_conn_str = "postgresql://postgres:postgres@localhost:5432/practice";
    let pool = get_pg_pool(pg_conn_str);

    // Set up providers
    let providers = providers::Providers {
        pgdal: pg::PostgresDAL { pool },
    };

    // Create ninja
    let ninja_new = NinjaNew {
        id: Uuid::new_v4(),
        first_name: "Kakashi".to_string(),
        last_name: "Hatake".to_string(),
        age: 27,
    };
    let ninja = providers.pgdal.create_ninja(ninja_new).unwrap().unwrap();
    println!("Create ninja result: {:#?}", ninja);
    let ninja_id = ninja.id;

    // Select ninja
    let ninja = providers
        .pgdal
        .get_ninja(ninja_id.clone())
        .unwrap()
        .unwrap();
    println!("Select ninja result: {:#?}", ninja);

    // Update ninja
    let ninja_updates = NinjaUpdates {
        first_name: None,
        last_name: Some("Sensei".to_string()),
        age: None,
    };
    let ninja = providers
        .pgdal
        .update_ninja(ninja_id.clone(), ninja_updates)
        .unwrap()
        .unwrap();
    println!("Update ninja result: {:#?}", ninja);

    // Create jutsu
    let jutsu_new = JutsuNew {
        id: Uuid::new_v4(),
        name: "Chidori".to_string(),
        description: "Plover / a thousand birds".to_string(),
        chakra_nature: "Lightning".to_string(),
    };
    let jutsu = providers.pgdal.create_jutsu(jutsu_new).unwrap().unwrap();
    println!("Create jutsu result: {:#?}", jutsu);
    let jutsu_id = jutsu.id;

    // Select jutsu
    let jutsu = providers
        .pgdal
        .get_jutsu(jutsu_id.clone())
        .unwrap()
        .unwrap();
    println!("Select jutsu result: {:#?}", jutsu);

    // Update jutsu
    let jutsu_updates = JutsuUpdates {
        name: None,
        description: Some("Lightning blade".to_string()),
        chakra_nature: None,
    };
    let jutsu = providers
        .pgdal
        .update_jutsu(jutsu_id.clone(), jutsu_updates)
        .unwrap()
        .unwrap();
    println!("Update jutsu result: {:#?}", jutsu);

    // Associate ninja & jutsu
    providers
        .pgdal
        .associate_ninja_and_jutsu(ninja_id.clone(), jutsu_id.clone())
        .unwrap();
    println!("Associate ninja and jutsu result: ok");

    // Get ninja with jutsus
    let ninja_and_jutsus = providers
        .pgdal
        .get_ninja_and_jutsus(ninja_id.clone())
        .unwrap()
        .unwrap();
    println!("Select ninja and jutsus result: {:#?}", ninja_and_jutsus);

    // Dissociate ninja & jutsu
    providers
        .pgdal
        .dissociate_ninja_and_jutsu(ninja_id.clone(), jutsu_id.clone())
        .unwrap();
    println!("Dissociate ninja and jutsu result: ok");

    // Get ninja with jutsus (post dissociation)
    let ninja_and_jutsus = providers
        .pgdal
        .get_ninja_and_jutsus(ninja_id.clone())
        .unwrap()
        .unwrap();
    println!(
        "Select ninja and jutsus (post dissociation) result: {:#?}",
        ninja_and_jutsus
    );

    // Delete ninja
    let ninja = providers
        .pgdal
        .delete_ninja(ninja_id.clone())
        .unwrap()
        .unwrap();
    println!("Delete ninja result: {:#?}", ninja);

    // Delete jutsu
    let jutsu = providers.pgdal.delete_jutsu(jutsu.id).unwrap().unwrap();
    println!("Delete jutsu result: {:#?}", jutsu);
}
