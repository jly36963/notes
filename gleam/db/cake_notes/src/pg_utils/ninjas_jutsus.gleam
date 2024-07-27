import cake/delete as cd
import cake/insert as ci
import cake/select as cs
import cake/where as cw
import gleam/dynamic
import gleam/list
import gleam/option.{Some}
import gleam/pgo
import gleam/result
import pg_utils/helpers.{param_to_value, read_query_to_sql, write_query_to_sql}
import pg_utils/ninjas as pg_ninjas
import snag
import snag_utils.{snag_try}
import types/jutsu.{
  type Jutsu, Jutsu, get_jutsu_sql_decoder, jutsu_from_sql_tuple,
}
import types/ninja.{type Ninja, Ninja}

// import cake/param as cp

pub fn associate_ninja_jutsu(
  db: pgo.Connection,
  ninja_id: String,
  jutsu_id: String,
) -> snag.Result(Nil) {
  let #(sql, raw_params) =
    ci.from_values("ninjas_jutsus", ["ninja_id", "jutsu_id"], [
      ci.row([ci.string(ninja_id), ci.string(jutsu_id)]),
    ])
    |> ci.returning(["*"])
    |> ci.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)

  use _ <- snag_try(
    pgo.execute(sql, db, params, dynamic.dynamic),
    "Failed to associate ninja/jutsu",
  )
  Ok(Nil)
}

pub fn dissociate_ninja_jutsu(
  db: pgo.Connection,
  ninja_id: String,
  jutsu_id: String,
) -> snag.Result(Nil) {
  let #(sql, raw_params) =
    cd.new()
    |> cd.table("ninjas_jutsus")
    |> cd.where(cw.eq(cw.col("ninja_id"), cw.string(ninja_id)))
    |> cd.where(cw.eq(cw.col("jutsu_id"), cw.string(jutsu_id)))
    |> cd.returning(["*"])
    |> cd.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)

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
  let #(sql, raw_params) =
    cs.new()
    |> cs.from_table("jutsus")
    |> cs.select(cs.col("*"))
    |> cs.where(
      // id in ids subquery
      cw.in_query(
        cw.col("jutsus.id"),
        cs.new()
          |> cs.from_table("ninjas_jutsus")
          |> cs.select(cs.col("jutsu_id"))
          |> cs.where(cw.eq(cw.col("ninja_id"), cw.string(id)))
          |> cs.to_query,
      ),
    )
    |> cs.to_query
    |> read_query_to_sql

  let decoder = get_jutsu_sql_decoder()
  let params = list.map(raw_params, param_to_value)

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsus",
  )

  use jutsus <- result.try(
    res.rows |> list.map(jutsu_from_sql_tuple) |> result.all,
  )
  Ok(jutsus)
}

pub fn ninja_get_with_jutsus(
  db: pgo.Connection,
  id: String,
) -> snag.Result(Ninja) {
  use ninja <- result.try(pg_ninjas.get(db, id))
  use jutsus <- result.try(get_ninja_jutsus(db, id))
  Ok(Ninja(..ninja, jutsus: Some(jutsus)))
}
