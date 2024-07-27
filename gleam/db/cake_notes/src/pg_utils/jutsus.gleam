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
import types/jutsu.{
  type Jutsu, type JutsuUpdates, Jutsu, get_jutsu_sql_decoder,
  jutsu_from_sql_tuple,
}

// import cake/param as cp

pub fn get(db: pgo.Connection, id: String) -> snag.Result(Jutsu) {
  let #(sql, raw_params) =
    cs.new()
    |> cs.from_table("jutsus")
    |> cs.select(cs.col("*"))
    |> cs.where(cw.eq(cw.col("id"), cw.string(id)))
    |> cs.to_query
    |> read_query_to_sql

  let decoder = get_jutsu_sql_decoder()
  let params = list.map(raw_params, param_to_value)
  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsus <- result.try(
    res.rows |> list.map(jutsu_from_sql_tuple) |> result.all,
  )
  use jutsu <- snag_try(list.first(jutsus), "No jutsu found")
  Ok(jutsu)
}

pub fn insert(db: pgo.Connection, jutsu: Jutsu) -> snag.Result(Jutsu) {
  let #(sql, raw_params) =
    ci.from_records(
      "jutsus",
      ["id", "name", "chakra_nature", "description"],
      [jutsu],
      fn(j) {
        ci.row([
          ci.string(j.id),
          ci.string(j.name),
          ci.string(j.chakra_nature),
          ci.string(j.description),
        ])
      },
    )
    |> ci.returning(["*"])
    |> ci.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)

  let decoder = get_jutsu_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsus <- result.try(
    res.rows |> list.map(jutsu_from_sql_tuple) |> result.all,
  )
  use jutsu <- snag_try(list.first(jutsus), "No jutsu found")
  Ok(jutsu)
}

pub fn update(
  db: pgo.Connection,
  id: String,
  updates: JutsuUpdates,
) -> snag.Result(Jutsu) {
  use update_sets <- result.try(
    []
    |> maybe_append_update_param(updates.name, fn(v) {
      cu.set_string("name", v)
    })
    |> maybe_append_update_param(updates.chakra_nature, fn(v) {
      cu.set_string("chakra_nature", v)
    })
    |> maybe_append_update_param(updates.description, fn(v) {
      cu.set_string("description", v)
    })
    |> fn(set) {
      case list.is_empty(set) {
        True -> snag.error("No updates found")
        False -> Ok(set)
      }
    },
  )

  let #(sql, raw_params) =
    cu.new()
    |> cu.table("jutsus")
    |> cu.where(cw.eq(cw.col("id"), cw.string(id)))
    |> cu.sets(update_sets)
    |> cu.returning(["*"])
    |> cu.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)
  let decoder = get_jutsu_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsus <- result.try(
    res.rows |> list.map(jutsu_from_sql_tuple) |> result.all,
  )
  use jutsu <- snag_try(list.first(jutsus), "No jutsu found")
  Ok(jutsu)
}

pub fn delete(db: pgo.Connection, id: String) -> snag.Result(Jutsu) {
  let #(sql, raw_params) =
    cd.new()
    |> cd.table("jutsus")
    |> cd.where(cw.eq(cw.col("id"), cw.string(id)))
    |> cd.returning(["*"])
    |> cd.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)
  let decoder = get_jutsu_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsus <- result.try(
    res.rows |> list.map(jutsu_from_sql_tuple) |> result.all,
  )
  use jutsu <- snag_try(list.first(jutsus), "No jutsu found")
  Ok(jutsu)
}
