import envoy
import filepath as path
import gleam/bool
import gleam/dict
import gleam/dynamic
import gleam/erlang
import gleam/erlang/os
import gleam/erlang/process
import gleam/float
import gleam/function
import gleam/int
import gleam/io
import gleam/json
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/otp/task
import gleam/regexp
import gleam/result
import gleam/string.{inspect}
import gleam/yielder
import prng/random
import simplifile as file
import snag
import youid/uuid

// ---
// Main
// ---

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

  print_section_title("basic function recursion")
  basic_function_recursion()

  print_section_title("basic function captures")
  basic_function_captures()

  print_section_title("basic yielder")
  basic_yielder()

  print_section_title("basic use")
  basic_use()

  print_section_title("basic let assert")
  basic_let_assert()

  print_section_title("basic dynamic")
  basic_dynamic()

  print_section_title("basic erlang")
  basic_erlang()

  print_section_title("basic regexp")
  basic_regexp()

  print_section_title("basic path")
  basic_path()

  print_section_title("basic file")
  basic_file()

  print_section_title("basic file io")
  basic_file_io()

  print_section_title("basic os")
  basic_os()

  print_section_title("basic process")
  basic_process()

  print_section_title("basic task")
  basic_task()

  print_section_title("basic env")
  basic_env()

  print_section_title("basic uuid")
  basic_uuid()

  print_section_title("basic json")
  basic_json()

  print_section_title("basic decode")
  basic_decode()

  print_section_title("basic prng")
  basic_prng()
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
    "t: " <> t |> inspect,
    "f: " <> f |> inspect,
    "bool.and(t, t): " <> bool.and(t, t) |> inspect,
    "bool.exclusive_nor(t, t): " <> bool.exclusive_nor(t, t) |> inspect,
    "bool.exclusive_or(t, f): " <> bool.exclusive_or(t, f) |> inspect,
    "bool.nand(t, f): " <> bool.nand(t, f) |> inspect,
    "bool.negate(t): " <> bool.negate(t) |> inspect,
    "bool.nor(f, f): " <> bool.nor(f, f) |> inspect,
    "bool.or(f, t): " <> bool.or(f, t) |> inspect,
  ]

  list.each(results, io.println)
}

// fn stringify() -> String {}

fn basic_floats() -> Nil {
  let f1 = 3.14
  let f2 = float.negate(f1)

  let results = [
    "f1: " <> f1 |> inspect,
    "f2: " <> f2 |> inspect,
    "float.add(f1, 1.0): " <> float.add(f1, 1.0) |> inspect,
    "float.compare(f1, 1.0): " <> float.compare(f1, 1.0) |> inspect,
    "float.absolute_value(f2): " <> float.absolute_value(f2) |> inspect,
    "float.ceiling(f1): " <> float.ceiling(f1) |> inspect,
    "float.clamp(f1, 3.0, 4.0): " <> float.clamp(f1, 3.0, 4.0) |> inspect,
    "float.divide(f1, 2.0): " <> float.divide(f1, 2.0) |> inspect,
    "float.floor(f1): " <> float.floor(f1) |> inspect,
    "float.max(f1, 4.0): " <> float.max(f1, 4.0) |> inspect,
    "float.min(f1, 2.0): " <> float.min(f1, 2.0) |> inspect,
    "float.multiply(f1, 2.0): " <> float.multiply(f1, 2.0) |> inspect,
    "float.negate(f1): " <> float.negate(f1) |> inspect,
    "float.parse(\"3.14\"): " <> float.parse("3.14") |> inspect,
    "float.power(f1, 2.0) : " <> float.power(f1, 2.0) |> inspect,
    "float.product([1.0, 2.0, 3.0]): "
      <> float.product([1.0, 2.0, 3.0]) |> inspect,
    "float.round(f1): " <> float.round(f1) |> inspect,
    "float.square_root(f1): " <> float.square_root(f1) |> inspect,
    "float.subtract(f1, 1.0): " <> float.subtract(f1, 1.0) |> inspect,
    "float.sum([1.0, 2.0, 3.0]): " <> float.sum([1.0, 2.0, 3.0]) |> inspect,
    "float.random(): " <> float.random() |> inspect,
    "float.round(f1): " <> float.round(f1) |> inspect,
    "float.truncate(f1): " <> float.truncate(f1) |> inspect,
  ]

  list.each(results, io.println)
}

