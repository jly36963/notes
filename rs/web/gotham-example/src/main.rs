#[macro_use]
extern crate gotham_derive;

use gotham::handler::HandlerResult;
use gotham::helpers::http::response::{
    create_empty_response, create_permanent_redirect, create_response,
};
use gotham::hyper::{body, Body, Response, StatusCode};
use gotham::router::builder::*;
use gotham::router::Router;
use gotham::state::{FromState, State};
use mime;
use serde::{Deserialize, Serialize};

// ---
// Main
// ---

fn main() {
    let addr = "127.0.0.1:5000";
    println!("Serving on {}", addr);
    gotham::start(addr, || Ok(get_router()));
}

// ---
// Router
// ---

fn get_router() -> Router {
    build_simple_router(|route| {
        route.get("/").to(get_root);
        route.scope("/api", |route| {
            route.get("/").to(get_api);
            route.get("/health").to(get_api_health);
            route.get("/health-check").to(get_api_health_check);
            route
                .get("/store/search")
                .with_query_string_extractor::<StoreSearchQuery>()
                .to(get_api_store_search);
            route.scope("/user", |route| {
                route
                    .get("/:id")
                    .with_path_extractor::<UserIdPathParams>()
                    .to(get_api_user_id);
                route.post("/").to_async(post_api_user);
            })
        })
    })
}

// ---
// Handlers
// ---

// GET /
// return String
pub fn get_root(state: State) -> (State, &'static str) {
    (state, "Hello!")
}

// GET /api
// return json
pub fn get_api(state: State) -> (State, Response<Body>) {
    #[derive(Serialize, Deserialize)]
    struct Data {
        message: String,
    }
    let data = Data {
        message: String::from("Hello!"),
    };
    let body = serde_json::to_string(&data).unwrap();
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    (state, res)
}

// GET /api/health
// return status code
pub fn get_api_health(state: State) -> (State, Response<Body>) {
    let res = create_empty_response(&state, StatusCode::OK);
    (state, res)
}

// GET /api/health-check
// redirect to /api/health
pub fn get_api_health_check(state: State) -> (State, Response<Body>) {
    let res = create_permanent_redirect(&state, "/api/health");
    (state, res)
}

// GET /api/store/search
// return query params
pub fn get_api_store_search(mut state: State) -> (State, Response<Body>) {
    let query = StoreSearchQuery::take_from(&mut state);
    #[derive(Serialize, Deserialize)]
    struct Data {
        q: String,
    }
    let data = Data { q: query.q };
    let body = serde_json::to_string(&data).unwrap();
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    (state, res)
}

// GET /api/user/:id
// return (mock) user
pub fn get_api_user_id(state: State) -> (State, Response<Body>) {
    let path_params = UserIdPathParams::borrow_from(&state);
    let id = &path_params.id;
    let user = User {
        id: String::from(id),
        first_name: String::from("Kakashi"),
        last_name: String::from("Hatake"),
    };
    let body = serde_json::to_string(&user);
    let res: Response<Body>;
    match body {
        Ok(body) => res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body),
        Err(_) => res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR),
    }
    (state, res)
}

// POST /api/user
// (pretend) create new user
// async handler example -- https://github.com/gotham-rs/gotham/blob/gotham-0.6.0/examples/handlers/simple_async_handlers_await/src/main.rs
pub async fn post_api_user(mut state: State) -> HandlerResult {
    // Get body
    let body: String;
    match body::to_bytes(Body::take_from(&mut state)).await {
        Ok(valid_body) => body = String::from_utf8(valid_body.to_vec()).unwrap(),
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    }
    // Convert body to struct
    let user_new: UserNew;
    match serde_json::from_str(&body) {
        Ok(u) => user_new = u, // res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, user)
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    }

    // Create pretend user from input
    let user = User {
        id: String::from("b78984aa-f014-45d2-b884-49450f29758a"),
        first_name: user_new.first_name,
        last_name: user_new.last_name,
    };

    // Serialize pretend user
    let data: String;
    match serde_json::to_string(&user) {
        Ok(s) => data = s,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    }

    // Return Response
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, data);
    Ok((state, res))
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

#[derive(Deserialize, StateData, StaticResponseExtender)]
struct StoreSearchQuery {
    q: String,
}

#[derive(Deserialize, StateData, StaticResponseExtender)]
struct UserIdPathParams {
    id: String,
}
