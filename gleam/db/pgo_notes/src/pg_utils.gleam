import gleam/dynamic
import gleam/list
import gleam/option.{None, Some}
import gleam/pgo
import gleam/result
import gleam/string
import snag
import snag_utils.{snag_try}
import types.{
  type Jutsu, type JutsuUpdates, type Ninja, type NinjaUpdates, Jutsu, Ninja,
  NinjaUpdates, get_jutsu_json_decoder, get_ninja_json_decoder,
}

// ---
// Pgo
// ---

// TODO: replace placeholders

/// Create pgo client
pub fn get_client(
  host host: String,
  port port: Int,
  user user: String,
  password password: String,
  database database: String,
) -> pgo.Connection {
  pgo.connect(
    pgo.Config(
      ..pgo.default_config(),
      host: host,
      port: port,
      database: database,
      user: user,
      password: Some(password),
      pool_size: 10,
    ),
  )
}

/// Get string like "(?, ?, ?)" (n is 3)
pub fn get_placeholders(n: Int) -> String {
  list.repeat("?", n)
  |> string.join(", ")
  |> fn(ph) { "(" <> ph <> ")" }
}

/// For an optional input, append to params list if is_some
pub fn maybe_append_param(
  params: List(pgo.Value),
  maybe_input: option.Option(a),
  to_value: fn(a) -> pgo.Value,
) -> List(pgo.Value) {
  case maybe_input {
    Some(v) -> list.append(params, [to_value(v)])
    None -> params
  }
}

// ---
// Ninja
// ---

pub fn ninja_get(db: pgo.Connection, id: String) -> snag.Result(Ninja) {
  let sql = "SELECT * FROM ninjas WHERE id = ?;"
  let params = [pgo.text(id)]
  let decoder = get_ninja_json_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )
  use ninja <- snag_try(list.first(res.rows), "No ninja found")
  Ok(ninja)
}

pub fn ninja_insert(db: pgo.Connection, ninja: Ninja) -> snag.Result(Ninja) {
  let sql =
    "INSERT INTO ninjas (id, first_name, last_name, age) VALUES (?, ?, ?, ?) RETURNING *;"
  let params = [
    pgo.text(ninja.id),
    pgo.text(ninja.first_name),
    pgo.text(ninja.first_name),
    pgo.int(ninja.age),
  ]
  let decoder = get_ninja_json_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )
  use ninja <- snag_try(list.first(res.rows), "No ninja found")
  Ok(ninja)
}

pub fn ninja_update(
  db: pgo.Connection,
  id: String,
  updates: NinjaUpdates,
) -> snag.Result(Ninja) {
  use set_params <- result.try(
    []
    |> fn(p) { maybe_append_param(p, updates.first_name, pgo.text) }
    |> fn(p) { maybe_append_param(p, updates.last_name, pgo.text) }
    |> fn(p) { maybe_append_param(p, updates.age, pgo.int) }
    |> fn(p) {
      case list.is_empty(p) {
        True -> snag.error("No updates found")
        False -> Ok(p)
      }
    },
  )
  let set_placeholders = set_params |> list.length() |> get_placeholders

  let sql =
    "UPDATE ninjas SET " <> set_placeholders <> " WHERE id = ? RETURNING *;"
  let params = list.concat([set_params, [pgo.text(id)]])
  let decoder = get_ninja_json_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )
  use ninja <- snag_try(list.first(res.rows), "No ninja found")
  Ok(ninja)
}

pub fn ninja_delete(db: pgo.Connection, id: String) -> snag.Result(Ninja) {
  let sql = "DELETE FROM ninjas WHERE id = ? RETURNING *;"
  let params = [pgo.text(id)]
  let decoder = get_ninja_json_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )
  use ninja <- snag_try(list.first(res.rows), "No ninja found")
  Ok(ninja)
}

// ---
// Jutsu
// ---

pub fn jutsu_get(db: pgo.Connection, id: String) -> snag.Result(Jutsu) {
  let sql = "SELECT * FROM jutsus WHERE id = ?;"
  let params = [pgo.text(id)]
  let decoder = get_jutsu_json_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsu <- snag_try(list.first(res.rows), "No jutsu found")
  Ok(jutsu)
}

