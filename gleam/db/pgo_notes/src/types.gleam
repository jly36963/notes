import gleam/dynamic
import gleam/json
import gleam/option
import snag
import snag_utils.{as_snag_result}

// ---
// Json
// ---

pub type Decoder(a) =
  fn(dynamic.Dynamic) -> Result(a, List(dynamic.DecodeError))

// ---
// Ninja
// ---

pub type Ninja {
  Ninja(
    id: String,
    first_name: String,
    last_name: String,
    age: Int,
    jutsus: option.Option(List(Jutsu)),
    created_at: option.Option(String),
    updated_at: option.Option(String),
  )
}

pub type NinjaUpdates {
  NinjaUpdates(
    first_name: option.Option(String),
    last_name: option.Option(String),
    age: option.Option(Int),
  )
}

pub fn ninja_json_encode(ninja: Ninja) -> json.Json {
  json.object([
    #("id", json.string(ninja.id)),
    #("firstName", json.string(ninja.first_name)),
    #("lastName", json.string(ninja.last_name)),
    #("age", json.int(ninja.age)),
    #(
      "jutsus",
      json.nullable(ninja.jutsus, fn(jutsus) {
        json.array(jutsus, jutsu_json_encode)
      }),
    ),
    #("updatedAt", json.nullable(ninja.updated_at, fn(ua) { json.string(ua) })),
    #("createdAt", json.nullable(ninja.created_at, fn(ca) { json.string(ca) })),
  ])
}

pub fn get_ninja_sql_decoder() -> Decoder(Ninja) {
  dynamic.decode7(
    Ninja,
    dynamic.field("id", dynamic.string),
    dynamic.field("first_name", dynamic.string),
    dynamic.field("last_name", dynamic.string),
    dynamic.field("age", dynamic.int),
    dynamic.field(
      "jutsus",
      dynamic.optional(dynamic.list(get_jutsu_sql_decoder())),
    ),
    dynamic.field("created_at", dynamic.optional(dynamic.string)),
    dynamic.field("updated_at", dynamic.optional(dynamic.string)),
  )
}

pub fn get_ninja_json_decoder() -> Decoder(Ninja) {
  dynamic.decode7(
    Ninja,
    dynamic.field("id", dynamic.string),
    dynamic.field("firstName", dynamic.string),
    dynamic.field("lastName", dynamic.string),
    dynamic.field("age", dynamic.int),
    dynamic.field(
      "jutsus",
      dynamic.optional(dynamic.list(get_jutsu_json_decoder())),
    ),
    dynamic.field("createdAt", dynamic.optional(dynamic.string)),
    dynamic.field("updatedAt", dynamic.optional(dynamic.string)),
  )
}

pub fn ninja_json_decode(data: String) -> snag.Result(Ninja) {
  json.decode(data, get_ninja_json_decoder())
  |> as_snag_result("Failed to parse Ninja")
}

// ---
// Jutsu
// ---

pub type Jutsu {
  Jutsu(
    id: String,
    name: String,
    chakra_nature: String,
    description: String,
    created_at: option.Option(String),
    updated_at: option.Option(String),
  )
}

pub type JutsuUpdates {
  JutsuUpdates(
    name: option.Option(String),
    chakra_nature: option.Option(String),
    description: option.Option(String),
  )
}

pub fn jutsu_json_encode(jutsu: Jutsu) -> json.Json {
  json.object([
    #("id", json.string(jutsu.id)),
    #("name", json.string(jutsu.name)),
    #("chakraNature", json.string(jutsu.chakra_nature)),
    #("description", json.string(jutsu.description)),
    #("updatedAt", json.nullable(jutsu.updated_at, fn(ua) { json.string(ua) })),
    #("createdAt", json.nullable(jutsu.created_at, fn(ca) { json.string(ca) })),
  ])
}

pub fn get_jutsu_json_decoder() -> Decoder(Jutsu) {
  dynamic.decode6(
    Jutsu,
    dynamic.field("id", dynamic.string),
    dynamic.field("name", dynamic.string),
    dynamic.field("chakraNature", dynamic.string),
    dynamic.field("description", dynamic.string),
    dynamic.field("createdAt", dynamic.optional(dynamic.string)),
    dynamic.field("updatedAt", dynamic.optional(dynamic.string)),
  )
}

pub fn get_jutsu_sql_decoder() -> Decoder(Jutsu) {
  dynamic.decode6(
    Jutsu,
    dynamic.field("id", dynamic.string),
    dynamic.field("name", dynamic.string),
    dynamic.field("chakra_nature", dynamic.string),
    dynamic.field("description", dynamic.string),
    dynamic.field("created_at", dynamic.optional(dynamic.string)),
    dynamic.field("updated_at", dynamic.optional(dynamic.string)),
  )
}

pub fn jutsu_json_decode(data: String) -> snag.Result(Jutsu) {
  json.decode(data, get_jutsu_json_decoder())
  |> as_snag_result("Failed to parse Jutsu")
}
