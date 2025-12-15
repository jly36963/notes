import gleam/dynamic
import gleam/json
import gleam/option
import snag
import snag_utils.{as_snag_result, snag_try}
import types/common
import youid/uuid

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

pub fn get_jutsu_json_decoder() -> common.Decoder(Jutsu) {
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

pub fn get_jutsu_update_json_decoder() {
  dynamic.decode3(
    JutsuUpdates,
    dynamic.field("name", dynamic.optional(dynamic.string)),
    dynamic.field("chakraNature", dynamic.optional(dynamic.string)),
    dynamic.field("description", dynamic.optional(dynamic.string)),
  )
}

pub fn get_jutsu_sql_decoder() {
  dynamic.tuple6(
    dynamic.bit_array,
    dynamic.string,
    dynamic.string,
    dynamic.string,
    dynamic.optional(common.dynamic_erlang_date),
    dynamic.optional(common.dynamic_erlang_date),
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

  let created_at = option.map(raw_created_at, common.erlang_dt_to_string)
  let updated_at = option.map(raw_updated_at, common.erlang_dt_to_string)

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

pub fn jutsu_update_json_encode(updates: JutsuUpdates) -> json.Json {
  json.object([
    #("name", json.nullable(updates.name, json.string)),
    #("chakraNature", json.nullable(updates.chakra_nature, json.string)),
    #("description", json.nullable(updates.description, json.string)),
  ])
}
