import gleam/bool
import gleam/dict
import gleam/float
import gleam/int
import gleam/io
import gleam/list
import gleam/result
import gleam/string

pub fn main() {
  print_section_title("Basic variables")
  basic_variables()

  print_section_title("Basic types")
  basic_types()

  print_section_title("Basic operators")
  basic_operators()

  print_section_title("basic strings")
  basic_strings()

  print_section_title("basic floats")
  basic_floats()

  print_section_title("basic ints")
  basic_ints()

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

  print_section_title("basic generics")
  basic_generics()

  print_section_title("basic custom types")
  basic_custom_types()

  print_section_title("basic enums")
  basic_enums()

  print_section_title("basic use")
  basic_use()

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

fn basic_types() -> Nil {
  // bool, float, function, int, list, dict, set, result, string
  io.println("...")
}

fn basic_operators() -> Nil {
  // == !=
  // > >= < <=
  // && ||
  // + - * / %
  // +. -. *. /.
  // <>
  // |>
  io.println("...")
}

fn basic_strings() -> Nil {
  io.println("append")
  io.println(string.append("Bar", "nacles"))

  io.println("byte_size")
  "Where's the leak, ma'am?"
  |> string.byte_size
  |> int.to_string
  |> io.println

  io.println("capitalize")
  "the inner machinations of my mind are an enigma"
  |> string.capitalise
  |> io.println

  io.println("concat")
  ["Who", " ", "are", " ", "you", " ", "people?"]
  |> string.concat
  |> io.println

  io.println("contains")
  string.contains(does: "Not even Squidward's house", contain: "id")
  |> bool.to_string
  |> io.println

  io.println("ends_with")
  "Help me boy or you're fired"
  |> string.ends_with("fired")
  |> bool.to_string
  |> io.println

  io.println("first")
  "Yeah! E mionr! All right! Yeah!"
  |> string.first
  |> result.unwrap("")
  |> io.println

  io.println("inspect")
  "Mr. Krabs, I have an idea!"
  |> string.inspect
  |> io.println

  io.println("is_empty")
  "I'm ready!"
  |> string.is_empty
  |> bool.to_string

  io.println("join")
  ["I", "wumbo", "you", "wumbo"]
  |> string.join(" ")
  |> io.println

  io.println("last")
  "We're doomed"
  |> string.last
  |> result.unwrap("")
  |> io.println

  io.println("length")
  "Living in the sunlight, loving in the moonlight, having a wonderful time!"
  |> string.length
  |> int.to_string
  |> io.println

  io.println("lowercase")
  "I CAN'T SEE MY FOREHEAD"
  |> string.lowercase
  |> io.println

  io.println("pad_left")
  io.println(string.pad_left("25", 8, "."))

  io.println("pad_right")
  io.println(string.pad_right("Meet my darling daughter, Pearl", 40, "<3"))

  // pop_grapheme
  // ...

  io.println("repeat")
  io.println(string.repeat("I'm ready!  ", 3))

  io.println("replace")
  io.println(string.replace("I'm ready!  ", "ready", "not ready"))

  io.println("reverse")
  "People order our patties"
  |> string.reverse()
  |> io.println()

  io.println("slice")
  "Magic Conch, could Squidward have some of this yummy, delicious, super-terrific sandwich?"
  |> string.slice(at_index: 7, length: 2)
  |> string.reverse()
  |> io.println

  io.println("split")
  "Ho! Ho! Ho! Stop it Patrick, you're scaring him!"
  |> string.split("!")
  |> list.filter(fn(s) { string.length(s) < 5 })
  |> list.map(fn(s) { string.trim(s) })
  |> string.join("! ")
  |> io.println

  io.println("starts_with")
  "It's okay, take your time"
  |> string.starts_with("I")
  |> bool.to_string()
  |> io.println()

  // to_graphemes
  // ...

  // to_option
  // ...

  // to_utf_codepoints
  // ...

  io.println("trim")
  "   The owner of the white sedan you left your lights on   "
  |> string.trim
  |> io.println

  io.println("uppercase")
  "This is a load of barnacles"
  |> string.uppercase
  |> io.println
}

fn basic_floats() -> Nil {
  let float1 = 3.14

  io.println("absolute_value")
  float.absolute_value(float.negate(float1))
  |> float.to_string
  |> io.println

  // add
  // ...

  io.println("ceiling")
  float1
  |> float.ceiling()
  |> float.to_string
  |> io.println

  io.println("clamp")
  float1
  |> float.clamp(3.0, 4.0)
  |> float.to_string
  |> io.println

  // compare
  // ...

  // divide
  // ...

  float1
  |> float.floor()
  |> float.to_string
  |> io.println

  // loosely_compare, loosely_equals,
  // ...

  io.println("max")
  float.max(float1, 5.0)
  |> float.to_string
  |> io.println

  io.println("min")
  float.min(float1, 5.0)
  |> float.to_string
  |> io.println

  // multiply
  // ...

  io.println("negate")
  float1
  |> float.negate
  |> float.to_string
  |> io.println

  // parse
  // ...

  io.println("power")
  float1
  *. {
    float.power(2.0, 2.0)
    |> result.unwrap(0.0)
  }
  |> float.to_string
  |> io.println

  // product
  // ...

  // random
  // ...

  // round
  // ...

  // square_root
  // ...

  // subtract
  // ...

  // sum
  // ...

  // to_string
  // ...

  // truncate
  // ...

  Nil
}

fn basic_ints() -> Nil {
  io.println("...")
  // ... Most float methods
  // base_parse
  // bitwise ...
  // digits, undigits
  // is_even
  // is_odd
  // modulo
  // negate
  // sum
  // to_base ...
  // to_string
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
  let list1 = [1, 2, 3, 4, 5]

  // With case
  list1
  |> list.find(fn(n) { n > 3 })
  |> fn(l) {
    case l {
      Ok(n) -> int.to_string(n)
      Error(Nil) -> "None"
    }
  }
  |> io.println

  // With map/unwrap
  list1
  |> list.find(fn(n) { n > 3 })
  |> result.map(fn(n) { int.to_string(n) })
  |> result.unwrap("None")
  |> io.println
}

fn basic_options() -> Nil {
  io.println("...")
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
