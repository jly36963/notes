module StringMap =
  Map.Make({
    type t = string;
    let compare = compare;
  });

// ---
// Utils
// ---

let print_section_title = (title: string): unit => {
  title |> String.uppercase_ascii |> (s => "\n" ++ s ++ "\n") |> print_endline;
};

module Fmt = {
  let fmt_str_list = values => {
    values |> String.concat(", ") |> (v => "[" ++ v ++ "]");
  };
  let fmt_int_list = values => {
    values |> List.map(Int.to_string) |> fmt_str_list;
  };
  let _fmt_float_list = values => {
    values |> List.map(Float.to_string) |> fmt_str_list;
  };
  let bytes_to_list_int = (data: bytes): list(int) => {
    data |> Bytes.fold_left((acc, curr) => acc @ [Char.code(curr)], []);
  };
  let fmt_bytes = data => {
    data |> bytes_to_list_int |> fmt_int_list;
  };
};

module Opt = {
  let _or_else = (fn, opt) => {
    Option.is_some(opt) ? opt : fn();
  };
  let _unwrap_or_else = (fn, opt) => {
    switch (opt) {
    | Some(v) => v
    | None => fn()
    };
  };

  let filter = (fn, opt) => {
    switch (opt) {
    | Some(v) => fn(v) ? Some(v) : None
    | None => None
    };
  };
};

let string_to_list = s => s |> String.to_seq |> List.of_seq;

module Str = {
  let slice = (start: int, stop: int, str: string): option(string) => {
    Some(str)
    |> Opt.filter(_ => start >= 0)
    |> Opt.filter(_ => stop < String.length(str))
    |> Option.map(str => {
         let len = stop - start;
         String.sub(str, start, len);
       });
  };

  let contains = (~substr: string, str: string): bool => {
    str
    |> string_to_list
    |> List.mapi((idx, _) => {
         str
         |> slice(idx, String.length(str) - 1)
         |> Option.map(hs => String.starts_with(~prefix=substr, hs))
       })
    |> List.filter_map(Fun.id)
    |> List.exists(v => v);
  };
};

module Numbers = {
  let clamp = (low, high, value): int => {
    switch (value) {
    | v when v < low => low
    | v when v > high => high
    | v => v
    };
  };

  let range = (start, stop, step) => {
    Some(start)
    |> Opt.filter(_ => step !== 0)
    |> Opt.filter(_ => {
         let direction = Int.compare(stop, start);
         let step_direction = step |> clamp(-1, 1);
         let includes = (elem, values) =>
           values |> List.exists(v => v === elem);
         // Do the step direction and the start/stop comparison agree?
         [step_direction, 0] |> includes(direction);
       })
    |> Option.map(_ => {
         let count = (stop - start) / step;
         List.init(count + 1, i => start + i * step);
       });
  };
};

let _first = values => {
  switch (values) {
  | [h, ..._] => Some(h)
  | [] => None
  };
};

// ---
// Examples
// ---

let variables = (): unit => {
  let str1 = "The inner machinations of my mind are an enigma.";
  print_endline(str1);
};

let booleans = (): unit => {
  let t = true;
  let f = false;

  let exclusive_or = (b1, b2) => b1 !== b2;
  let nor = (b1, b2) => !(b1 && b2);

  let results = [
    "t: " ++ Bool.to_string(t),
    "f: " ++ Bool.to_string(f),
    "!t: " ++ Bool.to_string(!t),
    "t && t: " ++ ((t && t) |> Bool.to_string),
    "f || t: " ++ ((f || t) |> Bool.to_string),
    "exclusive_or(t, f): " ++ (exclusive_or(t, f) |> Bool.to_string),
    "nor(f, f): " ++ (nor(f, f) |> Bool.to_string),
  ];
  List.iter(print_endline, results);
};

let floats = (): unit => {
  let f1 = 2.0;
  let f2 = (-1.5);
  let f3 = 3.14;

  let results = [
    "f1: " ++ (f1 |> Float.to_string),
    "f2: " ++ (f2 |> Float.to_string),
    "f3: " ++ (f3 |> Float.to_string),
    "Float.abs(f2): " ++ (Float.abs(f2) |> Float.to_string),
    "Float.max(f1, f2): " ++ (Float.max(f1, f2) |> Float.to_string),
    "Float.min(f1, f2): " ++ (Float.min(f1, f2) |> Float.to_string),
    // Arithmetic
    "Float.add(f1, f2): " ++ (Float.add(f1, f2) |> Float.to_string),
    "Float.sub(f1, f2): " ++ (Float.sub(f1, f2) |> Float.to_string),
    "Float.mul(f1, f2): " ++ (Float.mul(f1, f2) |> Float.to_string),
    "Float.div(f1, f2): " ++ (Float.div(f1, f2) |> Float.to_string),
    // Rounding
    "Float.ceil(f3): " ++ (Float.ceil(f3) |> Float.to_string),
    "Float.floor(f3): " ++ (Float.floor(f3) |> Float.to_string),
    "Float.round(f3): " ++ (Float.round(f3) |> Float.to_string),
    "Float.trunc(f3): " ++ (Float.trunc(f3) |> Float.to_string),
    // Exponential
    "Float.pow(f1, f2): " ++ (Float.pow(f1, f2) |> Float.to_string),
    "Float.exp(f1): " ++ (Float.exp(f1) |> Float.to_string),
    "Float.sqrt(f1): " ++ (Float.sqrt(f1) |> Float.to_string),
    "Float.cbrt(f1): " ++ (Float.cbrt(f1) |> Float.to_string),
    "Float.log(f1): " ++ (Float.log(f1) |> Float.to_string),
    "Float.log2(f1): " ++ (Float.log2(f1) |> Float.to_string),
    "Float.log10(f1): " ++ (Float.log10(f1) |> Float.to_string),
  ];
  List.iter(print_endline, results);
};

