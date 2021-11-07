use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::net::IpAddr;
use std::str::FromStr;
use warp::Filter;

// ---
// Main
// ---

#[tokio::main]
async fn main() {
    // Config
    let host = String::from("127.0.0.1");
    let ip = IpAddr::from_str(&host).unwrap();
    let port = 5000;
    // Routes
    let routes = get_routes();
    // Serve
    println!("Server started on {}:{}", host, port);
    warp::serve(routes).run((ip, port)).await;
}

// ---
// Routes
// ---

// https://github.com/seanmonstar/warp/blob/master/examples/routing.rs

fn get_routes() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    // GET /
    // return String
    let hello_world = warp::path::end().map(|| "Hello, World!");

    // GET /api
    // return json
    let get_api = warp::path!("api").map(|| {
        #[derive(Serialize, Deserialize)]
        struct Data {
            message: String,
        }
        let data = Data {
            message: "Hello!".to_string(),
        };
        warp::reply::json(&data)
    });

    // GET /api/health
    // return status code
    let get_api_health = warp::path!("api" / "health").map(|| warp::http::StatusCode::OK);

    // GET /api/health-check
    // redirect to /api/health
    // TODO

    // GET /api/store/search
    // return query params
    // https://github.com/seanmonstar/warp/blob/master/examples/query_string.rs
    let get_api_store_search = warp::path!("api" / "store" / "search")
        .and(warp::query::<HashMap<String, String>>())
        .map(|p: HashMap<String, String>| {
            let q: String;
            match p.get("q") {
                Some(value) => q = value.to_string(),
                None => q = String::from(""),
            };
            // let q: String = p.get("q").unwrap_or(&String::from("")).to_string();
            #[derive(Serialize, Deserialize)]
            struct Data {
                q: String,
            }
            let data = Data { q: q.to_string() };
            warp::reply::json(&data)
        });

    // GET /api/user/:id
    // return (mock) user
    let get_api_user_id = warp::path!("api" / "user" / String).map(|id| {
        let user = User {
            id,
            first_name: String::from("Kakashi"),
            last_name: String::from("Hatake"),
        };
        warp::reply::json(&user)
    });

    // POST /api/user
    // (pretend) create new user
    let post_api_user = warp::path!("api" / "user")
        .and(warp::post())
        .and(warp::body::content_length_limit(1024 * 16))
        .and(warp::body::json())
        .map(|user_new: UserNew| {
            let user = User {
                id: String::from("b78984aa-f014-45d2-b884-49450f29758a"),
                first_name: user_new.first_name,
                last_name: user_new.last_name,
            };
            warp::reply::json(&user)
        });

    // Catch all
    // TODO

    // return routes
    let routes = warp::get()
        .and(hello_world)
        .or(get_api)
        .or(get_api_health)
        .or(get_api_store_search)
        .or(get_api_user_id)
        .or(post_api_user);
    return routes;
}

// ---
// Structs
// ---

#[derive(Serialize, Deserialize)]
struct User {
    id: String,
    first_name: String,
    last_name: String,
}

#[derive(Serialize, Deserialize)]
struct UserNew {
    first_name: String,
    last_name: String,
}
