mod types;
use reqwest;

#[tokio::main]
async fn main() {
    // Setup
    let base_url = "https://jsonplaceholder.typicode.com";
    let client = reqwest::Client::new();

    // Create person
    let person: types::Person = client
        .post(format!("{}/users/", base_url))
        .json(&types::PersonNew {
            name: String::from("Kakashi Hatake"),
            username: String::from("kakashi"),
        })
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Create person result: {:#?}", person);
    let person_id = 10;

    // Select person
    let person: types::Person = client
        .get(format!("{}/users/{}/", base_url, person_id.clone()))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Select person result: {:#?}", person);

    // Update person
    let person: types::Person = client
        .put(format!("{}/users/{}/", base_url, person_id.clone()))
        .json(&types::PersonUpdates {
            name: Some(String::from("Kaka Sensei")),
            username: Some(String::from("kaka")),
        })
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Update person result: {:#?}", person);

    // Delete person
    client
        .delete(format!("{}/users/{}/", base_url, person_id.clone()))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap();

    println!("Delete person result: ok");
}
