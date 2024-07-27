import cake
import cake/dialect/postgres_dialect as cpd
import cake/param as cp
import cake/update as cu
import gleam/list
import gleam/option.{None, Some}
import gleam/pgo

// ---
// Cake
// ---

/// Convert select query to sql/params
pub fn read_query_to_sql(rq: cake.ReadQuery) -> #(String, List(cp.Param)) {
  let ps = cpd.query_to_prepared_statement(rq)
  let sql = cake.get_sql(ps)
  let params = cake.get_params(ps)
  #(sql, params)
}

/// Convert write query to sql/params
pub fn write_query_to_sql(wq: cake.WriteQuery(t)) -> #(String, List(cp.Param)) {
  let ps = cpd.write_query_to_prepared_statement(wq)
  let sql = cake.get_sql(ps)
  let params = cake.get_params(ps)
  #(sql, params)
}

/// Convert cake param to pgo value
pub fn param_to_value(param: cp.Param) -> pgo.Value {
  case param {
    cp.BoolParam(b) -> pgo.bool(b)
    cp.IntParam(i) -> pgo.int(i)
    cp.FloatParam(f) -> pgo.float(f)
    cp.StringParam(s) -> pgo.text(s)
    cp.NullParam -> pgo.null()
  }
}

/// For an optional input, append to List(UpdateSet) if is_some
pub fn maybe_append_update_param(
  update_sets: List(cu.UpdateSet),
  maybe_input: option.Option(a),
  to_update_set: fn(a) -> cu.UpdateSet,
) -> List(cu.UpdateSet) {
  case maybe_input {
    Some(v) -> list.append(update_sets, [to_update_set(v)])
    None -> update_sets
  }
}

// ---
// pgo
// ---

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
