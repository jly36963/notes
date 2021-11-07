#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate nickel;
extern crate hyper;

use nickel::status::StatusCode;
use nickel::{HttpRouter, JsonBody, MediaType, Nickel};
use serde::{Deserialize, Serialize};

#[tokio::main]
async fn main() {
    // create server
    let mut server = Nickel::new();
    // add middleware
    server.utilize(middleware! { |req|
        let method = &req.origin.method;
        let url = &req.origin.uri;
        println!("{} {}", method, url);
    });
    // add routes
    add_routes(&mut server);
    // start server
    server.listen("127.0.0.1:5000").unwrap();
}

#[cfg_attr(rustfmt, rustfmt_skip)]
fn add_routes(server: &mut nickel::Nickel) {
    // GET /api
    // return json
    server.get("/", middleware! { |_, mut res|
        res.set(MediaType::Json);
        res.set(StatusCode::Ok);
        r#"{"message": "Hello World"}"#
    });

    // GET /api/health
    // return status code
    server.get("/health", middleware! { |_, mut res|
        res.set(StatusCode::Ok);
    });

    // GET /api/store/search
    // return query params
    server.get("/store/search", middleware! { |req, res| 
        let q = req.param("q").unwrap_or("");
        format!(r#"{{"q": {} }}"#, q)
    });

    // GET /api/user/:id
    // return (mock) user
    server.get("/user/:id", middleware! { |req, mut res| 
        let id = String::from(req.param("id").unwrap_or("1234"));
        let user = User {
            id,
            first_name: String::from("Kakashi"),
            last_name: String::from("Hatake"),
        };
        let s = serde_json::to_string(&user);
        match s {
            Ok(s) => {
                res.set(MediaType::Json);
                s
            },
            Err(_) => { 
                res.set(StatusCode::InternalServerError); 
                String::from("Internal Server Error")
            }
        }
    });

    // POST /api/user
    // (pretend) create new user
    server.post("/user", middleware! { |req, mut res| 
        let user_new = req.json_as::<UserNew>().unwrap(); // TODO: handle this
        let user = User {
            id: String::from("b78984aa-f014-45d2-b884-49450f29758a"),
            first_name: user_new.first_name,
            last_name: user_new.last_name,
        };
        let s = serde_json::to_string(&user);
        match s {
            Ok(s) => {
                res.set(MediaType::Json);
                s
            },
            Err(_) => { 
                res.set(StatusCode::InternalServerError); 
                String::from("Internal Server Error")
            }
        }
    });

    // Catch all
    server.get("**", middleware! { |_, mut res| 
        res.set(StatusCode::NotFound);
    });
}

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

// MISSING:
// redirect to another endpoint
// mount a router (with a route prefix)

// TODO:
// handle files

// docs:
// middleware -- https://docs.rs/nickel/0.11.0/nickel/macro.middleware.html
// tokio -- https://github.com/tokio-rs/tokio
