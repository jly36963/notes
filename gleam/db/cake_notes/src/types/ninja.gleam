import gleam/dynamic
import gleam/json
import gleam/option
import snag
import snag_utils.{as_snag_result, snag_try}
import types/common as types_common
import types/jutsu as types_jutsu
import youid/uuid

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
    jutsus: option.Option(List(types_jutsu.Jutsu)),
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
        json.array(jutsus, types_jutsu.jutsu_json_encode)
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
    dynamic.optional(types_common.dynamic_erlang_date),
    dynamic.optional(types_common.dynamic_erlang_date),
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

  let created_at = option.map(raw_created_at, types_common.erlang_dt_to_string)
  let updated_at = option.map(raw_updated_at, types_common.erlang_dt_to_string)

  Ok(Ninja(
    id: id,
    first_name: first_name,
    last_name: last_name,
    age: age,
    created_at: created_at,
    updated_at: updated_at,
    jutsus: option.None,
  ))
}

pub fn get_ninja_json_decoder() {
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
      dynamic.optional(dynamic.list(types_jutsu.get_jutsu_json_decoder())),
    ),
  )
}

pub fn ninja_json_decode(data: String) -> snag.Result(Ninja) {
  json.decode(data, get_ninja_json_decoder())
  |> as_snag_result("Failed to parse Ninja")
}

pub fn get_ninja_update_json_decoder() {
  dynamic.decode3(
    NinjaUpdates,
    dynamic.field("firstName", dynamic.optional(dynamic.string)),
    dynamic.field("lastName", dynamic.optional(dynamic.string)),
    dynamic.field("age", dynamic.optional(dynamic.int)),
  )
}

pub fn ninja_update_json_encode(updates: NinjaUpdates) -> json.Json {
  json.object([
    #("firstName", json.nullable(updates.first_name, json.string)),
    #("lastName", json.nullable(updates.last_name, json.string)),
    #("age", json.nullable(updates.age, json.int)),
  ])
}
