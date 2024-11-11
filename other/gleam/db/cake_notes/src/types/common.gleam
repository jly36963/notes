import birl
import gleam/dynamic
import gleam/float
import gleam/result

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

pub fn erlang_dt_to_string(dt) {
  let time = birl.from_erlang_universal_datetime(dt)
  let date_string = birl.to_iso8601(time)
  date_string
}

// ---
// Json
// ---

pub type Decoder(a) =
  fn(dynamic.Dynamic) -> Result(a, List(dynamic.DecodeError))