fn basic_ints() -> Nil {
  let i1 = 2
  let i2 = 7

  let results = [
    "i1: " <> i1 |> inspect,
    "i2: " <> i2 |> inspect,
    "int.add(i1, 1): " <> int.add(i1, 1) |> inspect,
    "int.compare(i1, 1): " <> int.compare(i1, 1) |> inspect,
    "int.absolute_value(i2): " <> int.absolute_value(i2) |> inspect,
    "int.clamp(i1, 3, 4): " <> int.clamp(i1, 3, 4) |> inspect,
    "int.divide(i1, 2): " <> int.divide(i1, 2) |> inspect,
    "int.is_even(i1): " <> int.is_even(i1) |> inspect,
    "int.is_odd(i1): " <> int.is_odd(i1) |> inspect,
    "int.divide(i1, 2): " <> int.divide(i1, 2) |> inspect,
    "int.max(i1, 4): " <> int.max(i1, 4) |> inspect,
    "int.min(i1, 2): " <> int.min(i1, 2) |> inspect,
    "int.modulo(i1, 2): " <> int.modulo(i1, 2) |> inspect,
    "int.multiply(i1, 2): " <> int.multiply(i1, 2) |> inspect,
    "int.negate(i1): " <> int.negate(i1) |> inspect,
    "int.parse(\"3.14\"): " <> int.parse("3.14") |> inspect,
    "int.power(i1, 2.0) : " <> int.power(i1, 2.0) |> inspect,
    "int.product([1, 2, 3]): " <> int.product([1, 2, 3]) |> inspect,
    "int.square_root(i1): " <> int.square_root(i1) |> inspect,
    "int.subtract(i1, 1): " <> int.subtract(i1, 1) |> inspect,
    "int.sum([1, 2, 3]): " <> int.sum([1, 2, 3]) |> inspect,
  ]

  list.each(results, io.println)
}

