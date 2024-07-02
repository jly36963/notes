import gleam/io
import gleam/option.{None, Some}
import gleam/result
import gleam/string.{inspect}
import snag

// ---
// Log error
// ---

pub fn as_snag_result(res: Result(a, b), message: String) -> snag.Result(a) {
  // If error, log snag message and error
  case res {
    Ok(_) -> Nil
    Error(e) -> {
      io.println(message)
      e |> inspect |> io.println
    }
  }
  // Return result as snag result (new error is snag message)
  result.replace_error(res, snag.new(message))
}

pub fn snag_try(res, message, func) {
  result.try(as_snag_result(res, message), func)
}

// ---
// Include error as snag context
// ---

pub fn as_snag_result_ctx(res, message) {
  let issue = case res {
    Ok(_) -> None
    Error(e) -> Some(inspect(e))
  }
  let s = {
    let s = snag.new(message)
    case issue {
      Some(i) -> snag.layer(s, i)
      None -> s
    }
  }
  result.replace_error(res, s)
}

pub fn snag_try_ctx(res, message, func) {
  result.try(as_snag_result_ctx(res, message), func)
}
