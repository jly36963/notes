extern crate hyper;
extern crate iron;
extern crate params;
extern crate router;

use iron::prelude::*;
use serde::{Deserialize, Serialize};

#[cfg_attr(rustfmt, rustfmt_skip)]
fn main() {
    // Create router
    let mut router = router::Router::new();
    // Register handlers
    router.get("/api", get_api, "/api");
    router.get("/api/health", get_api_health, "/api/health");
    router.get("/api/health-check", get_api_health_check, "/api/health-check",);
    router.get("/api/store/search", get_api_store_search, "/api/store/search",);
    router.get("/api/user/:id", get_api_user_id, "/api/user/:id");
    // Start router
    let host = String::from("127.0.0.1");
    let port = String::from("5000");
    let authority = format!("{}:{}", host, port);
    println!("Starting server: {}",  authority);
    Iron::new(router).http(authority).unwrap();
}

// ---
// Routes
// ---

// GET /api
// Return JSON message
fn get_api(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((
        iron::modifiers::Header(iron::headers::ContentType::json()),
        iron::status::Status::Ok,
        r#"{ "message": "Hello!" }"#,
    )))
}

// GET /api/health
// Return status code
fn get_api_health(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((iron::status::Status::Ok,)))
}

// GET /api/health-check
// Redirect to /health
fn get_api_health_check(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((
        iron::status::Status::Found,
        iron::modifiers::Redirect(iron::Url::parse("/api/health").unwrap()),
        // not working -- how to use relative url?
    )))
}

// GET /api/store/search
// return query string
fn get_api_store_search(req: &mut Request) -> IronResult<Response> {
    let query_params = req.get_ref::<params::Params>().unwrap();
    let q = match query_params.find(&["q"]) {
        Some(&params::Value::String(ref value)) => value,
        _ => "",
    };
    Ok(Response::with((
        iron::modifiers::Header(iron::headers::ContentType::json()),
        iron::status::Status::Ok,
        format!(r#"{{ "q": "{}" }}"#, q),
    )))
}

// GET /api/user/:id
// return fake user
fn get_api_user_id(req: &mut Request) -> IronResult<Response> {
    // Use path params
    let params = req.extensions.get::<router::Router>().unwrap();
    let id = params.find("id").unwrap();
    // Get fake user
    let user = User {
        id: id.to_string(),
        first_name: "Kakashi".to_string(),
        last_name: "Hatake".to_string(),
    };
    // Attempt to serialize
    let s = match serde_json::to_string(&user) {
        Ok(s) => s,
        Err(_) => {
            return Ok(Response::with((
                iron::modifiers::Header(iron::headers::ContentType::json()),
                iron::status::Status::InternalServerError,
            )))
        }
    };
    // Return fake user
    Ok(Response::with((
        iron::modifiers::Header(iron::headers::ContentType::json()),
        iron::status::Status::Ok,
        s,
    )))
}

// POST /api/user
// pretend create user
// TODO

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
