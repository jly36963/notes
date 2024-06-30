import filepath
import gleam/bool
import gleam/dict
import gleam/erlang
import gleam/erlang/os
import gleam/float
import gleam/int
import gleam/io
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/result
import gleam/string
import simplifile as file

// import gleam/regex
// import gleam/json
// import prng/random
// import gleam/erlang/process

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

  print_section_title("basic lists")
  basic_lists()

  print_section_title("basic tuples")
  basic_tuples()

  print_section_title("basic dicts")
  basic_dicts()

  print_section_title("basic records")
  basic_records()

  print_section_title("basic functions")
  basic_functions()

  print_section_title("basic use")
  basic_use()

  print_section_title("basic let assert")
  basic_let_assert()

  print_section_title("basic dynamic")
  basic_dynamic()

  print_section_title("basic erlang")
  basic_erlang()

  print_section_title("basic regex")
  basic_regex()

  print_section_title("basic filepath")
  basic_filepath()

  print_section_title("basic file")
  basic_file()

  print_section_title("basic file io")
  basic_file_io()

  print_section_title("basic os")
  basic_os()

  print_section_title("basic process")
  basic_process()

  print_section_title("basic http")
  basic_http()

  print_section_title("basic json")
  basic_json()

  print_section_title("basic prng")
  basic_prng()

  print_section_title("basic spawn")
  basic_spawn()
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
  let t = True
  let f = False

  // TODO: bool.guard + use
  // TODO: bool.lazy_guard + use

  let results = [
    "t: " <> t |> string.inspect,
    "f: " <> f |> string.inspect,
    "bool.and(t, t): " <> bool.and(t, t) |> string.inspect,
    "bool.compare(t, t): " <> bool.compare(t, t) |> string.inspect,
    "bool.exclusive_nor(t, t): " <> bool.exclusive_nor(t, t) |> string.inspect,
    "bool.exclusive_or(t, f): " <> bool.exclusive_or(t, f) |> string.inspect,
    "bool.nand(t, f): " <> bool.nand(t, f) |> string.inspect,
    "bool.negate(t): " <> bool.negate(t) |> string.inspect,
    "bool.nor(f, f): " <> bool.nor(f, f) |> string.inspect,
    "bool.or(f, t): " <> bool.or(f, t) |> string.inspect,
    "bool.to_int(t): " <> bool.to_int(t) |> string.inspect,
  ]

  list.each(results, io.println)
}

// fn stringify() -> String {}

