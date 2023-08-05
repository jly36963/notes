#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket::config::{Config, Environment};
use rocket::data::{self, FromDataSimple};
use rocket::http::RawStr;
use rocket::http::{ContentType, Status};
use rocket::response::content;
use rocket::response::Redirect;
use rocket::{Data, Outcome, Outcome::*, Request};
use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};
use std::io::Read;

fn main() {
    /*
    // default config (uses Rocket.toml & env vars)
    // https://rocket.rs/v0.4/guide/configuration/
    rocket::ignite()
        .mount("/", routes![health, root])
        .register(catchers![not_found])
        .launch();
    */

    // custom config (ignores Rocket.toml & env vars)
    // https://rocket.rs/v0.4/guide/configuration/#programmatic
    let config = Config::build(Environment::Staging)
        .address("localhost")
        .port(5000)
        .finalize()
        .unwrap();

    rocket::custom(config)
        .mount(
            "/api",
            routes![root, health_check, health, search, get_user, create_user],
        )
        .register(catchers![not_found, internal_error])
        .launch();
}

// GET /api
// return json
#[get("/")]
fn root() -> content::Json<&'static str> {
    content::Json("{ 'message': 'Hello world!' }")
}

// GET /api/health-check
// redirect
// docs: https://api.rocket.rs/v0.4/rocket/response/struct.Redirect.html
// docs: https://api.rocket.rs/v0.4/rocket/macro.uri.html
#[get("/health-check")]
fn health_check() -> Redirect {
    Redirect::to(uri!("/api", health)) // not working (?)
}

// GET /api/health
// return status code
#[get("/health")]
fn health() -> Status {
    Status::Ok
}

// GET /api/store/search
// return query params
#[derive(Serialize)]
struct SearchQuery {
    q: Option<String>,
}

#[get("/store/search?<q>")]
fn search(q: Option<String>) -> Json<SearchQuery> {
    Json(SearchQuery { q: q })
}

// GET /api/user/:id
// return (mock) user
#[derive(Serialize)]
struct User {
    id: String,
    first_name: String,
    last_name: String,
}
#[get("/user/<id>")]
fn get_user(id: &RawStr) -> Json<User> {
    Json(User {
        id: id.to_string(),
        first_name: String::from("Kakashi"),
        last_name: String::from("Hatake"),
    })
}

// POST /api/user
// (pretend) create new user
// requires FromData/FromDataSimple trait
// docs: https://api.rocket.rs/v0.4/rocket/data/trait.FromData.html
// docs: https://api.rocket.rs/v0.4/rocket/data/trait.FromDataSimple.html
#[derive(Serialize, Deserialize, Debug)]
struct UserNew {
    first_name: String,
    last_name: String,
}
impl FromDataSimple for UserNew {
    type Error = String;

    fn from_data(req: &Request, data: Data) -> data::Outcome<Self, String> {
        // ensure the content type is correct before opening data
        let ct = ContentType::new("application", "json");
        if req.content_type() != Some(&ct) {
            return Outcome::Forward(data);
        }
        // read the data into a String
        // always use limit to prevent DoS attacks
        const LIMIT: u64 = 256;
        let mut string = String::new();
        if let Err(e) = data.open().take(LIMIT).read_to_string(&mut string) {
            return Failure((Status::InternalServerError, format!("{:?}", e)));
        }
        let result = serde_json::from_str(&string);
        match result {
            Ok(u) => return Success(u),
            Err(_) => return Failure((Status::BadRequest, "".into())),
        }
    }
}
#[post("/user", format = "application/json", data = "<input>")]
fn create_user(input: UserNew) -> Json<User> {
    Json(User {
        id: String::from("b78984aa-f014-45d2-b884-49450f29758a"),
        first_name: input.first_name,
        last_name: input.last_name,
    })
}

// Catchers
// https://api.rocket.rs/v0.4/rocket/struct.Catcher.html#code-generation

#[catch(404)]
fn not_found() -> &'static str {
    "Not Found"
}

#[catch(500)]
fn internal_error() -> &'static str {
    "Internal Error"
}