fn basic_strings() -> Nil {
  let results = [
    "string.append(\"Bar\", \"nacles\"): " <> string.append("Bar", "nacles"),
    "string.byte_size(\"Where's the leak, ma'am?\"): "
      <> string.byte_size("Where's the leak, ma'am?") |> inspect,
    "string.capitalise(\"the owner of the white sedan, you left your lights on\"): "
      <> string.capitalise(
      "the owner of the white sedan, you left your lights on",
    ),
    "string.concat([\"Who\", \" \", \"are\", \" \", \"you\", \" \", \"people?\"]): "
      <> string.concat(["Who", " ", "are", " ", "you", " ", "people?"]),
    "string.contains(does: \"Not even Squidward's house\", contain: \"id\"): "
      <> string.contains(does: "Not even Squidward's house", contain: "id")
    |> inspect,
    "string.ends_with(\"Help me boy or you're fired\", \"fired\"): "
      <> string.ends_with("Help me boy or you're fired", "fired")
    |> inspect,
    "string.first(\"Yeah! E minor! All right! Yeah!\"): "
      <> string.first("Yeah! E minor! All right! Yeah!") |> inspect,
    "inspect([1, 2, 3]): " <> inspect([1, 2, 3]),
    "string.is_empty(\"Mr. Krabs, I have an idea!\"): "
      <> string.is_empty("Mr. Krabs, I have an idea!") |> inspect,
    "string.join([\"I\", \"wumbo\", \"you\", \"wumbo\"], \" \"): "
      <> string.join(["I", "wumbo", "you", "wumbo"], " "),
    "string.last(\"We're doomed\"): " <> string.last("We're doomed") |> inspect,
    "string.length(\"Meet my darling daughter, Pearl!\"): "
      <> string.length("Meet my darling daughter, Pearl!") |> inspect,
    "string.lowercase(\"I CAN'T SEE MY FOREHEAD\"): "
      <> string.lowercase("I CAN'T SEE MY FOREHEAD"),
    "string.pad_start(\"25\", 4, \"0\"): " <> string.pad_start("25", 4, "0"),
    "string.repeat(\"I'm ready!  \", 3): " <> string.repeat("I'm ready!  ", 3),
    "string.pad_end(\"25\", 4, \".\"): " <> string.pad_end("25", 4, "."),
    "string.pop_grapheme(\"This is a load of barnacles!\"): "
      <> string.pop_grapheme("This is a load of barnacles!") |> inspect,
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
    |> inspect,
    "string.starts_with(\"It's okay, take your time\", \"I\"): "
      <> string.starts_with("It's okay, take your time", "I") |> inspect,
    "string.to_graphemes(\"Me hoy minoy ✏️\") :"
      <> string.to_graphemes("Me hoy minoy ✏️") |> inspect,
    "string.trim(\"   Too bad that didn't kill me   \"): "
      <> string.trim("   Too bad that didn't kill me   "),
    "string.uppercase(\"moar!\"): " <> string.uppercase("moar!"),
    "string.to_utf_codepoints(\"Você tá bem?\"): "
      <> string.to_utf_codepoints("Você tá bem?") |> inspect,
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
    "r1: " <> r1 |> inspect,
    "r2: " <> r2 |> inspect,
    "result.all([Ok(\"Yes\"), Ok(\"Sim\")]): "
      <> result.all([Ok("Yes"), Ok("Sim")]) |> inspect,
    "result.flatten(Ok(Ok(r1))): " <> result.flatten(Ok(Ok("Yes"))) |> inspect,
    "result.is_error(r2): " <> result.is_error(r2) |> inspect,
    "result.is_ok(Ok(r1)): " <> result.is_ok(Ok(r1)) |> inspect,
    "result.lazy_or(r2, fn () { Ok(\"yup!!\") }): "
      <> result.lazy_or(r2, fn() { Ok("yup!!") }) |> inspect,
    "result.lazy_unwrap(r2, fn () { \"yup!!\" }): "
      <> result.lazy_unwrap(r2, fn() { "yup!!" }),
    "result.map(r1, string.uppercase): "
      <> result.map(r1, string.uppercase) |> inspect,
    "result.map_error(r2, string.uppercase): "
      <> result.map_error(r2, string.uppercase) |> inspect,
    "result.or(r2, r1): " <> result.or(r2, r1) |> inspect,
    "result.replace(r1, \"Yes\"): " <> result.replace(r1, "Yes") |> inspect,
    "result.replace_error(r2, \"No\"): "
      <> result.replace_error(r2, "No") |> inspect,
    "result.try(r1, fn(v) { Ok(string.uppercase(v)) }): "
      <> result.try(r1, fn(v) { Ok(string.uppercase(v)) })
    |> inspect,
    "result.try_recover(r2, fn(e) { Error(string.uppercase(e)) }): "
      <> result.try_recover(r2, fn(e) { Error(string.uppercase(e)) })
    |> inspect,
    "result.unwrap(r2, \"Yes\"): " <> result.unwrap(r2, "Yes") |> inspect,
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
    "o1: " <> o1 |> inspect,
    "o2: " <> o2 |> inspect,
    "option.all([o1, o1]): " <> option.all([o1, o1]) |> inspect,
    "option.flatten(Some(o1)): " <> option.flatten(Some(o1)) |> inspect,
    "option.from_result(Ok(\"Yes\")): "
      <> option.from_result(Ok("Yes")) |> inspect,
    "option.is_none(o2): " <> option.is_none(o2) |> inspect,
    "option.is_some(o1): " <> option.is_some(o1) |> inspect,
    "option.lazy_or(o2, fn () { Some(\"yup!!\") }): "
      <> option.lazy_or(o2, fn() { Some("yup!!") }) |> inspect,
    "option.lazy_unwrap(o2, fn () { \"yup!!\" }): "
      <> option.lazy_unwrap(o2, fn() { "yup!!" }),
    "option.map(o1, string.uppercase): "
      <> option.map(o1, string.uppercase) |> inspect,
    "option.or(o2, o1): " <> option.or(o2, o1) |> inspect,
    "option.then(o1, fn(v) { Some(string.uppercase(v)) }): "
      <> option.then(o1, fn(v) { Some(string.uppercase(v)) })
    |> inspect,
    "option.unwrap(o2, \"Yes\"): " <> option.unwrap(o2, "Yes") |> inspect,
    "option.values([o1, o2, o1]): " <> option.values([o1, o2, o1]) |> inspect,
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
    "l1: " <> l1 |> inspect,
    "list.map(l1, fn(n) { n * 2 }): "
      <> list.map(l1, fn(n) { n * 2 }) |> inspect,
    "list.all(l1, fn(n) { n > 0 }): "
      <> list.all(l1, fn(n) { n > 0 }) |> inspect,
    "list.any(l1, int.is_even): " <> list.any(l1, int.is_even) |> inspect,
    "list.append(l1, [6]): " <> list.append(l1, [6]) |> inspect,
    "list.combination_pairs([1,2,3]): "
      <> list.combination_pairs([1, 2, 3]) |> inspect,
    "list.combinations([1,2,3,4], 3): "
      <> list.combinations([1, 2, 3, 4], 3) |> inspect,
    "list.contains(l1, 2): " <> list.contains(l1, 2) |> inspect,
    "list.each([], fn (v) { v |> inspect |> io.println }): "
      <> list.each([], fn(v) { v |> inspect |> io.println })
    |> inspect,
    "list.filter(l1, int.is_even): " <> list.filter(l1, int.is_even) |> inspect,
    "list.find(l1, fn(n) { n > 3 }): "
      <> list.find(l1, fn(n) { n > 3 }) |> inspect,
    "list.filter_map(l1, keep_even_and_double): "
      <> list.filter_map(l1, keep_even_and_double) |> inspect,
    "list.first(l1): " <> list.first(l1) |> inspect,
    "list.flat_map(l1, fn(n) { [n - 1, n + 1] }): "
      <> list.flat_map(l1, fn(n) { [n - 1, n + 1] }) |> inspect,
    "list.flatten([[1, 2], [3, 4]]): "
      <> list.flatten([[1, 2], [3, 4]]) |> inspect,
    "list.fold(l1, 1, fn(acc, curr) { acc * curr }): "
      <> list.fold(l1, 1, fn(acc, curr) { acc * curr }) |> inspect,
    // list.group
    "list.is_empty(l1): " <> list.is_empty(l1) |> inspect,
    "list.last(l1): " <> list.last(l1) |> inspect,
    "list.length(l1): " <> list.length(l1) |> inspect,
    "list.map(l1, fn(n) { n * 2 }): "
      <> list.map(l1, fn(n) { n * 2 }) |> inspect,
    "list.partition(l1, int.is_even): "
      <> list.partition(l1, int.is_even) |> inspect,
    "list.permutations([1, 2, 3]): " <> list.permutations([1, 2, 3]) |> inspect,
    "list.prepend(l1, 0): " <> list.prepend(l1, 0) |> inspect,
    "list.range(0, 5): " <> list.range(0, 5) |> inspect,
    "list.reduce(l1, fn(acc, curr) { acc * curr }): "
      <> list.reduce(l1, fn(acc, curr) { acc * curr }) |> inspect,
    "list.repeat(0, 5): " <> list.repeat(0, 5) |> inspect,
    "list.rest(l1): " <> list.rest(l1) |> inspect,
    "list.reverse(l1): " <> list.reverse(l1) |> inspect,
    "list.shuffle(l1): " <> list.shuffle(l1) |> inspect,
    "list.sized_chunk(l1, 2): " <> list.sized_chunk(l1, 2) |> inspect,
    "list.sort(l1, int.compare): " <> list.sort(l1, int.compare) |> inspect,
    "list.take(l1, 3): " <> list.take(l1, 3) |> inspect,
    "list.transpose([[1, 2], [3, 4], [5, 6]]): "
      <> list.transpose([[1, 2], [3, 4], [5, 6]]) |> inspect,
    "list.try_map(l1, fn(n) { Ok(n * 2) }): "
      <> list.try_map(l1, fn(n) { Ok(n * 2) }) |> inspect,
    "list.unique(l1): " <> list.unique(l1) |> inspect,
    // list.window
    "list.zip(l1, l1): " <> list.zip(l1, l1) |> inspect,
    // "list.wrap(1): " <> list.wrap(1) |> inspect,
  ]

  list.each(results, io.println)
}