pub fn jutsu_insert(db: pgo.Connection, jutsu: Jutsu) -> snag.Result(Jutsu) {
  let sql =
    "INSERT INTO jutsus (id, first_name, last_name, age) VALUES (?, ?, ?, ?) RETURNING *;"
  let params = [
    pgo.text(jutsu.id),
    pgo.text(jutsu.name),
    pgo.text(jutsu.chakra_nature),
    pgo.text(jutsu.description),
  ]
  let decoder = get_jutsu_json_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsu <- snag_try(list.first(res.rows), "No jutsu found")
  Ok(jutsu)
}

pub fn jutsu_update(
  db: pgo.Connection,
  id: String,
  updates: JutsuUpdates,
) -> snag.Result(Jutsu) {
  use set_params <- result.try(
    []
    |> fn(p) { maybe_append_param(p, updates.name, pgo.text) }
    |> fn(p) { maybe_append_param(p, updates.chakra_nature, pgo.text) }
    |> fn(p) { maybe_append_param(p, updates.description, pgo.text) }
    |> fn(p) {
      case list.is_empty(p) {
        True -> snag.error("No updates found")
        False -> Ok(p)
      }
    },
  )
  let set_placeholders = set_params |> list.length() |> get_placeholders

  let sql =
    "UPDATE jutsus SET " <> set_placeholders <> " WHERE id = ? RETURNING *;"
  let params = list.concat([set_params, [pgo.text(id)]])
  let decoder = get_jutsu_json_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsu_updated <- snag_try(list.first(res.rows), "No jutsu found")
  Ok(jutsu_updated)
}

pub fn jutsu_delete(db: pgo.Connection, id: String) -> snag.Result(Jutsu) {
  let sql = "DELETE FROM jutsus WHERE id = ? RETURNING *;"
  let params = [pgo.text(id)]
  let decoder = get_jutsu_json_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsu_deleted <- snag_try(list.first(res.rows), "No jutsu found")
  Ok(jutsu_deleted)
}

// ---
// Ninjas jutsus
// ---

pub fn ninja_add_jutsu(
  db: pgo.Connection,
  ninja_id: String,
  jutsu_id: String,
) -> snag.Result(Nil) {
  let sql =
    "INSERT INTO ninjas_jutsus (ninja_id, jutsu_id) VALUES ( ?, ? ) RETURNING *;"
  let params = [pgo.text(ninja_id), pgo.text(jutsu_id)]

  use _ <- snag_try(
    pgo.execute(sql, db, params, dynamic.dynamic),
    "Failed to associate ninja/jutsu",
  )
  Ok(Nil)
}

pub fn ninja_remove_jutsu(
  db: pgo.Connection,
  ninja_id: String,
  jutsu_id: String,
) -> snag.Result(Nil) {
  let sql =
    "DELETE FROM ninjas_jutsus WHERE (ninja_id = ? AND jutsu_id = ?) RETURNING *;"
  let params = [pgo.text(ninja_id), pgo.text(jutsu_id)]

  use _ <- snag_try(
    pgo.execute(sql, db, params, dynamic.dynamic),
    "Failed to associate ninja/jutsu",
  )
  Ok(Nil)
}

pub fn get_ninja_jutsus(
  db: pgo.Connection,
  id: String,
) -> snag.Result(List(Jutsu)) {
  let sql =
    "SELECT * FROM jutsus WHERE jutsus.id IN (SELECT jutsu_id FROM ninjas_jutsus WHERE ninjas_jutsus.ninja_id = ?);"
  let params = [pgo.text(id)]
  let decoder = get_jutsu_json_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsus",
  )
  Ok(res.rows)
}

pub fn ninja_get_with_jutsus(
  db: pgo.Connection,
  id: String,
) -> snag.Result(Ninja) {
  use ninja <- result.try(ninja_get(db, id))
  use jutsus <- result.try(get_ninja_jutsus(db, id))
  Ok(Ninja(..ninja, jutsus: Some(jutsus)))
}
