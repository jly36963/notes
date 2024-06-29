require Integer

defmodule Basics do
  # ---
  # Main
  # ---

  def main do
    print_section_title("bool")
    basic_bool()

    print_section_title("bitwise")
    basic_bitwise()

    print_section_title("integer")
    basic_integer()

    print_section_title("float")
    basic_float()

    print_section_title("string")
    basic_string()

    print_section_title("atom")
    basic_atom()

    print_section_title("date")
    basic_date()

    print_section_title("date time")
    basic_date_time()

    print_section_title("time")
    basic_time()

    print_section_title("tuple")
    basic_tuple()

    print_section_title("record")
    basic_record()

    print_section_title("mapset")
    basic_mapset()

    print_section_title("function")
    basic_function()

    print_section_title("enum")
    basic_enum()

    print_section_title("list")
    basic_list()

    print_section_title("range")
    basic_range()

    print_section_title("stream")
    basic_stream()

    print_section_title("map")
    basic_map()

    print_section_title("struct")
    basic_struct()
  end

  # ---
  # Utils
  # ---

  @spec is_string(any()) :: bool()
  def is_string(v) do
    is_binary(v) and String.valid?(v)
  end

  @spec is_mapset(any()) :: bool()
  def is_mapset(v) do
    case v do
      %MapSet{} -> true
      _ -> false
    end
  end

  def stringify(v) do
    cond do
      is_list(v) ->
        v
        |> Enum.map(fn inner -> stringify(inner) end)
        |> Enum.join(", ")
        |> then(fn s -> "[" <> s <> "]" end)

      is_mapset(v) ->
        v
        |> Enum.map(fn inner -> stringify(inner) end)
        |> Enum.join(", ")
        |> then(fn s -> "MapSet.new([" <> s <> "])" end)

      is_tuple(v) ->
        v
        |> Tuple.to_list()
        |> Enum.map(fn inner -> stringify(inner) end)
        |> Enum.join(", ")
        |> then(fn s -> "{" <> s <> "}" end)

      is_string(v) ->
        ~s|"#{v}"|

      true ->
        inspect(v)
    end
  end

  @spec print_section_title(String.t()) :: none()
  def print_section_title(str) do
    "\n#{str}\n"
    |> String.upcase()
    |> IO.puts()
  end

  # ---
  # Examples
  # ---

  def basic_bool() do
    date1 = Date.utc_today()
    year = date1.year
    bool1 = year > 2020
    bool2 = not bool1
    str1 = "yup"

    # Strict: and or
    # Relaxed: && ||
    # Relaxed can use types other than boolean

    results = [
      "bool1: #{bool1}",
      "bool2: #{bool2}",
      "str1: #{str1}",
      # Bool operators
      "bool1 and true: #{bool1 and true}",
      "bool2 or true: #{bool2 or true}",
      "bool1 && str1: #{bool1 && str1}",
      "bool2 || str1: #{bool2 || str1}",
      "not bool2: #{not bool2}",
      # Comparison
      "7 > 2: #{7 > 2}",
      "7 >= 2: #{7 >= 2}",
      "2 < 7: #{2 < 7}",
      "2 <= 7: #{2 <= 7}",
      "2 !== 7: #{2 !== 7}",
      "2 === 2: #{2 === 2}",
      "1 in [1, 2, 3]: #{1 in [1, 2, 3]}",
      "5 not in [1,2,3]: #{5 not in [1, 2, 3]}",
      # Type guards
      "is_string(str1): #{is_string(str1)}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_bitwise() do
    # ...
  end

  def basic_integer() do
    results = [
      "1 + 1: #{1 + 1}",
      "2 * 2: #{2 * 2}",
      "2 - 1: #{2 - 1}",
      "3 / 2: #{3 / 2}",
      "2 ** 3: #{2 ** 3}",
      "abs(-2): #{abs(-2)}",
      "Integer.digits(11): #{11 |> Integer.digits() |> stringify()}",
      "div(7, 2): #{div(7, 2)}",
      "Integer.floor_div(7, 2): #{Integer.floor_div(7, 2)}",
      "Integer.is_even(2): #{Integer.is_even(2)}",
      "Integer.is_odd(7): #{Integer.is_odd(7)}",
      "max(7, 2): #{max(7, 2)}",
      "Integer.mod(7, 2): #{Integer.mod(7, 2)}",
      "min(7, 2): #{min(7, 2)}",
      "Integer.pow(2, 7): #{Integer.pow(2, 7)}",
      "Integer.to_string(7, 2): #{Integer.to_string(7, 2)}",
      "Integer.to_string(7): #{Integer.to_string(7)}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_float() do
    results = [
      "1.0 + 1.0: #{1.0 + 1.0}",
      "2.0 * 2.0: #{2.0 * 2.0}",
      "2.0 - 1.0: #{2.0 - 1.0}",
      "3.0 / 2.0: #{3.0 / 2.0}",
      "2.0 ** 3.0: #{2.0 ** 3.0}",
      "abs(-2.0): #{abs(-2.0)}",
      "Float.ceil(3.14159, 2): #{Float.ceil(3.14159, 2)}",
      "Float.floor(3.14159, 2): #{Float.floor(3.14159, 2)}",
      "Float.round(3.14159, 2): #{Float.round(3.14159, 2)}",
      "max(7.0, 2.0): #{max(7.0, 2.0)}",
      "min(7.0, 2.0): #{min(7.0, 2.0)}",
      "Float.pow(2.0, 7): #{Float.pow(2.0, 7)}",
      "Float.ratio(2.5): #{2.5 |> Float.ratio() |> stringify()}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_string() do
    str1 = "Finland!"
    str2 = "Where's the leak, ma'am?"
    str3 = "Barnacles!"
    str4 = "No one can know, not even Squidward's house"

    # Codepoint: singe unicode code point encoded in utf-8. (One or more bytes)
    # Grapheme: multiple codepoints that may be perceived as a single character.
    # Grapheme would differ from codepoint for 👩‍🚒, but `String.length` is still 1
    # String "\u0065\u0301" would also differ for codepoints/graphemes
    str5 = "Você tá bem?"

    results = [
      "str1: #{str1}",
      "str2: #{str2}",
      "str3: #{str3}",
      "str4: #{str4}",
      "str5: #{str5}",
      # Bytes vs code points vs graphemes
      "byte_size(str5): #{byte_size(str5)}",
      "String.length(str5): #{String.length(str5)}",
      "String.codepoints(str5): #{str5 |> String.codepoints() |> stringify()}",
      "String.graphemes(str5): #{str5 |> String.graphemes() |> stringify()}",
      # Functions
      "String.at(str1, 0): #{String.at(str1, 0)}",
      ~s|String.capitalize("abc"): #{String.capitalize("abc")}|,
      "String.codepoints(str5): #{str5 |> String.codepoints() |> stringify()}",
      ~s|String.contains?(str1, "land"): #{String.contains?(str1, "land")}|,
      "String.downcase(str3): #{String.downcase(str3)}",
      "String.duplicate(str1, 2): #{String.duplicate(str1, 2)}",
      ~s|String.ends_with?(str1, "land"): #{String.ends_with?(str1, "land")}|,
      "String.first(str2): #{String.first(str2)}",
      "String.graphemes(str5): #{str5 |> String.graphemes() |> stringify()}",
      "String.last(str2): #{String.last(str2)}",
      "String.match?(str1, ~r/!$/): #{String.match?(str1, ~r/!$/)}",
      ~s|String.pad_leading("1", 4, "0"): #{String.pad_leading("1", 4, "0")}|,
      ~s|String.pad_trailing("1", 4, "0"): #{String.pad_trailing("1", 4, "0")}|,
      ~s|String.replace(str1, "!", ""): #{String.replace(str1, "!", "")}|,
      "String.reverse(str3): #{String.reverse(str3)}",
      "String.slice(str4, 0, 2): #{String.slice(str4, 0, 2)}",
      "String.split(str4): #{str4 |> String.split() |> stringify()}",
      ~s|String.starts_with?(str3, "Bar"): #{String.starts_with?(str3, "Bar")}|,
      ~s|String.trim("   abc   "): #{String.trim("   abc   ")}|,
      "String.upcase(str3): #{String.upcase(str3)}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)

    # TODO: to_* (atom, charlist, existing_atom, float, integer)
  end

  def basic_atom() do
    result1 = {:ok, "Success"}
    result2 = {:error, "Failure"}
    result_list = [result1, result2]

    result_fn = fn r ->
      case r do
        {:ok, m} -> "Message: #{m}"
        {:error, e} -> "Error: #{e}"
      end
    end

    mapped_result_list = Enum.map(result_list, result_fn)

    results = [
      "result_list: #{result_list |> stringify}",
      "mapped_result_list: #{mapped_result_list |> stringify}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_date() do
    today = Date.utc_today()
    tomorrow = Date.add(today, 1)
    in_a_week = Date.add(today, 7)

    results = [
      # Construction
      "~D[2020-01-01]: #{~D[2020-01-01]}",
      "Date.new!(2020, 1, 1): #{Date.new!(2020, 1, 1)}",
      "Date.utc_today(): #{Date.utc_today()}",
      # Functions and properties
      "today: #{today}",
      "tomorrow: #{tomorrow}",
      "in_a_week: #{in_a_week}",
      "today.year: #{today.year}",
      "today.month: #{today.month}",
      "today.day: #{today.day}",
      "Date.after?(tomorrow, today): #{Date.after?(tomorrow, today)}",
      "Date.before?(today, tomorrow): #{Date.before?(today, tomorrow)}",
      "Date.beginning_of_month(today): #{Date.beginning_of_month(today)}",
      "Date.beginning_of_week(today): #{Date.beginning_of_week(today)}",
      "Date.compare(tomorrow, today): #{Date.compare(tomorrow, today)}",
      "Date.day_of_week(today): #{Date.day_of_week(today)}",
      "Date.day_of_year(today): #{Date.day_of_year(today)}",
      "Date.days_in_month(today): #{Date.days_in_month(today)}",
      "Date.diff(tomorrow, today): #{Date.diff(tomorrow, today)}",
      "Date.end_of_month(today): #{Date.end_of_month(today)}",
      "Date.end_of_week(today): #{Date.end_of_week(today)}",
      "Date.months_in_year(today): #{Date.months_in_year(today)}",
      "Date.quarter_of_year(today): #{Date.quarter_of_year(today)}",
      "Date.range(today, in_a_week): #{today |> Date.range(in_a_week) |> Enum.to_list() |> stringify()}",
      "Date.shift(today, Duration.new!(week: 1)): #{Date.shift(today, Duration.new!(week: 1))}",
      "Date.to_iso8601(today): #{Date.to_iso8601(today)}",
      "Date.to_string(today): #{Date.to_string(today)}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_date_time() do
    now = DateTime.utc_now()
    tomorrow = DateTime.add(now, 1, :day)

    results = [
      "now: #{now}",
      "tomorrow: #{tomorrow}",
      "DateTime.compare(tomorrow, today): #{DateTime.compare(tomorrow, now)}",
      "DateTime.diff(tomorrow, now): #{DateTime.diff(tomorrow, now)}",
      "DateTime.to_date(now): #{DateTime.to_date(now)}",
      "DateTime.to_time(now): #{DateTime.to_time(now)}",
      "DateTime.to_iso8601(now): #{DateTime.to_iso8601(now)}",
      "DateTime.to_string(now): #{DateTime.to_string(now)}",
      "DateTime.to_unix(now): #{DateTime.to_unix(now)}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_time() do
    now = Time.utc_now()
    soon = Time.add(now, 1, :hour)

    results = [
      "now: #{now}",
      "soon: #{soon}",
      "Time.compare(soon, today): #{Time.compare(soon, now)}",
      "Time.diff(soon, now): #{Time.diff(soon, now)}",
      "Time.to_seconds_after_midnight(now): #{Time.to_seconds_after_midnight(now) |> elem(0)}",
      "Time.to_iso8601(now): #{Time.to_iso8601(now)}",
      "Time.to_string(now): #{Time.to_string(now)}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_tuple() do
    kakashi = {"Kakashi", "Hatake", 27}

    results = [
      "kakashi: #{kakashi |> Tuple.to_list() |> stringify()}",
      "elem(kakashi, 0): #{elem(kakashi, 0)}",
      "elem(kakashi, 1): #{elem(kakashi, 1)}",
      "elem(kakashi, 2): #{elem(kakashi, 2)}",
      "tuple_size(kakashi): #{tuple_size(kakashi)}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_record() do
    IO.puts("...")
  end

  def basic_mapset() do
    set1 = MapSet.new(["a", "b", "c"])
    set2 = MapSet.new(["c", "d", "e"])
    is_not_c = fn m -> m !== "c" end
    is_c = fn m -> m === "c" end

    results = [
      "set1: #{set1 |> stringify}",
      "set2: #{set2 |> stringify}",
      ~s("a" in set1: #{"a" in set1}"),
      # Functions
      ~s|MapSet.delete(set1, "c"): #{MapSet.delete(set1, "c") |> stringify}|,
      "MapSet.difference(set1, set2): #{MapSet.difference(set1, set2) |> stringify}",
      "MapSet.disjoint?(set1, set2): #{MapSet.disjoint?(set1, set2)}",
      "MapSet.equal?(set1, set2): #{MapSet.equal?(set1, set2)}",
      ~s|MapSet.filter(set1, is_not_c): #{MapSet.filter(set1, is_not_c) |> stringify}|,
      "MapSet.intersection(set1, set2): #{MapSet.intersection(set1, set2) |> stringify}",
      ~s|MapSet.member?(set1, "c"): #{MapSet.member?(set1, set2)}|,
      ~s|MapSet.put(set1, "c"): #{MapSet.put(set1, "c") |> stringify}|,
      ~s|MapSet.reject(set1, is_c): #{MapSet.reject(set1, is_c) |> stringify}|,
      "MapSet.size(set1): #{MapSet.size(set1)}",
      "MapSet.subset?(set1, set2): #{MapSet.subset?(set1, set2)}",
      "MapSet.symmetric_difference(set1, set2): #{MapSet.symmetric_difference(set1, set2) |> stringify}",
      "MapSet.union(set1, set2): #{MapSet.union(set1, set2) |> stringify}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_function() do
    # External functions: functions that point to definitions residing in other modules
    # Local functions: functions bound to a file/module

    # Capture operator: &
    # Convert function to anonymous
    add2 = &Kernel.+/2
    mul2 = &Kernel.*/2

    list1 = [1, 2, 3, 4, 5]

    results = [
      "add2: &Kernel.+/2",
      "mul2: &Kernel.*/2",
      "is_function(add2): #{is_function(add2)}",
      "is_function(add2, 2): #{is_function(add2, 2)}",
      "add2.(2, 7): #{add2.(2, 7)}",
      "mul2.(2, 7): #{mul2.(2, 7)}",
      "List.foldl(list1, 0, add2): #{List.foldl(list1, 0, add2)}",
      "List.foldl(list1, 1, mul2): #{List.foldl(list1, 1, mul2)}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_enum() do
    list1 = [1, 2, 3, 4, 5]

    add_2 = fn n -> n + 2 end
    mul_2 = fn n -> n * 2 end
    is_positive? = fn n -> n > 0 end
    list_2 = fn n -> [n, n] end
    adder = &Kernel.+/2

    results = [
      "list1: #{list1 |> stringify}",
      "Enum.all?(list1, is_positive?): #{Enum.all?(list1, is_positive?)}",
      "Enum.any?(list1, &Integer.is_even/1): #{Enum.any?(list1, &Integer.is_even/1)}",
      "Enum.chunk_every(list1, 2): #{Enum.chunk_every(list1, 2) |> stringify}",
      "Enum.count(list1): #{Enum.count(list1)}",
      "Enum.empty?(list1): #{Enum.empty?(list1)}",
      "Enum.fetch!(list1, 0): #{Enum.fetch!(list1, 0)}",
      "Enum.filter(list1, &Integer.is_even/1): #{Enum.filter(list1, &Integer.is_even/1) |> stringify}",
      "Enum.find(list1, &Integer.is_even/1): #{Enum.find(list1, &Integer.is_even/1)}",
      "Enum.flat_map(list1, list_2): #{Enum.flat_map(list1, list_2) |> stringify}",
      "Enum.frequencies([1, 1, 2]): #{Enum.frequencies([1, 1, 2]) |> stringify}",
      "Enum.map(list1, add_2): #{Enum.map(list1, add_2) |> stringify}",
      "Enum.map(list1, mul_2): #{Enum.map(list1, mul_2) |> stringify}",
      "Enum.product(list1): #{Enum.product(list1)}",
      "Enum.random(list1): #{Enum.random(list1)}",
      "Enum.reduce(list1, adder): #{Enum.reduce(list1, adder)}",
      "Enum.reject(list1, &Integer.is_even/1): #{Enum.reject(list1, &Integer.is_even/1) |> stringify}",
      "Enum.reverse(list1): #{Enum.reverse(list1) |> stringify}",
      "Enum.shuffle(list1): #{Enum.shuffle(list1) |> stringify}",
      "Enum.sort(list1): #{Enum.sort(list1) |> stringify}",
      "Enum.sum(list1): #{Enum.sum(list1)}",
      "Enum.take(list1, 3): #{Enum.take(list1, 3) |> stringify}",
      "Enum.take_random(list1, 3): #{Enum.take_random(list1, 3) |> stringify}",
      "Enum.zip([list1, list1]) |> Enum.unzip(): #{Enum.zip([list1, list1]) |> Enum.unzip() |> stringify}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_list() do
    # Elixir list is a linked list
    # Cons list like [1 | [2 | [3 | []]]] is [1, 2, 3]
    # Head/tail: [head | tail] = [1, 2, 3] # 1, [2, 3]
    # Prepend iss constant time: [0 | list1]
    # (So is `first`)
    # Append is linear time: list1 ++ [4]
    # (So is `last`)

    list1 = [1, 2, 3, 4, 5]

    results = [
      "list1: #{list1 |> stringify}",
      "list1 ++ [6, 7]: #{(list1 ++ [6, 7]) |> stringify}",
      "hd(list1): #{hd(list1)}",
      "tl(list1): #{tl(list1)}",
      # Functions
      "List.delete(list1, 5): #{List.delete(list1, 5) |> stringify}",
      "List.delete_at(list1, 4): #{List.delete_at(list1, 4) |> stringify}",
      "List.first(list1): #{List.first(list1)}",
      "List.foldl(list1, 1, mul): #{List.foldl(list1, 1, &Kernel.*/2)}",
      "List.foldr(list1, 1, mul): #{List.foldr(list1, 1, &Kernel.*/2)}",
      "List.improper?(list1): #{List.improper?(list1)}",
      "List.insert_at(list1, 0, 0): #{List.insert_at(list1, 0, 0) |> stringify}",
      "List.last(list1): #{List.last(list1)}",
      "List.zip([list1, list1]): #{List.zip([list1, list1]) |> stringify}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_comprehension() do
    list1 = [1, 2, 3, 4, 5]

    results = [
      "list1: #{list1 |> stringify}",
      "for n <- list1, do: (n ** 2): #{for(n <- list1, do: n ** 2) |> stringify}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
    # https://www.mitchellhanberg.com/the-comprehensive-guide-to-elixirs-for-comprehension/
  end

  def basic_range() do
    range1 = 1..5

    results = [
      "range1: #{range1 |> stringify}",
      "2 in range1: #{2 in range1}",
      "Enum.to_list(range1): #{Enum.to_list(range1) |> stringify}",
      "Enum.count(range1): #{Enum.count(range1) |> stringify}",
      "Enum.reduce(range1, 0, &Kernel.+/2): #{Enum.reduce(range1, 0, &Kernel.+/2) |> stringify}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_stream() do
    IO.puts("...")
    range1 = 1..5
    mul_2 = fn n -> n * 2 end

    results = [
      "range1: #{range1 |> stringify}",
      "Stream.map(range1, mul_2): #{Stream.map(range1, mul_2) |> Enum.to_list() |> stringify}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_map() do
    map1 = %{"a" => 1, "b" => 2, "c" => 3}
    map2 = %{"c" => 3, "d" => 4, "e" => 5}

    results = [
      "map1: #{map1 |> stringify}",
      # Access
      ~s|map1["a"]: #{map1["a"]}|,
      ~s|Map.fetch!(map1, "a"): #{Map.fetch!(map1, "a")}|,
      ~s|Map.get(map1, "a"): #{Map.get(map1, "a")}|,
      # Functions
      ~s|Map.delete(map1, "a"): #{Map.delete(map1, "a") |> stringify}|,
      ~s|Map.drop(map1, ["c", "d"]): #{Map.drop(map1, ["c", "d"]) |> stringify}|,
      ~s|Map.filter(map1, *is even*): #{Map.filter(map1, fn {_k, v} -> Integer.is_even(v) end) |> stringify}|,
      ~s|Map.from_keys(["a", "b", "c"], true): #{Map.from_keys(["a", "b", "c"], true) |> stringify}|,
      ~s|Map.has_key?(map1, "a"): #{Map.has_key?(map1, "a")}|,
      ~s|Map.intersect(map1, map2): #{Map.intersect(map1, map2) |> stringify}|,
      ~s|Map.keys(map1): #{Map.keys(map1) |> stringify}|,
      ~s|Map.merge(map1, map2): #{Map.merge(map1, map2) |> stringify}|,
      ~s|Map.new(map1, *times 2*): #{Map.new(map1, fn {k, v} -> {k, v * 2} end) |> stringify}|,
      ~s|Map.pop!(map1, "c"): #{Map.pop!(map1, "c") |> stringify}|,
      ~s|Map.put(map1, "d", 4): #{Map.put(map1, "d", 4) |> stringify}|,
      ~s|Map.reject(map1, *is even*): #{Map.reject(map1, fn {_k, v} -> Integer.is_even(v) end) |> stringify}|,
      ~s|Map.replace!(map1, "a", 0): #{Map.replace!(map1, "a", 0) |> stringify}|,
      ~s|Map.take(map1, ["a", "b"]): #{Map.take(map1, ["a", "b"]) |> stringify}|,
      ~s|Map.to_list(map1): #{Map.to_list(map1) |> stringify}|,
      ~s|Map.values(map1): #{Map.values(map1) |> stringify}|
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_struct() do
    IO.puts("...")
    # https://hexdocs.pm/elixir/structs.html
  end
end

# ---
# Run
# ---

Basics.main()