fn basic_tuples() -> Nil {
  let t1 = #(1, 2, 3)
  let #(a, b, c) = t1

  let results = [
    "t1: " <> t1 |> inspect,
    "t1.0: " <> t1.0 |> inspect,
    "Destructuring like `let #(a, b, c) = t1`",
    "a: " <> a |> inspect,
    "b: " <> b |> inspect,
    "c: " <> c |> inspect,
  ]

  list.each(results, io.println)
}

fn basic_dicts() -> Nil {
  let d1 = dict.from_list([#("a", 1), #("b", 2), #("c", 3)])
  let d2 = dict.from_list([#("d", 4), #("e", 5)])

  let results = [
    "d1: " <> d1 |> inspect,
    "dict.delete(d1, \"c\"): " <> dict.delete(d1, "c") |> inspect,
    "dict.drop(d1, [\"c\", \"d\"]): " <> dict.drop(d1, ["c", "d"]) |> inspect,
    // dict.each
    "dict.filter(d1, fn(_k, v) { v > 2 }): "
      <> dict.filter(d1, fn(_k, v) { v > 2 }) |> inspect,
    "dict.get(d1, \"a\"): " <> dict.get(d1, "a") |> inspect,
    "dict.has_key(d1, \"a\"): " <> dict.has_key(d1, "a") |> inspect,
    "dict.insert(d1, \"d\", 4): " <> dict.insert(d1, "d", 4) |> inspect,
    "dict.keys(d1): " <> dict.keys(d1) |> inspect,
    "dict.map_values(d1, fn(_k, v) { v * 2 }): "
      <> dict.map_values(d1, fn(_k, v) { v * 2 }) |> inspect,
    "dict.merge(d1, d2): " <> dict.merge(d1, d2) |> inspect,
    "dict.size(d1): " <> dict.size(d1) |> inspect,
    "dict.take(d1, [\"a\", \"b\"]): " <> dict.take(d1, ["a", "b"]) |> inspect,
    "dict.to_list(d1): " <> dict.to_list(d1) |> inspect,
    // dict.update
    "dict.values(d1): " <> dict.values(d1) |> inspect,
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

fn recursive_sum(ints: List(Int), total: Int) -> Int {
  case ints {
    [first, ..rest] -> recursive_sum(rest, total + first)
    [] -> total
  }
}

fn basic_function_recursion() -> Nil {
  io.println(
    "recursive_sum([1, 2, 3], 0): " <> recursive_sum([1, 2, 3], 0) |> inspect,
  )
}

fn basic_function_captures() -> Nil {
  let add_one = int.add(1, _)
  io.println("add_one(2): " <> add_one(2) |> inspect)
}

fn basic_yielder() -> Nil {
  let numbers = [1, 2, 3, 4, 5]
  numbers
  |> yielder.from_list
  |> yielder.filter(int.is_even)
  |> yielder.map(fn(n) { n |> int.power(2.0) |> result.unwrap(0.0) })
  |> yielder.map(float.round)
  |> inspect
  |> io.println
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

fn results_with_callback() {
  result.try(fetch_people(), fn(people) {
    result.try(find_person(people, 1), fn(person) {
      result.try(get_initials(person), fn(initials) {
        Ok("Initials: " <> initials)
      })
    })
  })
}

fn results_with_pipe() {
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

fn as_snag(res, message) {
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

fn snag_try(res, message, func) {
  result.try(as_snag(res, message), func)
}

fn results_with_snag() {
  use people <- snag_try(fetch_people(), "Oops, couldn't fetch")
  use person <- snag_try(find_person(people, 1), "Oops, couldn't find person")
  use initials <- snag_try(get_initials(person), "Oops, couldn't get initials")
  Ok("Initials: " <> initials)
}

fn basic_use() -> Nil {
  let outputs = [
    "Results with callback: " <> results_with_callback() |> inspect,
    "Results with pipe: " <> results_with_pipe() |> inspect,
    "Results with use: " <> results_with_use() |> inspect,
    "Results with snag: " <> results_with_snag() |> inspect,
  ]
  list.each(outputs, io.println)
}

fn basic_let_assert() -> Nil {
  // Panic if error (like Rust's Result unwrap)
  let l1 = [1, 2, 3]
  let assert Ok(num1) = list.first(l1)

  let results = ["l1: " <> l1 |> inspect, "num1: " <> num1 |> inspect]

  list.each(results, io.println)
}

fn basic_regexp() -> Nil {
  // String to test against
  let s1 =
    "In order to survive, we cling to all we know and understand. "
    <> "And label it reality. "
    <> "But knowledge and understanding are ambiguous. "
    <> "That reality could be an illusion. "
    <> "All humans live with the wrong assumptions."

  let check = fn(pattern: String, str: String) -> Bool {
    let assert Ok(re) = regexp.from_string(pattern)
    regexp.check(re, str)
  }

  io.println(s1)
  let results = [
    "contains 'ambiguous': " <> check("ambiguous", s1) |> inspect,
    "begins_with 'In': " <> check("^In", s1) |> inspect,
    "ends_with 'assumptions.': " <> check("assumptions.$", s1) |> inspect,
    "one_or_more 'Al+.': " <> check("Al+", s1) |> inspect,
    "zero_or_one 'labels?': " <> check("labels?", s1) |> inspect,
    "zero_or_more 'il*usion': " <> check("il*usion", s1) |> inspect,
    "one_of 'B[aeiou]t': " <> check("B[aeiou]t", s1) |> inspect,
    "match_or 'equivocal|ambiguous': "
      <> check("equivocal|ambiguous", s1) |> inspect,
    "not '[^sharingan]': " <> check("[^sharingan]", s1) |> inspect,
    "any_char 'under.tanding': " <> check("under.tanding", s1) |> inspect,
    "zero_to_three 'Al{0,3}': " <> check("Al{0,3}", s1) |> inspect,
    "insensitive '(?i)REALITY': " <> check("(?i)REALITY", s1) |> inspect,
    "seven_lower '[a-z]{7}': " <> check("[a-z]{7}", s1) |> inspect,
    "four_alnum '[[:alnum:]]{4} reality': "
      <> check("[[:alnum:]]{4} reality", s1) |> inspect,
  ]

  list.each(results, io.println)
}

fn basic_erlang() -> Nil {
  // erlang.sleep(1)

  let results = [
    "erlang.erlang_timestamp(): " <> erlang.erlang_timestamp() |> inspect,
  ]

  list.each(results, io.println)
}

fn basic_path() -> Nil {
  let dir1 = "."
  let dir2 = "./a/b/c/d.txt"
  let dir3 = "~"

  let join_paths = fn(paths: List(String)) { list.reduce(paths, path.join) }

  let results = [
    "dir1: " <> dir1,
    "dir2: " <> dir2,
    "dir3: " <> dir3,
    "path.base_name(dir2): " <> path.base_name(dir2),
    "path.directory_name(dir2): " <> path.directory_name(dir2),
    "path.expand(dir3): " <> path.expand(dir3) |> inspect,
    "path.extension(dir2): " <> path.extension(dir2) |> inspect,
    "join_paths([\".\", \"data\", \"input\"]): "
      <> join_paths([".", "data", "input"]) |> inspect,
    "path.split(dir2): " <> path.split(dir2) |> inspect,
  ]

  list.each(results, io.println)
}

fn basic_file() -> Nil {
  let dir1 = "./src"
  let filename1 = "./README.md"

  let results = [
    "dir1: " <> dir1,
    "filename1: " <> filename1,
    "file.current_directory(): " <> file.current_directory() |> inspect,
    "file.is_directory(dir1): " <> file.is_directory(dir1) |> inspect,
    "file.is_file(filename1): " <> file.is_file(filename1) |> inspect,
    "file.is_symlink(filename1): " <> file.is_symlink(filename1) |> inspect,
    "file.get_files(dir1): " <> file.get_files(dir1) |> inspect,
    "file.file_info(filename1) |> result.map(fn(info) { info.size }): "
      <> file.file_info(filename1)
    |> result.map(fn(info) { info.size })
    |> inspect,
  ]

  list.each(results, io.println)
}

fn file_io_example() {
  let data_dir = path.join(".", "data")
  let input_dir = path.join(data_dir, "input")
  let output_dir = path.join(data_dir, "output")
  let file1_name = "report.txt"
  let file1_path = path.join(input_dir, file1_name)
  let file1_copy_path = path.join(output_dir, file1_name)

  use _ <- result.try(file.create_directory_all(input_dir))
  use _ <- result.try(file.create_directory(output_dir))
  use _ <- result.try(file.create_file(file1_path))
  use _ <- result.try(file.write(file1_path, "Who you calling pinhead?"))
  use contents1 <- result.try(file.read(file1_path))
  io.println("file: " <> file1_path)
  io.println("contents: " <> contents1)

  use _ <- result.try(file.copy_file(file1_path, file1_copy_path))
  use _ <- result.try(file.append(file1_copy_path, " I can't see my forehead."))
  use contents2 <- result.try(file.read(file1_copy_path))
  io.println("file: " <> file1_copy_path)
  io.println("contents: " <> contents2)

  use _ <- result.try(file.delete(file1_copy_path))
  use _ <- result.try(file.delete(file1_path))
  use _ <- result.try(file.delete(output_dir))
  use _ <- result.try(file.delete(input_dir))
  use _ <- result.try(file.delete(data_dir))
  Ok(Nil)
}

fn basic_file_io() -> Nil {
  let res = file_io_example()
  case res {
    Ok(_) -> io.println("Success")
    Error(e) -> e |> inspect |> io.println()
  }
}

fn basic_os() -> Nil {
  let dir1 = "."
  let results = ["dir1: " <> dir1, "os.family(): " <> os.family() |> inspect]
  list.each(results, io.println)
}

fn basic_process() -> Nil {
  process.sleep(1)

  let results = ["process.self(): " <> process.self() |> inspect]

  list.each(results, io.println)
}

fn basic_task() -> Nil {
  list.range(0, 10)
  |> list.map(fn(n) { task.async(fn() { n * 2 }) })
  |> list.map(fn(t) { task.await(t, 100) })
  |> inspect
  |> io.println
}

fn basic_env() -> Nil {
  let results = [
    "envoy.all() |> dict.get(\"HOME\"): "
      <> envoy.all() |> dict.get("HOME") |> inspect,
    "envoy.get(\"USER\"): " <> envoy.get("USER") |> inspect,
  ]

  list.each(results, io.println)
}

fn basic_uuid() -> Nil {
  let results = [
    "uuid.v4_string(): " <> uuid.v4_string(),
    "uuid.v4(): " <> uuid.v4() |> inspect,
    "uuid.v4_string() |> uuid.from_string: "
      <> uuid.v4_string() |> uuid.from_string |> inspect,
    "uuid.v4() |> uuid.to_string: " <> uuid.v4() |> uuid.to_string,
    "uuid.v4() |> uuid.variant: " <> uuid.v4() |> uuid.variant |> inspect,
    "uuid.v4() |> uuid.version: " <> uuid.v4() |> uuid.version |> inspect,
  ]

  list.each(results, io.println)
}

fn basic_dynamic() -> Nil {
  let results = [
    // any
    "dynamic.bool(dynamic.from(True)): "
      <> dynamic.bool(dynamic.from(True)) |> inspect,
    "dynamic.classify(dynamic.from(True)): "
      <> dynamic.classify(dynamic.from(True)) |> inspect,
    // decode1, ..., decode9
    // dict
    "dynamic.dynamic(dynamic.from(True)): "
      <> dynamic.dynamic(dynamic.from(True)) |> inspect,
    // element
    // field
    "dynamic.float(dynamic.from(1.0)): "
      <> dynamic.float(dynamic.from(1.0)) |> inspect,
    // from
    "dynamic.int(dynamic.from(1)): " <> dynamic.int(dynamic.from(1)) |> inspect,
    "dynamic.list(dynamic.int)(dynamic.from([1, 2, 3])): "
      <> dynamic.list(dynamic.int)(dynamic.from([1, 2, 3])) |> inspect,
    // optional
    // result
    "dynamic.string(dynamic.from(\"Finland!\")): "
      <> dynamic.string(dynamic.from("Finland!")) |> inspect,
    // tuple2, ... tuple6
  ]

  list.each(results, io.println)
}

pub type Jutsu {
  Jutsu(name: String, chakra_nature: String, description: String)
}

fn jutsu_json_encode(jutsu: Jutsu) -> json.Json {
  json.object([
    #("name", json.string(jutsu.name)),
    #("chakraNature", json.string(jutsu.chakra_nature)),
    #("description", json.string(jutsu.description)),
  ])
}

type Decoder(a) =
  fn(dynamic.Dynamic) -> Result(a, List(dynamic.DecodeError))

fn get_jutsu_json_decoder() -> Decoder(Jutsu) {
  dynamic.decode3(
    Jutsu,
    dynamic.field("name", dynamic.string),
    dynamic.field("chakraNature", dynamic.string),
    dynamic.field("description", dynamic.string),
  )
}

pub type Ninja {
  Ninja(
    first_name: String,
    last_name: String,
    age: Int,
    jutsus: Option(List(Jutsu)),
  )
}

fn ninja_json_encode(ninja: Ninja) -> json.Json {
  json.object([
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

fn get_ninja_json_decoder() -> Decoder(Ninja) {
  dynamic.decode4(
    Ninja,
    dynamic.field("firstName", dynamic.string),
    dynamic.field("lastName", dynamic.string),
    dynamic.field("age", dynamic.int),
    dynamic.field(
      "jutsus",
      dynamic.optional(dynamic.list(get_jutsu_json_decoder())),
    ),
  )
}

fn decode_ninja(data: String) -> Result(Ninja, json.DecodeError) {
  json.decode(data, get_ninja_json_decoder())
}

fn basic_json() -> Nil {
  Ninja(
    first_name: "Kakashi",
    last_name: "Hatake",
    age: 27,
    jutsus: Some([
      Jutsu(
        name: "Chidori",
        chakra_nature: "Lightning",
        description: "Lightning blade",
      ),
    ]),
  )
  |> function.tap(io.debug)
  |> ninja_json_encode
  |> json.to_string
  |> function.tap(io.debug)
  |> decode_ninja
  |> inspect
  |> io.println
}

fn basic_decode() -> Nil {
  // https://github.com/lpil/decode
  // https://hexdocs.pm/decode/decode.html
  // https://github.com/lpil/decode/blob/main/test/decode_test.gleam#L23
  io.println("...")
}

fn basic_prng() -> Nil {
  let coin_toss = random.choose(True, False)

  // Get random sample and convert to string
  let s = fn(g: random.Generator(a)) { random.random_sample(g) |> inspect }

  let results = [
    // Single value
    "random.choose(True, False): " <> random.choose(True, False) |> s,
    "random.constant(True): " <> random.constant(True) |> s,
    "random.float(0.0, 1.0): " <> random.float(0.0, 1.0) |> s,
    "random.int(1, 10): " <> random.int(1, 10) |> s,
    "random.uniform(1, [2, 3, 5, 6]): " <> random.uniform(1, [2, 3, 5, 6]) |> s,
    // List of values
    " random.fixed_size_list(coin_toss, 3): "
      <> random.fixed_size_list(coin_toss, 3) |> s,
    "random.fixed_size_string(3): " <> random.fixed_size_string(3) |> s,
    "random.list(coin_toss): " <> random.list(coin_toss) |> s,
    "random.pair(coin_toss, coin_toss) : "
      <> random.pair(coin_toss, coin_toss) |> s,
    "random.map(random.int(1, 5), fn(n) { int.power(n, 2.0) }): "
      <> random.map(random.int(1, 5), fn(n) { int.power(n, 2.0) }) |> s,
    "random.string(): " <> random.string() |> s,
  ]

  list.each(results, io.println)
}
