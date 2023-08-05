use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::Redirect,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::net::SocketAddr;

// ---
// Main
// ---

#[tokio::main]
async fn main() {
    let port = 3000;
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    println!("Serving on {}", addr);

    let app = Router::new()
        .route("/", get(get_index))
        .route("/api", get(get_api))
        .route("/api/health", get(get_api_health))
        .route("/api/health-check", get(redirect_api_health))
        .route("/api/store/search", get(get_api_store_search))
        .route("/api/user/:id", get(get_api_user_id))
        .route("/api/user", post(post_api_user));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// ---
// Handlers
// ---

/// GET "/"
/// Return "Hello"
async fn get_index() -> (StatusCode, &'static str) {
    (StatusCode::OK, "Hello, world!")
}

/// GET "/api"
/// Return simple JSON
async fn get_api() -> (StatusCode, Json<GetApiData>) {
    let res = GetApiData {
        message: "Hello, world!".into(),
    };
    (StatusCode::OK, Json(res))
}

/// GET "/api/health"
/// Return 200 status code
async fn get_api_health() -> StatusCode {
    StatusCode::OK
}

/// GET "/api/health-check"
/// Redirect to "api/health"
async fn redirect_api_health() -> Redirect {
    Redirect::permanent("/api/health")
}

/// GET "/api/store/search"
/// Return query "q" param
async fn get_api_store_search(
    Query(query): Query<HashMap<String, String>>,
) -> (StatusCode, Json<StoreSearchQuery>) {
    let q: String = query.get("q").unwrap_or(&"".to_string()).to_string();
    (StatusCode::OK, Json(StoreSearchQuery { q }))
}

/// GET "api/users/:id"
/// Return (mock) user
async fn get_api_user_id(Path(id): Path<String>) -> (StatusCode, Json<User>) {
    let user = User {
        id,
        first_name: String::from("Kakashi"),
        last_name: String::from("Hatake"),
    };
    (StatusCode::OK, Json(user))
}

/// POST "api/users"
/// Pretend to create new user
async fn post_api_user(Json(user_new): Json<UserNew>) -> (StatusCode, Json<User>) {
    let user = User {
        id: "b78984aa-f014-45d2-b884-49450f29758a".to_string(),
        first_name: user_new.first_name,
        last_name: user_new.last_name,
    };
    (StatusCode::OK, Json(user))
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

#[derive(Serialize, Deserialize)]
struct GetApiData {
    message: String,
}
