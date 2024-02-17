import gleam/io
import gleam/string
// import gleam/float
import gleam/int
import gleam/bool
import gleam/result

pub fn main() {
  print_section_title("Basic variables")
  basic_variables()

  print_section_title("Basic types")
  basic_types()

  print_section_title("Basic operators")
  basic_operators()

  print_section_title("basic strings")
  basic_strings()

  print_section_title("basic if else")
  basic_if_else()

  print_section_title("basic for loop")
  basic_for_loop()

  print_section_title("basic lists")
  basic_lists()

  print_section_title("basic maps")
  basic_maps()

  print_section_title("basic json")
  basic_json()

  print_section_title("basic io")
  basic_io()

  print_section_title("basic os")
  basic_os()

  print_section_title("basic spawn")
  basic_spawn()

  print_section_title("basic errors")
  basic_errors()

  print_section_title("basic generics")
  basic_generics()
}

// ---
// Utils
// ---

/// Convert a string to upper-case, wrap with newlines, print
pub fn print_section_title(s: String) -> Nil {
  io.println("\n" <> string.uppercase(s) <> "\n")
}

// ---
// Examples
// ---

pub fn basic_variables() -> Nil {
  let str1 = "The inner machinations of my mind are an enigma"
  io.println(str1)
}

pub fn basic_types() -> Nil {
  io.println("...")
  // bool, float, function, int, list, map, set, result, string
}

pub fn basic_operators() -> Nil {
  // == !=
  // > >= < <=
  // && ||
  // + - * / %
  // +. -. *. /.
  // <>
  // |>
  io.println("...")
}

pub fn basic_strings() -> Nil {
  io.println("append")
  io.println(string.append("Bar", "nacles"))

  io.println("byte_size")
  io.println(int.to_string(string.byte_size("Where's the leak, ma'am?")))

  io.println("capitalize")
  io.println(string.capitalise(
    "the inner machinations of my mind are an enigma",
  ))

  io.println("concat")
  io.println(string.concat(["Who", " ", "are", " ", "you", " ", "people?"]))

  io.println("contains")
  io.println(
    bool.to_string(string.contains(
      does: "Not even Squidward's house",
      contain: "id",
    )),
  )

  io.println("ends_with")
  io.println(
    bool.to_string(string.ends_with("Help me boy or you're fired", "fired")),
  )

  io.println("first")
  io.println(result.unwrap(string.first("Yeah! E mionr! All right! Yeah!"), ""))

  io.println("inspect")
  io.println(string.inspect("Mr. Krabs, I have an idea!"))

  io.println("is_empty")
  io.println(bool.to_string(string.is_empty("I'm ready!")))

  io.println("join")
  io.println(string.join(["I", "wumbo", "you", "wumbo"], " "))

  io.println("last")
  io.println(result.unwrap(string.last("We're doomed"), ""))

  io.println("length")
  io.println(
    int.to_string(string.length(
      "Living in the sunlight, loving in the moonlight, having a wonderful time!",
    )),
  )

  io.println("lowercase")
  io.println(string.lowercase("I CAN'T SEE MY FOREHEAD"))

  io.println("pad_left")
  io.println(string.pad_left("25", 8, "."))

  io.println("pad_right")
  io.println(string.pad_right("Meet my darling daughter, Pearl", 40, "<3"))
  // TODO:
  // pop_grapheme
  // repeat
  // replace
  // reverse
  // slice
  // split, split_once,
  // starts_with
  // to_graphemes
  // to_option
  // to_utf_codepoints
  // trim, trim_left, trim_right
  // uppercase
}

pub fn basic_if_else() -> Nil {
  io.println("...")
}

pub fn basic_for_loop() -> Nil {
  io.println("...")
}

pub fn basic_lists() -> Nil {
  io.println("...")
}

pub fn basic_maps() -> Nil {
  io.println("...")
}

pub fn basic_json() -> Nil {
  io.println("...")
}

pub fn basic_io() -> Nil {
  io.println("...")
}

pub fn basic_os() -> Nil {
  io.println("...")
}

pub fn basic_spawn() -> Nil {
  io.println("...")
}

pub fn basic_errors() -> Nil {
  io.println("...")
}

pub fn basic_generics() -> Nil {
  io.println("...")
}