fn basic_floats() -> Nil {
  let f1 = 3.14
  let f2 = float.negate(f1)

  let results = [
    "f1: " <> f1 |> string.inspect,
    "f2: " <> f2 |> string.inspect,
    "float.add(f1, 1.0): " <> float.add(f1, 1.0) |> string.inspect,
    "float.compare(f1, 1.0): " <> float.compare(f1, 1.0) |> string.inspect,
    "float.absolute_value(f2): " <> float.absolute_value(f2) |> string.inspect,
    "float.ceiling(f1): " <> float.ceiling(f1) |> string.inspect,
    "float.clamp(f1, 3.0, 4.0): " <> float.clamp(f1, 3.0, 4.0) |> string.inspect,
    "float.divide(f1, 2.0): " <> float.divide(f1, 2.0) |> string.inspect,
    "float.floor(f1): " <> float.floor(f1) |> string.inspect,
    "float.max(f1, 4.0): " <> float.max(f1, 4.0) |> string.inspect,
    "float.min(f1, 2.0): " <> float.min(f1, 2.0) |> string.inspect,
    "float.multiply(f1, 2.0): " <> float.multiply(f1, 2.0) |> string.inspect,
    "float.negate(f1): " <> float.negate(f1) |> string.inspect,
    "float.parse(\"3.14\"): " <> float.parse("3.14") |> string.inspect,
    "float.power(f1, 2.0) : " <> float.power(f1, 2.0) |> string.inspect,
    "float.product([1.0, 2.0, 3.0]): "
      <> float.product([1.0, 2.0, 3.0]) |> string.inspect,
    "float.round(f1): " <> float.round(f1) |> string.inspect,
    "float.square_root(f1): " <> float.square_root(f1) |> string.inspect,
    "float.subtract(f1, 1.0): " <> float.subtract(f1, 1.0) |> string.inspect,
    "float.sum([1.0, 2.0, 3.0]): "
      <> float.sum([1.0, 2.0, 3.0]) |> string.inspect,
    "float.random(): " <> float.random() |> string.inspect,
    "float.round(f1): " <> float.round(f1) |> string.inspect,
    "float.truncate(f1): " <> float.truncate(f1) |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_ints() -> Nil {
  let i1 = 2
  let i2 = 7

  let results = [
    "i1: " <> i1 |> string.inspect,
    "i2: " <> i2 |> string.inspect,
    "int.add(i1, 1): " <> int.add(i1, 1) |> string.inspect,
    "int.compare(i1, 1): " <> int.compare(i1, 1) |> string.inspect,
    "int.absolute_value(i2): " <> int.absolute_value(i2) |> string.inspect,
    "int.clamp(i1, 3, 4): " <> int.clamp(i1, 3, 4) |> string.inspect,
    "int.divide(i1, 2): " <> int.divide(i1, 2) |> string.inspect,
    "int.is_even(i1): " <> int.is_even(i1) |> string.inspect,
    "int.is_odd(i1): " <> int.is_odd(i1) |> string.inspect,
    "int.divide(i1, 2): " <> int.divide(i1, 2) |> string.inspect,
    "int.max(i1, 4): " <> int.max(i1, 4) |> string.inspect,
    "int.min(i1, 2): " <> int.min(i1, 2) |> string.inspect,
    "int.modulo(i1, 2): " <> int.modulo(i1, 2) |> string.inspect,
    "int.multiply(i1, 2): " <> int.multiply(i1, 2) |> string.inspect,
    "int.negate(i1): " <> int.negate(i1) |> string.inspect,
    "int.parse(\"3.14\"): " <> int.parse("3.14") |> string.inspect,
    "int.power(i1, 2.0) : " <> int.power(i1, 2.0) |> string.inspect,
    "int.product([1, 2, 3]): " <> int.product([1, 2, 3]) |> string.inspect,
    "int.square_root(i1): " <> int.square_root(i1) |> string.inspect,
    "int.subtract(i1, 1): " <> int.subtract(i1, 1) |> string.inspect,
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
  let r1 = Ok("Yup")
  let r2 = Error("Nope")

  // Pattern matching with case
  io.println("Pattern matching a result:")
  case r1 {
    Ok(v) -> io.println("Success: message: " <> v)
    Error(e) -> io.println("Error message:" <> e)
  }

  let results = [
    "r1: " <> r1 |> string.inspect,
    "r2: " <> r2 |> string.inspect,
    "result.all([Ok(\"Yes\"), Ok(\"Sim\")]): "
      <> result.all([Ok("Yes"), Ok("Sim")]) |> string.inspect,
    "result.flatten(Ok(Ok(r1))): "
      <> result.flatten(Ok(Ok("Yes"))) |> string.inspect,
    "result.is_error(r2): " <> result.is_error(r2) |> string.inspect,
    "result.is_ok(Ok(r1)): " <> result.is_ok(Ok(r1)) |> string.inspect,
    "result.lazy_or(r2, fn () { Ok(\"yup!!\") }): "
      <> result.lazy_or(r2, fn() { Ok("yup!!") }) |> string.inspect,
    "result.lazy_unwrap(r2, fn () { \"yup!!\" }): "
      <> result.lazy_unwrap(r2, fn() { "yup!!" }),
    "result.map(r1, string.uppercase): "
      <> result.map(r1, string.uppercase) |> string.inspect,
    "result.map_error(r2, string.uppercase): "
      <> result.map_error(r2, string.uppercase) |> string.inspect,
    "result.or(r2, r1): " <> result.or(r2, r1) |> string.inspect,
    "result.replace(r1, \"Yes\"): "
      <> result.replace(r1, "Yes") |> string.inspect,
    "result.replace_error(r2, \"No\"): "
      <> result.replace_error(r2, "No") |> string.inspect,
    "result.try(r1, fn(v) { Ok(string.uppercase(v)) }): "
      <> result.try(r1, fn(v) { Ok(string.uppercase(v)) })
    |> string.inspect,
    "result.try_recover(r2, fn(e) { Error(string.uppercase(e)) }): "
      <> result.try_recover(r2, fn(e) { Error(string.uppercase(e)) })
    |> string.inspect,
    "result.unwrap(r2, \"Yes\"): " <> result.unwrap(r2, "Yes") |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_options() -> Nil {
  let o1: Option(String) = Some("Yup")
  let o2: Option(String) = option.None

  // Pattern matching with case
  io.println("Pattern matching an option:")
  case o1 {
    Some(v) -> io.println("Message provided: " <> v)
    None -> "No message provided" |> io.println
  }

  let results = [
    "o1: " <> o1 |> string.inspect,
    "o2: " <> o2 |> string.inspect,
    "option.all([o1, o1]): " <> option.all([o1, o1]) |> string.inspect,
    "option.flatten(Some(o1)): " <> option.flatten(Some(o1)) |> string.inspect,
    "option.from_result(Ok(\"Yes\")): "
      <> option.from_result(Ok("Yes")) |> string.inspect,
    "option.is_none(o2): " <> option.is_none(o2) |> string.inspect,
    "option.is_some(o1): " <> option.is_some(o1) |> string.inspect,
    "option.lazy_or(o2, fn () { Some(\"yup!!\") }): "
      <> option.lazy_or(o2, fn() { Some("yup!!") }) |> string.inspect,
    "option.lazy_unwrap(o2, fn () { \"yup!!\" }): "
      <> option.lazy_unwrap(o2, fn() { "yup!!" }),
    "option.map(o1, string.uppercase): "
      <> option.map(o1, string.uppercase) |> string.inspect,
    "option.or(o2, o1): " <> option.or(o2, o1) |> string.inspect,
    "option.then(o1, fn(v) { Some(string.uppercase(v)) }): "
      <> option.then(o1, fn(v) { Some(string.uppercase(v)) })
    |> string.inspect,
    "option.unwrap(o2, \"Yes\"): " <> option.unwrap(o2, "Yes") |> string.inspect,
    "option.values([o1, o2, o1]): "
      <> option.values([o1, o2, o1]) |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_lists() -> Nil {
  let l0 = [2, 3, 4]
  let l1 = list.append([1, ..l0], [5])

  let keep_even_and_double = fn(n: Int) -> Result(Int, Nil) {
    case int.is_even(n) {
      True -> Ok(n * 2)
      False -> Error(Nil)
    }
  }

  let results = [
    "l1: " <> l1 |> string.inspect,
    "list.map(l1, fn(n) { n * 2 }): "
      <> list.map(l1, fn(n) { n * 2 }) |> string.inspect,
    "list.all(l1, fn(n) { n > 0 }): "
      <> list.all(l1, fn(n) { n > 0 }) |> string.inspect,
    "list.any(l1, int.is_even): " <> list.any(l1, int.is_even) |> string.inspect,
    "list.append(l1, [6]): " <> list.append(l1, [6]) |> string.inspect,
    "list.combination_pairs([1,2,3]): "
      <> list.combination_pairs([1, 2, 3]) |> string.inspect,
    "list.combinations([1,2,3,4], 3): "
      <> list.combinations([1, 2, 3, 4], 3) |> string.inspect,
    "list.concat([l1, [6]]): " <> list.concat([l1, [6]]) |> string.inspect,
    "list.contains(l1, 2): " <> list.contains(l1, 2) |> string.inspect,
    "list.each([], fn (v) { v |> string.inspect |> io.println }): "
      <> list.each([], fn(v) { v |> string.inspect |> io.println })
    |> string.inspect,
    "list.filter(l1, int.is_even): "
      <> list.filter(l1, int.is_even) |> string.inspect,
    "list.find(l1, fn(n) { n > 3 }): "
      <> list.find(l1, fn(n) { n > 3 }) |> string.inspect,
    "list.filter_map(l1, keep_even_and_double): "
      <> list.filter_map(l1, keep_even_and_double) |> string.inspect,
    "list.first(l1): " <> list.first(l1) |> string.inspect,
    "list.flat_map(l1, fn(n) { [n - 1, n + 1] }): "
      <> list.flat_map(l1, fn(n) { [n - 1, n + 1] }) |> string.inspect,
    "list.flatten([[1, 2], [3, 4]]): "
      <> list.flatten([[1, 2], [3, 4]]) |> string.inspect,
    "list.fold(l1, 1, fn(acc, curr) { acc * curr }): "
      <> list.fold(l1, 1, fn(acc, curr) { acc * curr }) |> string.inspect,
    // list.group
    "list.is_empty(l1): " <> list.is_empty(l1) |> string.inspect,
    "list.last(l1): " <> list.last(l1) |> string.inspect,
    "list.length(l1): " <> list.length(l1) |> string.inspect,
    "list.map(l1, fn(n) { n * 2 }): "
      <> list.map(l1, fn(n) { n * 2 }) |> string.inspect,
    "list.partition(l1, int.is_even): "
      <> list.partition(l1, int.is_even) |> string.inspect,
    "list.permutations([1, 2, 3]): "
      <> list.permutations([1, 2, 3]) |> string.inspect,
    "list.prepend(l1, 0): " <> list.prepend(l1, 0) |> string.inspect,
    "list.range(0, 5): " <> list.range(0, 5) |> string.inspect,
    "list.reduce(l1, fn(acc, curr) { acc * curr }): "
      <> list.reduce(l1, fn(acc, curr) { acc * curr }) |> string.inspect,
    "list.repeat(0, 5): " <> list.repeat(0, 5) |> string.inspect,
    "list.rest(l1): " <> list.rest(l1) |> string.inspect,
    "list.reverse(l1): " <> list.reverse(l1) |> string.inspect,
    "list.shuffle(l1): " <> list.shuffle(l1) |> string.inspect,
    "list.sized_chunk(l1, 2): " <> list.sized_chunk(l1, 2) |> string.inspect,
    "list.sort(l1, int.compare): "
      <> list.sort(l1, int.compare) |> string.inspect,
    "list.take(l1, 3): " <> list.take(l1, 3) |> string.inspect,
    "list.transpose([[1, 2], [3, 4], [5, 6]]): "
      <> list.transpose([[1, 2], [3, 4], [5, 6]]) |> string.inspect,
    "list.try_map(l1, fn(n) { Ok(n * 2) }): "
      <> list.try_map(l1, fn(n) { Ok(n * 2) }) |> string.inspect,
    "list.unique(l1): " <> list.unique(l1) |> string.inspect,
    // list.window
    "list.zip(l1, l1): " <> list.zip(l1, l1) |> string.inspect,
    // "list.wrap(1): " <> list.wrap(1) |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_tuples() -> Nil {
  let t1 = #(1, 2, 3)
  let #(a, b, c) = t1

  let results = [
    "t1: " <> t1 |> string.inspect,
    "t1.0: " <> t1.0 |> string.inspect,
    "Destructuring like `let #(a, b, c) = t1`",
    "a: " <> a |> string.inspect,
    "b: " <> b |> string.inspect,
    "c: " <> c |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_dicts() -> Nil {
  let d1 = dict.from_list([#("a", 1), #("b", 2), #("c", 3)])
  let d2 = dict.from_list([#("d", 4), #("e", 5)])

  let results = [
    "d1: " <> d1 |> string.inspect,
    "dict.delete(d1, \"c\"): " <> dict.delete(d1, "c") |> string.inspect,
    "dict.drop(d1, [\"c\", \"d\"]): "
      <> dict.drop(d1, ["c", "d"]) |> string.inspect,
    // dict.each
    "dict.filter(d1, fn(_k, v) { v > 2 }): "
      <> dict.filter(d1, fn(_k, v) { v > 2 }) |> string.inspect,
    "dict.get(d1, \"a\"): " <> dict.get(d1, "a") |> string.inspect,
    "dict.has_key(d1, \"a\"): " <> dict.has_key(d1, "a") |> string.inspect,
    "dict.insert(d1, \"d\", 4): " <> dict.insert(d1, "d", 4) |> string.inspect,
    "dict.keys(d1): " <> dict.keys(d1) |> string.inspect,
    "dict.map_values(d1, fn(_k, v) { v * 2 }): "
      <> dict.map_values(d1, fn(_k, v) { v * 2 }) |> string.inspect,
    "dict.merge(d1, d2): " <> dict.merge(d1, d2) |> string.inspect,
    "dict.size(d1): " <> dict.size(d1) |> string.inspect,
    "dict.take(d1, [\"a\", \"b\"]): "
      <> dict.take(d1, ["a", "b"]) |> string.inspect,
    "dict.to_list(d1): " <> dict.to_list(d1) |> string.inspect,
    // dict.update
    "dict.values(d1): " <> dict.values(d1) |> string.inspect,
  ]

  list.each(results, io.println)
}

pub type SchoolPerson {
  Teacher(name: String, subject: String)
  Student(name: String)
}

pub fn greet(sp: SchoolPerson) -> Nil {
  // Without pattern matching, only common fields can be accessed
  let greeting = "Hello! My name is " <> sp.name <> "."

  let continuation = case sp {
    Teacher(subject: s, name: _) -> " I teach " <> s <> "."
    Student(name: _) -> ""
  }
  io.println(greeting <> continuation)
}

fn basic_records() -> Nil {
  let student = Student(name: "Kakashi")
  greet(student)
  let student = Teacher(name: "Kaka Sensei", subject: "chunin exam preparation")
  greet(student)
}

fn basic_functions() -> Nil {
  // https://hexdocs.pm/gleam_stdlib/gleam/function.html
  io.println("...")
}

type Person =
  #(Int, String, String)

const people: List(Person) = [
  #(1, "Kakashi", "Hatake"), #(2, "Iruka", "Umino"), #(3, "Tenzo", "Yamato"),
  #(4, "Hiruzen", "Sarutobi"),
]

fn fetch_people() -> Result(List(Person), String) {
  Ok(people)
}

fn find_person(people: List(Person), id: Int) -> Result(Person, String) {
  people
  |> list.find(fn(person) {
    let current_id = person.0
    id == current_id
  })
  |> result.replace_error("No person found: " <> int.to_string(id))
}

fn get_initials(person: Person) -> Result(String, String) {
  let #(_, first_name, last_name) = person
  [first_name, last_name]
  |> list.map(string.first)
  |> result.all()
  |> result.map(fn(names) { string.join(names, "") })
  |> result.replace_error("Couldn't get initials")
}

fn results_with_try_and_callbacks() {
  result.try(fetch_people(), fn(people) {
    result.try(find_person(people, 1), fn(person) {
      result.try(get_initials(person), fn(initials) {
        Ok("Initials: " <> initials)
      })
    })
  })
}

fn results_with_then() {
  fetch_people()
  |> result.then(fn(people) { find_person(people, 1) })
  |> result.then(fn(person) { get_initials(person) })
  |> result.then(fn(initials) { Ok("Initials: " <> initials) })
}

fn results_with_use() {
  use people <- result.try(fetch_people())
  use person <- result.try(find_person(people, 1))
  use initials <- result.try(get_initials(person))
  Ok("Initials: " <> initials)
}

fn basic_use() -> Nil {
  let results =
    dict.from_list([
      #("Results with callback: ", results_with_try_and_callbacks()),
      #("Results with pipe: ", results_with_then()),
      #("Results with use: ", results_with_use()),
    ])
  dict.each(results, fn(label, res) {
    io.println(label)
    case res {
      Ok(v) -> io.println(v)
      Error(e) -> io.println(e)
    }
  })
}

fn basic_dynamic() -> Nil {
  io.println("...")
}

fn basic_let_assert() -> Nil {
  // Panic if error (like Rust's Result unwrap)
  let l1 = [1, 2, 3]
  let assert Ok(num1) = list.first(l1)

  let results = [
    "l1: " <> l1 |> string.inspect,
    "num1: " <> num1 |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_regex() -> Nil {
  io.println("...")
}

fn basic_erlang() -> Nil {
  // erlang.sleep(1)

  let results = [
    "erlang.erlang_timestamp(): " <> erlang.erlang_timestamp() |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_filepath() -> Nil {
  let dir1 = "."
  let dir2 = "./a/b/c/d.txt"
  let dir3 = "~"

  let join_paths = fn(paths: List(String)) { list.reduce(paths, filepath.join) }

  let results = [
    "dir1: " <> dir1,
    "dir2: " <> dir2,
    "dir3: " <> dir3,
    "filepath.base_name(dir2): " <> filepath.base_name(dir2),
    "filepath.directory_name(dir2): " <> filepath.directory_name(dir2),
    "filepath.expand(dir3): " <> filepath.expand(dir3) |> string.inspect,
    "filepath.extension(dir2): " <> filepath.extension(dir2) |> string.inspect,
    "join_paths([\".\", \"data\", \"input\"]): "
      <> join_paths([".", "data", "input"]) |> string.inspect,
    "filepath.split(dir2): " <> filepath.split(dir2) |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_file() -> Nil {
  let dir1 = "./src"
  let filename1 = "./README.md"

  let results = [
    "dir1: " <> dir1,
    "filename1: " <> filename1,
    "file.current_directory(): " <> file.current_directory() |> string.inspect,
    "file.is_directory(dir1): " <> file.is_directory(dir1) |> string.inspect,
    "file.is_file(filename1): " <> file.is_file(filename1) |> string.inspect,
    "file.is_symlink(filename1): "
      <> file.is_symlink(filename1) |> string.inspect,
    "file.get_files(dir1): " <> file.get_files(dir1) |> string.inspect,
    "file.file_info(filename1) |> result.map(fn(info) { info.size }): "
      <> file.file_info(filename1)
    |> result.map(fn(info) { info.size })
    |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_file_io() -> Nil {
  io.println("...")
}

fn basic_os() -> Nil {
  let dir1 = "."

  let results = [
    "dir1: " <> dir1,
    "os.family(): " <> os.family() |> string.inspect,
    "os.get_all_env()[\"HOME\"]: "
      <> os.get_all_env() |> dict.get("HOME") |> string.inspect,
    "os.get_env(\"USER\"): " <> os.get_env("USER") |> string.inspect,
  ]

  list.each(results, io.println)
}

fn basic_process() -> Nil {
  // https://hexdocs.pm/gleam_erlang/0.25.0/gleam/erlang/process.html#call
  io.println("...")
}

fn basic_http() -> Nil {
  io.println("...")
}

fn basic_json() -> Nil {
  // https://github.com/gleam-lang/json
  io.println("...")
}

fn basic_prng() -> Nil {
  // https://hexdocs.pm/prng/
  io.println("...")
}

fn basic_spawn() -> Nil {
  io.println("...")
}
