import std::io;
import std::collections::list;
import std::collections::map;

// ---
// Main
// ---

// Scenarios
alias ScenarioFunc = fn void();
struct Scenario {
  String title;
  ScenarioFunc func;
}

// Run the example scenarios
fn void main() {
  Scenario[] scenarios = {
    {.title = "bools", .func = &basic_bools},
    {.title = "ints", .func = &basic_ints},
    {.title = "floats", .func = &basic_floats},
    {.title = "strings", .func = &basic_strings},
    {.title = "arrays", .func = &basic_arrays},
    {.title = "dynamic_arrays", .func = &basic_dynamic_arrays},
    {.title = "vectors", .func = &basic_vectors},
    {.title = "lists", .func = &basic_lists},
    {.title = "hashmaps", .func = &basic_hashmaps},
  };

  foreach (scenario : scenarios) {
    print_section_title(scenario.title);
    scenario.func();
  };
}

// ---
// Examples
// ---

fn void basic_bools() {
  @pool() {
    bool t = true;
    bool f = false;

    String[] results = {
      string::format(tmem, "t: %s", t),
      string::format(tmem, "f: %s", f),
      string::format(tmem, "t & t %s", t & t),
      string::format(tmem, "t & f %s", t & f),
      string::format(tmem, "f & f %s", f & f),
      string::format(tmem, "t | t %s", t | t),
      string::format(tmem, "t | f %s", t | f),
      string::format(tmem, "f | f %s", f | f),
    };

    foreach (res : results) {
      io::printn(res);
    }
  };
}

fn void basic_ints() {
  @pool() {
    int n1 = 3;
    int n2 = 2;

    String[] results = {
      string::format(tmem, "n1: %d", n1),
      string::format(tmem, "n2: %d", n2),
      string::format(tmem, "n1 + n2 %d", n1 + n2),
      string::format(tmem, "n1 - n2 %d", n1 - n2),
      string::format(tmem, "n1 * n2 %d", n1 * n2),
      string::format(tmem, "n1 / n2 %d", n1 / n2),
      string::format(tmem, "n1 < n2 %s", n1 < n2),
      string::format(tmem, "n1 <= n2 %s", n1 <= n2),
      string::format(tmem, "n1 > n2 %s", n1 > n2),
      string::format(tmem, "n1 >= n2 %s", n1 >= n2),
    };

    foreach (res : results) {
      io::printn(res);
    }
  };
}

fn void basic_floats() {
  @pool() {
    float n1 = 3;
    float n2 = 2;

    String[] results = {
      string::format(tmem, "n1: %.2f", n1),
      string::format(tmem, "n2: %.2f", n2),
      string::format(tmem, "n1 + n2 %.2f", n1 + n2),
      string::format(tmem, "n1 - n2 %.2f", n1 - n2),
      string::format(tmem, "n1 * n2 %.2f", n1 * n2),
      string::format(tmem, "n1 / n2 %.2f", n1 / n2),
      string::format(tmem, "n1 < n2 %s", n1 < n2),
      string::format(tmem, "n1 <= n2 %s", n1 <= n2),
      string::format(tmem, "n1 > n2 %s", n1 > n2),
      string::format(tmem, "n1 >= n2 %s", n1 >= n2),
    };

    foreach (res : results) {
      io::printn(res);
    }
  };
}

fn void basic_strings() {
  // TODO: split, concat
  // TODO (numeric): to_int, to_float, ...
  // TODO (casing): snake_to_pascal, pascal_to_snake, ...
  @pool() {
    String[] results = {
      string::format(tmem,
        "string::join(tmem, {\"a\", \"b\", \"c\"},  \", \"): %s",
        string::join(tmem, {"a", "b", "c"}, ", ")),
      string::format(tmem,
        "\"I'm not ready!\".replace(tmem, \"not \", \"\"): %s",
        "I'm not ready!".replace(tmem, "not ", "")),
      string::format(tmem,
        "\"   Too bad that didn't kill me   \".trim(): %s",
        "  Too bad that didn't kill me   ".trim()),
      string::format(tmem,
        "\"It's okay, take your time\".starts_with(\"It\"): %s",
        "It's okay, take your time".starts_with("It")),
      string::format(tmem,
        "\"Help me boy or you're fired\".ends_with(\"fired\"): %s",
        "Help me boy or you're fired".ends_with("fired")),
      string::format(tmem,
        "\"Me hoy minoy ✏️\".utf8_codepoints(): %s",
        "Me hoy minoy ✏️".utf8_codepoints()),
      string::format(tmem,
        "\"Not even Squidward's house\".contains(\"id\"): %s",
        "Not even Squidward's house".contains("id")),
      string::format(tmem,
        "\"moar!\".to_upper_copy(tmem): %s",
        "moar!".to_upper_copy(tmem)),
      string::format(tmem,
        "\"I CAN'T SEE MY FOREHEAD\".to_lower_copy(tmem): %s",
        "I CAN'T SEE MY FOREHEAD".to_lower_copy(tmem)),
    };

    foreach (res : results) {
      io::printn(res);
    }
  };
}

fn void basic_arrays() {
  int[5] numbers = {1, 2, 3, 4, 5};
  io::printn("numbers:");
  foreach (n : numbers) {
    io::printfn("%d", n);
  };
}

fn void basic_dynamic_arrays() {
  int[] numbers = {1, 2, 3, 4, 5};
  io::printn("numbers:");
  foreach (n : numbers) {
    io::printfn("%d", n);
  };
}

fn void basic_vectors() {
  @pool() {
    int[<5>] numbers = {1, 2, 3, 4, 5};
    io::print("numbers: vec[ ");
    int numbers_len = numbers.len;
    foreach (i, n : numbers) {
      bool is_last = (int)i + (int)1 < numbers_len;
      String s = (is_last) ? "%d, " : "%d";
      io::printf(s, n);
    };
    io::printn(" ]");

    String[] results = {
      string::format(tmem, "numbers.sum(): %d", numbers.sum()),
      string::format(tmem, "numbers.product(): %d", numbers.product()),
      string::format(tmem, "numbers.max(): %d", numbers.max()),
      string::format(tmem, "numbers.min(): %d", numbers.min()),
    };

    foreach (s : results) {
      io::printfn(s);
    }
  };
}

fn void basic_lists() {
  // List{String} strings;
  // strings.init(mem);
  // defer strings.free();
  // strings.push(string::format(mem, "a"));
  // strings.push(string::format(mem, "b"));
  // strings.push(string::format(mem, "c"));
  @pool() {
    List{String} strings;
    strings.init_with_array(tmem, {"a", "b", "c"});

    foreach (i, s : strings) {
      io::printfn("%d: %s", i, s);
    }
  };
}

fn void basic_hashmaps() {
  // HashMap{String, int} map1;
  // map1.init(mem);
  // defer map1.free();
  // map1.set("a", 1);
  // map1.set("b", 2);
  // map1.set("c", 3);

  @pool() {
    HashMap{String, int} map1;
    map1.init_with_key_values(tmem, "a", 1, "b", 2, "c", 3);

    foreach (entry : map1.iter()) {
      io::printfn("%s -> %d", entry.key, entry.value);
    }
  };
}

// ---
// Utils
// ---

fn void print_section_title(String s) {
  @pool() {
    String s2 = s.to_upper_copy(tmem);
    io::printfn("\n%s\n", s2);
  };
}
