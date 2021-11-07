use actix_web::{get, middleware, post, web, App, HttpRequest, HttpResponse, HttpServer};
use serde::{Deserialize, Serialize};

// ---
// main
// ---

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let addr = "127.0.0.1:8080";
    println!("Serving on {}", addr);
    HttpServer::new(|| {
        App::new()
            // logger middleware
            .wrap(middleware::Logger::default())
            // limit size of payload (global config)
            .data(web::JsonConfig::default().limit(4096))
            // routes
            .service(get_index)
            .service(get_api)
            .service(get_api_health)
            .service(get_api_health_check)
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

// GET /
// return String
#[get("/")]
async fn get_index(_: HttpRequest) -> &'static str {
    "Hello!"
}

// GET /api
// return json
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

// GET /api/health
// return status code
#[get("/api/health")]
async fn get_api_health(_: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().finish()
}

// GET /api/health-check
// redirect to /api/health
#[get("/api/health-check")]
async fn get_api_health_check(_: HttpRequest) -> HttpResponse {
    HttpResponse::Found()
        .header("Location", "/api/health")
        .finish()
}

// GET /api/store/search
// return query params
// https://stackoverflow.com/a/58055305
#[get("/api/store/search")]
async fn get_api_store_search(query: web::Query<StoreSearchQuery>) -> HttpResponse {
    HttpResponse::Ok().json(StoreSearchQuery { q: query.q.clone() })
}

// GET /api/user/:id
// return (mock) user
#[get("/api/user/{id}")]
async fn get_api_user_id(web::Path(id): web::Path<String>) -> HttpResponse {
    HttpResponse::Ok().json(User {
        id: String::from(id),
        first_name: String::from("Kakashi"),
        last_name: String::from("Hatake"),
    })
}

// POST /api/user
// (pretend) create new user
// https://github.com/actix/examples/blob/master/json/json/src/main.rs
#[post("/api/user")]
async fn post_api_user(user_new: web::Json<UserNew>) -> HttpResponse {
    HttpResponse::Ok().json(User {
        id: String::from("b78984aa-f014-45d2-b884-49450f29758a"),
        first_name: user_new.first_name.clone(),
        last_name: user_new.last_name.clone(),
    })
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

#[derive(Debug, Serialize, Deserialize)]
struct StoreSearchQuery {
    q: String,
}
