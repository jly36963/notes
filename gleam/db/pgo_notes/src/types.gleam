import birl
import gleam/dynamic
import gleam/float
import gleam/json
import gleam/option.{None}
import gleam/result
import snag
import snag_utils.{as_snag_result, snag_try}
import youid/uuid

// ---
// Date
// ---

pub fn dynamic_float_to_int(df) {
  use f <- result.try(dynamic.float(df))
  Ok(float.round(f))
}

/// Convert dynamic pg date to erlang date format
pub fn dynamic_erlang_date(dyn) {
  dynamic.tuple2(
    dynamic.tuple3(dynamic.int, dynamic.int, dynamic.int),
    dynamic.tuple3(dynamic.int, dynamic.int, dynamic_float_to_int),
  )(dyn)
}

pub fn erlang_datetime_to_string(dt) {
  let time = birl.from_erlang_universal_datetime(dt)
  let date_string = birl.to_iso8601(time)
  date_string
}

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
    created_at: option.Option(String),
    updated_at: option.Option(String),
    jutsus: option.Option(List(Jutsu)),
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

pub fn get_ninja_sql_decoder() {
  dynamic.tuple6(
    dynamic.bit_array,
    dynamic.string,
    dynamic.string,
    dynamic.int,
    dynamic.optional(dynamic_erlang_date),
    dynamic.optional(dynamic_erlang_date),
  )
}

pub fn ninja_from_sql_tuple(data) {
  let #(raw_id, first_name, last_name, age, raw_created_at, raw_updated_at) =
    data
  use uuid <- snag_try(
    uuid.from_bit_array(raw_id),
    "Failed to convert bit array to uuid",
  )
  let id = uuid.to_string(uuid)

  let created_at = option.map(raw_created_at, erlang_datetime_to_string)
  let updated_at = option.map(raw_updated_at, erlang_datetime_to_string)

  Ok(Ninja(
    id: id,
    first_name: first_name,
    last_name: last_name,
    age: age,
    created_at: created_at,
    updated_at: updated_at,
    jutsus: None,
  ))
}

pub fn get_ninja_json_decoder() -> Decoder(Ninja) {
  dynamic.decode7(
    Ninja,
    dynamic.field("id", dynamic.string),
    dynamic.field("firstName", dynamic.string),
    dynamic.field("lastName", dynamic.string),
    dynamic.field("age", dynamic.int),
    dynamic.field("createdAt", dynamic.optional(dynamic.string)),
    dynamic.field("updatedAt", dynamic.optional(dynamic.string)),
    dynamic.field(
      "jutsus",
      dynamic.optional(dynamic.list(get_jutsu_json_decoder())),
    ),
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

pub fn get_jutsu_sql_decoder() {
  dynamic.tuple6(
    dynamic.bit_array,
    dynamic.string,
    dynamic.string,
    dynamic.string,
    dynamic.optional(dynamic_erlang_date),
    dynamic.optional(dynamic_erlang_date),
  )
}

pub fn jutsu_from_sql_tuple(data) {
  let #(
    raw_id,
    name,
    chakra_nature,
    description,
    raw_created_at,
    raw_updated_at,
  ) = data
  use uuid <- snag_try(
    uuid.from_bit_array(raw_id),
    "Failed to convert bit array to uuid",
  )
  let id = uuid.to_string(uuid)

  let created_at = option.map(raw_created_at, erlang_datetime_to_string)
  let updated_at = option.map(raw_updated_at, erlang_datetime_to_string)

  Ok(Jutsu(
    id: id,
    name: name,
    chakra_nature: chakra_nature,
    description: description,
    created_at: created_at,
    updated_at: updated_at,
  ))
}

pub fn jutsu_json_decode(data: String) -> snag.Result(Jutsu) {
  json.decode(data, get_jutsu_json_decoder())
  |> as_snag_result("Failed to parse Jutsu")
}
