import gleam/bool
import gleam/dict
import gleam/float
import gleam/int
import gleam/io
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/result
import gleam/string

pub fn main() {
  print_section_title("Basic variables")
  basic_variables()

  print_section_title("Basic bool")
  basic_bool()

  print_section_title("basic floats")
  basic_floats()

  print_section_title("basic ints")
  basic_ints()

  print_section_title("basic strings")
  basic_strings()

  print_section_title("basic expression blocks")
  basic_expression_blocks()

  print_section_title("basic cases")
  basic_cases()

  print_section_title("basic results")
  basic_results()

  print_section_title("basic options")
  basic_options()
  // print_section_title("basic lists")
  // basic_lists()

  // print_section_title("basic tuples")
  // basic_tuples()

  // print_section_title("basic dicts")
  // basic_dicts()

  // print_section_title("basic generics")
  // basic_generics()

  // print_section_title("basic custom types")
  // basic_custom_types()

  // print_section_title("basic enums")
  // basic_enums()

  // print_section_title("basic use")
  // basic_use()

  // print_section_title("basic spawn")
  // basic_spawn()
}

// ---
// Utils
// ---

/// Convert a string to upper-case, wrap with newlines, print
fn print_section_title(s: String) -> Nil {
  io.println("\n" <> string.uppercase(s) <> "\n")
}

// ---
// Examples
// ---

fn basic_variables() -> Nil {
  let str1 = "The inner machinations of my mind are an enigma"
  io.println(str1)
}

fn basic_bool() -> Nil {
  // == !=
  // > >= < <=
  // && ||
  // + - * / %
  // +. -. *. /.
  // <>
  // |>
  io.println("...")
}

// fn stringify() -> String {}