let ints = (): unit => {
  let int1 = 2;
  let int2 = (-1);
  let int3 = 3;

  let numbers = Numbers.range(1, 5, 1) |> Option.get;

  let results = [
    "int1: " ++ (int1 |> Int.to_string),
    "int2: " ++ (int2 |> Int.to_string),
    "int3: " ++ (int3 |> Int.to_string),
    "numbers: " ++ (numbers |> Fmt.fmt_int_list),
    "Int.abs(int2): " ++ (Int.abs(int2) |> Int.to_string),
    "Int.max(int1, int2): " ++ (Int.max(int1, int2) |> Int.to_string),
    "Int.min(int1, int2): " ++ (Int.min(int1, int2) |> Int.to_string),
    // Compare
    "Int.compare(int1, int2): " ++ (Int.compare(int1, int2) |> Int.to_string),
    "Int.compare(int2, int2): " ++ (Int.compare(int2, int2) |> Int.to_string),
    "Int.compare(int2, int1): " ++ (Int.compare(int2, int1) |> Int.to_string),
    // Arithmetic
    "Int.add(int1, int2): " ++ (Int.add(int1, int2) |> Int.to_string),
    "Int.sub(int1, int2): " ++ (Int.sub(int1, int2) |> Int.to_string),
    "Int.mul(int1, int2): " ++ (Int.mul(int1, int2) |> Int.to_string),
    "Int.div(int1, int2): " ++ (Int.div(int1, int2) |> Int.to_string),
  ];
  List.iter(print_endline, results);
};

let strings = (): unit => {
  let results = [
    {|String.concat(String.empty, ["Bar", "nacles"]): |}
    ++ String.concat(String.empty, ["Bar", "nacles"]),
    {|String.cat("Bar", "nacles"): |} ++ String.cat("Bar", "nacles"),
    {|"Bar" ++ "nacles": |} ++ "Bar" ++ "nacles",
    {|"Not even Squidward's house" |> Str.contains(~substr="id"): |}
    ++ (
      "Not even Squidward's house"
      |> Str.contains(~substr="id")
      |> Bool.to_string
    ),
    {|"It's okay, take your time" |> String.starts_with(~prefix="It"): |}
    ++ (
      "It's okay, take your time"
      |> String.starts_with(~prefix="It")
      |> Bool.to_string
    ),
    {|"Help me boy, or you're fired!" |> String.ends_with(~suffix="fired!"): |}
    ++ (
      "Help me boy, or you're fired!"
      |> String.ends_with(~suffix="fired!")
      |> Bool.to_string
    ),
    {|"   Too bad that didn't kill me   " |> String.trim: |}
    ++ ("   Too bad that didn't kill me   " |> String.trim),
  ];
  List.iter(print_endline, results);
};

let bytes = (): unit => {
  let str = "Barnacles";
  let data = str |> String.to_bytes;

  let results = ["bytes: " ++ (data |> Fmt.fmt_bytes)];
  List.iter(print_endline, results);
};

let maps = () => {
  StringMap.empty
  |> StringMap.add("a", 1)
  |> StringMap.add("b", 2)
  |> StringMap.add("c", 3)
  |> StringMap.iter((str, num): unit => {
       str ++ ": " ++ (num |> Int.to_string) |> print_endline
     });
};

// ---
// Main
// ---

let main = (): unit => {
  let results = [
    ("variables", variables),
    ("booleans", booleans),
    ("floats", floats),
    ("ints", ints),
    ("strings", strings),
    ("bytes", bytes),
    ("maps", maps),
  ];
  results
  |> List.iter(result => {
       let (label, example_fn) = result;
       print_section_title(label);
       example_fn();
     });
};

// TODO
// map, list, record, std, json

main();

// ---
// Notes
// ---

// module Compare = {
//   type t =
//     | Gt
//     | Eq
//     | Lt;

//   let to_int = t =>
//     switch (t) {
//     | Gt => 1
//     | Eq => 0
//     | Lt => (-1)
//     };
//   let from_int = v =>
//     switch (v) {
//     | v when v === 1 => Some(Gt)
//     | v when v === 0 => Some(Eq)
//     | v when v === (-1) => Some(Lt)
//     | _ => None
//     };
// };
