import cake/delete as cd
import cake/insert as ci
import cake/select as cs
import cake/update as cu
import cake/where as cw
import gleam/list
import gleam/pgo
import gleam/result
import pg_utils/helpers.{
  maybe_append_update_param, param_to_value, read_query_to_sql,
  write_query_to_sql,
}
import snag
import snag_utils.{snag_try}
import types/ninja.{
  type Ninja, type NinjaUpdates, Ninja, NinjaUpdates, get_ninja_sql_decoder,
  ninja_from_sql_tuple,
}

// import cake/param as cp

pub fn get(db: pgo.Connection, id: String) -> snag.Result(Ninja) {
  let #(sql, raw_params) =
    cs.new()
    |> cs.from_table("ninjas")
    |> cs.select(cs.col("*"))
    |> cs.where(cw.eq(cw.col("id"), cw.string(id)))
    |> cs.to_query
    |> read_query_to_sql

  let decoder = get_ninja_sql_decoder()
  let params = list.map(raw_params, param_to_value)
  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )

  use ninjas <- result.try(
    res.rows |> list.map(ninja_from_sql_tuple) |> result.all,
  )
  use ninja <- snag_try(list.first(ninjas), "No ninja found")
  Ok(ninja)
}

pub fn insert(db: pgo.Connection, ninja: Ninja) -> snag.Result(Ninja) {
  let #(sql, raw_params) =
    ci.from_records(
      "ninjas",
      ["id", "first_name", "last_name", "age"],
      [ninja],
      fn(n) {
        ci.row([
          ci.string(n.id),
          ci.string(n.first_name),
          ci.string(n.last_name),
          ci.int(n.age),
        ])
      },
    )
    |> ci.returning(["*"])
    |> ci.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)
  let decoder = get_ninja_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )
  use ninjas <- result.try(
    res.rows |> list.map(ninja_from_sql_tuple) |> result.all,
  )
  use ninja <- snag_try(list.first(ninjas), "No ninja found")
  Ok(ninja)
}

pub fn update(
  db: pgo.Connection,
  id: String,
  updates: NinjaUpdates,
) -> snag.Result(Ninja) {
  use update_sets <- result.try(
    []
    |> maybe_append_update_param(updates.first_name, fn(v) {
      cu.set_string("first_name", v)
    })
    |> maybe_append_update_param(updates.last_name, fn(v) {
      cu.set_string("last_name", v)
    })
    |> maybe_append_update_param(updates.age, fn(v) { cu.set_int("age", v) })
    |> fn(sets) {
      case list.is_empty(sets) {
        True -> snag.error("No updates found")
        False -> Ok(sets)
      }
    },
  )

  let #(sql, raw_params) =
    cu.new()
    |> cu.table("ninjas")
    |> cu.where(cw.eq(cw.col("id"), cw.string(id)))
    |> cu.sets(update_sets)
    |> cu.returning(["*"])
    |> cu.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)
  let decoder = get_ninja_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )
  use ninjas <- result.try(
    res.rows |> list.map(ninja_from_sql_tuple) |> result.all,
  )
  use ninja <- snag_try(list.first(ninjas), "No ninja found")
  Ok(ninja)
}

pub fn delete(db: pgo.Connection, id: String) -> snag.Result(Ninja) {
  let #(sql, raw_params) =
    cd.new()
    |> cd.table("ninjas")
    |> cd.where(cw.eq(cw.col("id"), cw.string(id)))
    |> cd.returning(["*"])
    |> cd.to_query
    |> write_query_to_sql

  let decoder = get_ninja_sql_decoder()
  let params = list.map(raw_params, param_to_value)
  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )

  use ninjas <- result.try(
    res.rows |> list.map(ninja_from_sql_tuple) |> result.all,
  )
  use ninja <- snag_try(list.first(ninjas), "No ninja found")
  Ok(ninja)
}