fn basic_floats() -> Nil {
  let float1 = 3.14
  let float2 = float.negate(float1)

  let results = [
    "float1: " <> float1 |> string.inspect,
    "float2: " <> float2 |> string.inspect,
    "float.add(float1, 1.0): " <> float.add(float1, 1.0) |> string.inspect,
    "float.compare(float1, 1.0): "
      <> float.compare(float1, 1.0) |> string.inspect,
    "float.absolute_value(float2): "
      <> float.absolute_value(float2) |> string.inspect,
    "float.ceiling(float1): " <> float.ceiling(float1) |> string.inspect,
    "float.clamp(float1, 3.0, 4.0): "
      <> float.clamp(float1, 3.0, 4.0) |> string.inspect,
    "float.divide(float1, 2.0): " <> float.divide(float1, 2.0) |> string.inspect,
    "float.floor(float1): " <> float.floor(float1) |> string.inspect,
    "float.max(float1, 4.0): " <> float.max(float1, 4.0) |> string.inspect,
    "float.min(float1, 2.0): " <> float.min(float1, 2.0) |> string.inspect,
    "float.multiply(float1, 2.0): "
      <> float.multiply(float1, 2.0) |> string.inspect,
    "float.negate(float1): " <> float.negate(float1) |> string.inspect,
    "float.parse(\"3.14\"): " <> float.parse("3.14") |> string.inspect,
    "float.power(float1, 2.0) : " <> float.power(float1, 2.0) |> string.inspect,
    "float.product([1.0, 2.0, 3.0]): "
      <> float.product([1.0, 2.0, 3.0]) |> string.inspect,
    "float.round(float1): " <> float.round(float1) |> string.inspect,
    "float.square_root(float1): " <> float.square_root(float1) |> string.inspect,
    "float.subtract(float1, 1.0): "
      <> float.subtract(float1, 1.0) |> string.inspect,
    "float.sum([1.0, 2.0, 3.0]): "
      <> float.sum([1.0, 2.0, 3.0]) |> string.inspect,
    "float.random(): " <> float.random() |> string.inspect,
    "float.round(float1): " <> float.round(float1) |> string.inspect,
    "float.truncate(float1): " <> float.truncate(float1) |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_ints() -> Nil {
  let int1 = 2
  let int2 = 7

  let results = [
    "int1: " <> int1 |> string.inspect,
    "int2: " <> int2 |> string.inspect,
    "int.add(int1, 1): " <> int.add(int1, 1) |> string.inspect,
    "int.compare(int1, 1): " <> int.compare(int1, 1) |> string.inspect,
    "int.absolute_value(int2): " <> int.absolute_value(int2) |> string.inspect,
    "int.clamp(int1, 3, 4): " <> int.clamp(int1, 3, 4) |> string.inspect,
    "int.divide(int1, 2): " <> int.divide(int1, 2) |> string.inspect,
    "int.is_even(int1): " <> int.is_even(int1) |> string.inspect,
    "int.is_odd(int1): " <> int.is_odd(int1) |> string.inspect,
    "int.divide(int1, 2): " <> int.divide(int1, 2) |> string.inspect,
    "int.max(int1, 4): " <> int.max(int1, 4) |> string.inspect,
    "int.min(int1, 2): " <> int.min(int1, 2) |> string.inspect,
    "int.modulo(int1, 2): " <> int.modulo(int1, 2) |> string.inspect,
    "int.multiply(int1, 2): " <> int.multiply(int1, 2) |> string.inspect,
    "int.negate(int1): " <> int.negate(int1) |> string.inspect,
    "int.parse(\"3.14\"): " <> int.parse("3.14") |> string.inspect,
    "int.power(int1, 2.0) : " <> int.power(int1, 2.0) |> string.inspect,
    "int.product([1, 2, 3]): " <> int.product([1, 2, 3]) |> string.inspect,
    "int.square_root(int1): " <> int.square_root(int1) |> string.inspect,
    "int.subtract(int1, 1): " <> int.subtract(int1, 1) |> string.inspect,
    "int.sum([1, 2, 3]): " <> int.sum([1, 2, 3]) |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_strings() -> Nil {
  let results = [
    "string.append(\"Bar\", \"nacles\"): " <> string.append("Bar", "nacles"),
    "string.byte_size(\"Where's the leak, ma'am?\"): "
      <> string.byte_size("Where's the leak, ma'am?") |> string.inspect,
    "string.capitalise(\"the owner of the white sedan, you left your lights on\"): "
      <> string.capitalise(
      "the owner of the white sedan, you left your lights on",
    ),
    "string.concat([\"Who\", \" \", \"are\", \" \", \"you\", \" \", \"people?\"]): "
      <> string.concat(["Who", " ", "are", " ", "you", " ", "people?"]),
    "string.contains(does: \"Not even Squidward's house\", contain: \"id\"): "
      <> string.contains(does: "Not even Squidward's house", contain: "id")
    |> string.inspect,
    "string.ends_with(\"Help me boy or you're fired\", \"fired\"): "
      <> string.ends_with("Help me boy or you're fired", "fired")
    |> string.inspect,
    "string.first(\"Yeah! E minor! All right! Yeah!\"): "
      <> string.first("Yeah! E minor! All right! Yeah!") |> string.inspect,
    "string.inspect([1, 2, 3]): " <> string.inspect([1, 2, 3]),
    "string.is_empty(\"Mr. Krabs, I have an idea!\"): "
      <> string.is_empty("Mr. Krabs, I have an idea!") |> string.inspect,
    "string.join([\"I\", \"wumbo\", \"you\", \"wumbo\"], \" \"): "
      <> string.join(["I", "wumbo", "you", "wumbo"], " "),
    "string.last(\"We're doomed\"): "
      <> string.last("We're doomed") |> string.inspect,
    "string.length(\"Meet my darling daughter, Pearl!\"): "
      <> string.length("Meet my darling daughter, Pearl!") |> string.inspect,
    "string.lowercase(\"I CAN'T SEE MY FOREHEAD\"): "
      <> string.lowercase("I CAN'T SEE MY FOREHEAD"),
    "string.pad_left(\"25\", 4, \"0\"): " <> string.pad_left("25", 4, "0"),
    "string.repeat(\"I'm ready!  \", 3): " <> string.repeat("I'm ready!  ", 3),
    "string.pad_right(\"25\", 4, \".\"): " <> string.pad_right("25", 4, "."),
    "string.pop_grapheme(\"This is a load of barnacles!\"): "
      <> string.pop_grapheme("This is a load of barnacles!") |> string.inspect,
    "string.replace(\"I'm ready!  \", \"ready\", \"not ready\"): "
      <> string.replace("I'm ready!  ", "ready", "not ready"),
    "string.reverse(\"People order our patties\"): "
      <> string.reverse("People order our patties"),
    "string.slice(\"Kicking? I want to do some kicking!\", at_index: 11, length: 4): "
      <> string.slice(
      "Kicking? I want to do some kicking!",
      at_index: 11,
      length: 4,
    ),
    "string.split(\"Your ceiling is talking to me!\", \" \"): "
      <> string.split("Your ceiling is talking to me!", " ")
    |> string.inspect,
    "string.starts_with(\"It's okay, take your time\", \"I\"): "
      <> string.starts_with("It's okay, take your time", "I") |> string.inspect,
    "string.to_graphemes(\"Me hoy minoy ✏️\") :"
      <> string.to_graphemes("Me hoy minoy ✏️") |> string.inspect,
    "string.trim(\"   Too bad that didn't kill me   \"): "
      <> string.trim("   Too bad that didn't kill me   "),
    "string.uppercase(\"moar!\"): " <> string.uppercase("moar!"),
    "string.to_utf_codepoints(\"Você tá bem?\"): "
      <> string.to_utf_codepoints("Você tá bem?") |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_expression_blocks() -> Nil {
  let v = {
    let a = 1
    let b = 2
    a + b
  }
  v
  |> int.to_string
  |> io.println
}

fn basic_cases() -> Nil {
  let num = 24
  let result = case num {
    0 -> "zero"
    n ->
      case n > 0 {
        True -> "negative"
        False -> "positive"
      }
  }
  io.println(result)
}

fn basic_results() -> Nil {
  let result1 = Ok("Yup")
  let result2 = Error("Nope")

  // Pattern matching with case
  io.println("Pattern matching a result:")
  case result1 {
    Ok(v) -> io.println("Success: message: " <> v)
    Error(e) -> io.println("Error message:" <> e)
  }

  let results = [
    "result1: " <> result1 |> string.inspect,
    "result2: " <> result2 |> string.inspect,
    "result.all([Ok(\"Yes\"), Ok(\"Sim\")]): "
      <> result.all([Ok("Yes"), Ok("Sim")]) |> string.inspect,
    "result.flatten(Ok(Ok(result1))): "
      <> result.flatten(Ok(Ok("Yes"))) |> string.inspect,
    "result.is_error(result2): " <> result.is_error(result2) |> string.inspect,
    "result.is_ok(Ok(result1)): " <> result.is_ok(Ok(result1)) |> string.inspect,
    "result.lazy_or(result2, fn () { Ok(\"yup!!\") }): "
      <> result.lazy_or(result2, fn() { Ok("yup!!") }) |> string.inspect,
    "result.lazy_unwrap(result2, fn () { \"yup!!\" }): "
      <> result.lazy_unwrap(result2, fn() { "yup!!" }),
    "result.map(result1, string.uppercase): "
      <> result.map(result1, string.uppercase) |> string.inspect,
    "result.map_error(result2, string.uppercase): "
      <> result.map_error(result2, string.uppercase) |> string.inspect,
    "result.or(result2, result1): "
      <> result.or(result2, result1) |> string.inspect,
    "result.replace(result1, \"Yes\"): "
      <> result.replace(result1, "Yes") |> string.inspect,
    "result.replace_error(result2, \"No\"): "
      <> result.replace_error(result2, "No") |> string.inspect,
    "result.try(result1, fn(v) { Ok(string.uppercase(v)) }): "
      <> result.try(result1, fn(v) { Ok(string.uppercase(v)) })
    |> string.inspect,
    "result.try_recover(result2, fn(e) { Error(string.uppercase(e)) }): "
      <> result.try_recover(result2, fn(e) { Error(string.uppercase(e)) })
    |> string.inspect,
    "result.unwrap(result2, \"Yes\"): "
      <> result.unwrap(result2, "Yes") |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_options() -> Nil {
  let option1: Option(String) = Some("Yup")
  let option2: Option(String) = option.None

  // Pattern matching with case
  io.println("Pattern matching an option:")
  case option1 {
    Some(v) -> io.println("Message provided: " <> v)
    None -> "No message provided" |> io.println
  }

  let results = [
    "option1: " <> option1 |> string.inspect,
    "option2: " <> option2 |> string.inspect,
    "option.all([Some(\"Yes\"), Some(\"Sim\")]): "
      <> option.all([Some("Yes"), Some("Sim")]) |> string.inspect,
    "option.flatten(Some(Some(option1))): "
      <> option.flatten(Some(Some("Yes"))) |> string.inspect,
    "option.is_none(option2): " <> option.is_none(option2) |> string.inspect,
    "option.is_some(Some(option1)): "
      <> option.is_some(Some(option1)) |> string.inspect,
    "option.lazy_or(option2, fn () { Some(\"yup!!\") }): "
      <> option.lazy_or(option2, fn() { Some("yup!!") }) |> string.inspect,
    "option.lazy_unwrap(option2, fn () { \"yup!!\" }): "
      <> option.lazy_unwrap(option2, fn() { "yup!!" }),
    "option.map(option1, string.uppercase): "
      <> option.map(option1, string.uppercase) |> string.inspect,
    "option.or(option2, option1): "
      <> option.or(option2, option1) |> string.inspect,
    "option.then(option1, fn(v) { Some(string.uppercase(v)) }): "
      <> option.then(option1, fn(v) { Some(string.uppercase(v)) })
    |> string.inspect,
    "option.unwrap(option2, \"Yes\"): "
      <> option.unwrap(option2, "Yes") |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_lists() -> Nil {
  let list0 = [2, 3, 4]
  let list1 = list.append([1, ..list0], [5, 6])

  io.println("list1")
  // Could just use string.inspect
  list1
  |> list.map(fn(n) { int.to_string(n) })
  |> string.join(", ")
  |> io.println()

  io.println("all")
  list1
  |> list.all(fn(n) { n > 0 })
  |> bool.to_string
  |> io.println

  io.println("any")
  list1
  |> list.any(fn(n) { n > 3 })
  |> bool.to_string
  |> io.println

  // append
  // ...

  io.println("at")
  list1
  |> list.at(2)
  |> result.unwrap(0)
  |> int.to_string
  |> io.println

  // chunk
  // ...

  io.println("combinations")
  list1
  |> list.combinations(2)
  |> string.inspect()
  |> io.println()

  io.println("concat")
  list1
  |> fn(l) { list.concat([l, [7, 8]]) }
  |> string.inspect()
  |> io.println()

  io.println("contains")
  list1
  |> list.contains(3)
  |> bool.to_string
  |> io.println

  // drop_while
  // ...

  io.println("each")
  // Also "try_each"
  list.each(list1, fn(n) {
    n
    |> int.to_string()
    |> io.println()
  })

  io.println("filter")
  // Also "filter_map"
  list1
  |> list.filter(fn(n) { n > 3 })
  |> string.inspect()
  |> io.println()

  io.println("find")
  list1
  |> list.find(fn(n) { n > 3 })
  |> fn(l) {
    case l {
      Ok(n) ->
        n
        |> int.to_string
      Error(Nil) -> "None"
    }
    |> io.println
  }

  io.println("find_map")
  [[], [1, 2, 3], [4]]
  |> list.find_map(list.last)
  |> result.map(int.to_string)
  |> result.unwrap("None")
  |> io.println

  io.println("first")
  list1
  |> list.first
  |> fn(r) {
    case r {
      Ok(n) -> io.println(int.to_string(n))
      Error(Nil) -> Nil
    }
  }

  io.println("flat_map")
  list1
  |> list.flat_map(fn(n) { [n - 1, n, n + 1] })
  |> string.inspect()
  |> io.println()

  // fold, try_fold, fold_right, fold_until
  // ...

  // group
  // ...

  // index_fold, index_map,
  // ...

  // interleave, intersperse
  // ...

  io.println("is_empty")
  list1
  |> list.is_empty
  |> bool.to_string
  |> io.println

  // key_filter, key_find, key_pop, key_set
  // ...

  io.println("last")
  list1
  |> list.last
  |> fn(r) {
    case r {
      Ok(n) -> io.println(int.to_string(n))
      Error(Nil) -> Nil
    }
  }

  io.println("length")
  list1
  |> list.length
  |> int.to_string
  |> io.println

  io.println("map")
  // Also "try_map"
  list1
  |> list.map(fn(n) { n * 2 })
  |> string.inspect()
  |> io.println()

  io.println("partition")
  list1
  |> list.partition(fn(n) { n > 3 })
  |> string.inspect()
  |> io.println()

  // permutations
  // ...

  // pop
  // ...

  // prepend
  // ...

  io.println("range")
  list.range(1, 5)
  |> string.inspect()
  |> io.println()

  list1
  |> list.reduce(fn(acc, n) { acc + n })
  |> result.unwrap(0)
  |> int.to_string
  |> io.println

  io.println("repeat")
  [1, 2, 3]
  |> list.repeat(2)
  |> string.inspect()
  |> io.println()

  // rest
  // ...

  io.println("reverse")
  list1
  |> list.reverse()
  |> string.inspect()
  |> io.println()

  // scan
  // ...

  // shuffle
  io.println("shuffle")
  list1
  |> list.shuffle()
  |> string.inspect()
  |> io.println()

  io.println("sized_chunk")
  list1
  |> list.sized_chunk(2)
  |> string.inspect()
  |> io.println()

  [1, 3, 2, 4, 5]
  |> list.sort(int.compare)
  |> string.inspect()
  |> io.println()

  // split
  // ...

  io.println("take")
  // Also "take_while"
  list1
  |> list.take(3)
  |> string.inspect
  |> io.println()

  io.println("transpose")
  [[1, 2], [3, 4], [5, 6]]
  |> list.transpose
  |> string.inspect
  |> io.println

  io.println("unique")
  [1, 1, 1, 2, 2, 3]
  |> list.unique
  |> string.inspect
  |> io.println

  io.println("window")
  list1
  |> list.window(3)
  |> string.inspect
  |> io.println

  // zip, strict_zip, unzip
  // ...

  Nil
}

fn basic_tuples() -> Nil {
  // https://gleam.run/book/tour/tuples.html
  io.println("...")
}

fn basic_dicts() -> Nil {
  let dict1 = dict.from_list([#("a", 1), #("b", 2), #("c", 3)])
  dict.insert(dict1, "d", 4)
  dict.delete(dict1, "d")

  // delete
  // ...

  // drop
  // ...

  io.println("filter")
  dict1
  |> dict.filter(fn(_k, v) { v > 2 })
  |> string.inspect
  |> io.println

  // fold
  // ...

  // from_list
  // ...

  io.println("get")
  dict1
  |> dict.get("a")
  |> result.unwrap(0)
  |> int.to_string
  |> io.println

  io.println("has_key")
  dict1
  |> dict.has_key("a")
  |> bool.to_string
  |> io.println

  // insert
  // ...

  io.println("keys")
  dict1
  |> dict.keys
  |> string.inspect
  |> io.println

  io.println("map_values")
  dict1
  |> dict.map_values(fn(_k, v) { v * 2 })
  |> string.inspect
  |> io.println

  io.println("merge")
  dict1
  |> dict.merge(dict.from_list([#("d", 4), #("e", 5)]))
  |> string.inspect
  |> io.println

  // new
  // ...

  io.println("size")
  dict1
  |> dict.size
  |> int.to_string
  |> io.println

  // take
  // ...

  // to_list
  // ...

  // update
  // ...

  io.println("values")
  dict1
  |> dict.values
  |> string.inspect
  |> io.println
}

fn basic_generics() -> Nil {
  io.println("...")
}

fn basic_custom_types() -> Nil {
  io.println("...")
}

fn basic_enums() -> Nil {
  io.println("...")
}

fn basic_use() -> Nil {
  io.println("...")
}

fn basic_spawn() -> Nil {
  io.println("...")
}
