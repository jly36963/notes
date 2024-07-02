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
  ])
}

pub fn get_ninja_decoder() -> Decoder(Ninja) {
  dynamic.decode5(
    Ninja,
    dynamic.field("id", dynamic.string),
    dynamic.field("firstName", dynamic.string),
    dynamic.field("lastName", dynamic.string),
    dynamic.field("age", dynamic.int),
    dynamic.field("jutsus", dynamic.optional(dynamic.list(get_jutsu_decoder()))),
  )
}

pub fn ninja_json_decode(data: String) -> snag.Result(Ninja) {
  json.decode(data, get_ninja_decoder())
  |> as_snag_result("Failed to parse Ninja")
}

// ---
// Jutsu
// ---

pub type Jutsu {
  Jutsu(id: String, name: String, chakra_nature: String, description: String)
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
  ])
}

pub fn get_jutsu_decoder() -> Decoder(Jutsu) {
  dynamic.decode4(
    Jutsu,
    dynamic.field("id", dynamic.string),
    dynamic.field("name", dynamic.string),
    dynamic.field("chakraNature", dynamic.string),
    dynamic.field("description", dynamic.string),
  )
}

pub fn jutsu_json_decode(data: String) -> snag.Result(Jutsu) {
  json.decode(data, get_jutsu_decoder())
  |> as_snag_result("Failed to parse Jutsu")
}
