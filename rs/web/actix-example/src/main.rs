use actix_web::{get, middleware, post, web, App, HttpRequest, HttpResponse, HttpServer};
use serde::{Deserialize, Serialize};

// ---
// Main
// ---

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let addr = "127.0.0.1:3000";
    println!("Serving on {}", addr);

    HttpServer::new(|| {
        App::new()
            // Logger middleware
            .wrap(middleware::Logger::default())
            // Limit size of payload (global config)
            .app_data(web::JsonConfig::default().limit(4096))
            // Add routes
            .service(get_index)
            .service(get_api)
            .service(get_api_health)
            .service(web::redirect("/api/health-check", "/api/health"))
            .service(get_api_store_search)
            .service(get_api_user_id)
            .service(post_api_user)
    })
    .bind(addr)?
    .run()
    .await
}

// ---
// Handlers
// ---

/// Return "Hello"
#[get("/")]
async fn get_index(_: HttpRequest) -> &'static str {
    "Hello!"
}

/// Return simple JSON
#[get("/api")]
async fn get_api(_: HttpRequest) -> HttpResponse {
    #[derive(Serialize, Deserialize)]
    struct Data {
        message: String,
    }

    HttpResponse::Ok().json(Data {
        message: String::from("Hello, world!"),
    })
}

/// Return 200 status code
#[get("/api/health")]
async fn get_api_health(_: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().finish()
}

/// Return query "q" param
#[get("/api/store/search")]
async fn get_api_store_search(query: web::Query<StoreSearchQuery>) -> HttpResponse {
    let q = query.q.clone();
    HttpResponse::Ok().json(StoreSearchQuery { q })
}

/// Return (mock) user
#[get("/api/user/{id}")]
async fn get_api_user_id(path: web::Path<String>) -> HttpResponse {
    let id = path.into_inner();
    HttpResponse::Ok().json(User {
        id,
        first_name: String::from("Kakashi"),
        last_name: String::from("Hatake"),
    })
}

/// Pretend to create new user
#[post("/api/user")]
async fn post_api_user(user_new: web::Json<UserNew>) -> HttpResponse {
    HttpResponse::Ok().json(User {
        id: String::from("b78984aa-f014-45d2-b884-49450f29758a"),
        first_name: user_new.first_name.clone(),
        last_name: user_new.last_name.clone(),
    })
}

// ---
// Types
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

#[derive(Debug, Serialize, Deserialize)]
struct StoreSearchQuery {
    q: String,
}
