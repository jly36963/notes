def basic_print
  puts("Hello world!")
end

def basic_interpolation
  name = "Kakashi"
  puts("Hello #{name}")
end

def basic_initialization
  s : String # Uninitialized, cannot use value/methods until assignment
  s = "The inner machinations of my mind are an enigma"
  puts("s (#{s.class}): #{s}")
end

def basic_types
  # Nil
  n = nil
  puts("nil (#{n.class}): #{n.inspect}") # nil prints as ""

  # Bool
  bool = true
  puts("bool (#{bool.class}): #{bool}")

  # Int
  i32 = 1
  puts("i32 (#{i32.class}): #{i32}")
  u8 = 1_u8 # Type specified in value
  puts("u8 (#{u8.class}): #{u8}")
  u32 : UInt32 = 1 # Type specified through restriction
  puts("u32 (#{u32.class}): #{u32}")

  # Float
  f64 = 1.0
  puts("f64 (#{f64.class}): #{f64}")
  f32 = 1.0_f32
  puts("f32 (#{f32.class}): #{f32}")

  # Char (32-bit Unicode code point)
  char = 'a'
  puts("char (#{char.class}): #{char}")

  # String
  string = "Is mayonnaise an instrument?"
  puts("string (#{string.class}): #{string}")

  # Symbol (Unique name in entire source code) (compile time, not dynamic)
  symbol = :"symbol"
  puts("symbol (#{symbol.class}): #{symbol}")

  # Array
  arr0 = [] of Int32 # Type must be specified for empty
  puts("array (#{arr0.class}): #{arr0}")
  arr1 = [1, 2, 3] # Type inferred
  puts("array (#{arr1.class}): #{arr1}")
  arr2 = [1, 2, 3] of UInt8 # Type specified
  puts("array (#{arr2.class}): #{arr2}")
  arr3 = Array{1_u16, 2_u16, 3_u16} # Array-like type literal
  puts("array (#{arr3.class}): #{arr3}")

  # Hash (map)
  hash0 = {} of String => String # Type must be specified for empty
  puts("hash (#{hash0.class}): #{hash0}")
  hash1 = {"Kakashi" => "Hatake", "Iruka" => "Umino"} # Type inferred
  puts("hash (#{hash1.class}): #{hash1}")
  hash2 = {"Kakashi" => "Hatake", "Iruka" => "Umino"} of String => String # Type specified
  puts("hash (#{hash2.class}): #{hash2}")
  hash3 = Hash{"Kakashi" => "Hatake", "Iruka" => "Umino"} # Hash literal
  puts("hash (#{hash3.class}): #{hash3}")

  # Range (inherits from iterable)
  range1 = 0..5 # Inclusive range
  puts("range (#{range1.class}): #{range1.to_a}")
  range2 = 0...5 # Exclusive range
  puts("range (#{range2.class}): #{range2.to_a}")
  range3 = Range.new(0, 5) # Range constructor (for exclusive, `true` as third arg)
  puts("range (#{range3.class}): #{range3.to_a}")

  # Regex
  regex = /equivocal|ambiguous/i # Regex with `i` modifier
  puts("regex (#{regex.class}): #{regex}")

  # Tuple
  tuple = {1, 2, 3}
  puts("tuple (#{tuple.class}): #{tuple}")
  named_tuple = {name: "Kakashi Hatake", age: 27_u8}
  puts("named_tuple (#{named_tuple.class}): #{named_tuple}")

  # Proc
  proc = ->(a : Int32, b : Int32) { a + b }
  proc_result = proc.call(1, 2)
  puts("proc (#{proc.class}): #{proc}")
  puts("proc_result (#{proc_result.class}): #{proc_result}")

  # Command
  command = `echo "Hello world!"` # Result of execution
  puts("command (#{command.class}): #{command}")
end

def basic_reflection
  # typeof
  type = typeof("Where's the leak, mam?")
  puts("type (#{type.class}): #{type.inspect}") # nil prints as ""

  # sizeof (size of type in bytes)
  # TODO

  # instance_sizeof
  # TODO

  # is_a, responds_to, and nil do not work with instance/class variables. (
  # Assign them to a variable first

  # is_a?: like python's isinstance()
  a = "No Patrick, horesradish is not an instrument"
  if a.is_a?(String)
    puts("Yup, it is a String.")
  else
    puts("Nope, it is not a string, it is a #{a.class}.")
  end

  # responds_to?: check if var has a method
  some_condition = false
  b = some_condition ? "No Patrick, horesradish is not an instrument" : 5
  if b.responds_to?(:abs)
    puts("Yup, it has the :abs method")
  else
    puts("Nope, it does not hav the :abs method")
  end

  # nil?: is it nil
  some_condition = false
  c = some_condition ? "No Patrick, horesradish is not an instrument" : nil
  if c.nil?
    puts("Yup, it is nil")
  else
    puts("Nope, is not nil")
  end

  # as
  # TODO

  # as?
  d = 5
  d = d.as?(String) # d.is_a?(String) ? d : nil
  puts("d (#{d.class}): #{d.inspect}")
end

alias Int_ = Int8 | Int16 | Int32 | Int64
alias OptionalString = String? # String | ::Nil
alias StringToString = String -> String

def basic_aliases
  # Alias
  a : Int_ = 1
  a = 1_i8
  puts("a (#{a.class}): #{a}")

  # Nilable
  b : OptionalString
  some_condition = false
  b = some_condition ? "Meet my darling daughter, Pearl!" : nil
  puts("b (#{b.class}): #{b.inspect}")

  # Pointer (unsafe)
  c_value = 5
  c_pointer = pointerof(c_value)
  c = c_pointer.value
  puts("c_pointer (#{c_pointer.class}): #{c}")
  puts("c (#{c.class}): #{c}")

  # StaticArray
  # alias Array8Int32 = Int32[8]

  # Proc
  strip2 : StringToString
  strip2 = ->(s : String) { s.strip }
  d = strip2.call("  Finland!  ")
  puts("strip2 (#{strip2.class}): #{strip2}")
  puts("d (#{d.class}): #{strip2}")
end

def basic_operators
  # TODO
end

def basic_if
  # Values are truthy unless nil, false, and null pointers

  # if, elsif, else
  name = "Kakashi"
  if name == "Kakashi"
    puts("Hey Kakashi!")
  elsif name == "Yamato" || name == "Tenzo"
    puts("Hey Yamato!")
  else
    puts("Hello friend!")
  end

  # if suffix
  some_condition = true
  a = 0
  a = 2 if some_condition
  puts(a)

  # if expression
  some_condition = true
  b = if some_condition
        3
      else
        0
      end
  puts(b)

  # Ternary operator
  some_condition = true
  c = some_condition ? 4 : 0
  puts(c)
end

def basic_control_flow
  # Unless (prefer "if" when else is needed)
  some_condition = false
  unless some_condition
    puts("some_condition was false")
  end

  # Case (value)
  a = "a"
  case a
  when "a",
       puts "a case"
  when "b", "c"
    puts "b or c case"
  else
    puts "unknown case"
  end

  # Case (type)
  some_condition = true
  b = some_condition ? "a" : 1
  case b
  when String,
       puts "String case"
  when Int32
    puts "Int32 case"
  else
    puts "unknown case"
  end

  # Exhaustive cases can omit "else"
  # For single line case bodies, use when/then
  # The case value can be omitted. when would use conditions
  # case examples: https://crystal-lang.org/reference/1.5/syntax_and_semantics/case.html

  # While (break, break if, next)
  a = 0
  while a < 5
    a += 1
    puts(a)
  end

  # Until
  a = 0
  until a >= 5
    a += 1
    puts(a)
  end
end

def basic_strings
  # https://crystal-lang.org/api/1.5.0/String.html

  # Indexing
  "abc"[0]     # Character at
  "abc"[0..2]  # Substring
  "abc"[0..2]? # Substring (returns nil if start is out of bounds)

  # Operators
  "abc" * 3       # Repeat
  "abc" + "def"   # Concatenate
  "abc" == "abc"  # Equality
  "abc" =~ /abc/i # Match regex

  # Length
  "abc".size # Number of unicode codepoints

  # Methods (checks)
  "".empty?                   # Is empty?
  "  ".blank?                 # Only whitespace?
  "abcde".ends_with?("cde")   # Ends with substring?
  "abcde".includes?("abc")    # Includes substring?
  "abc".matches?(/ab./)       # Matches regex?
  "abcde".starts_with?("abc") # Starts with substring?

  # Methods (case)
  "abc".capitalize        # First upper, otherwise lower
  "abc".upcase            # Upper
  "abc".downcase          # Lower
  "hello_world".camelcase # As camel-case
  "helloWorld".underscore # As snake-case

  # Methods (type conversion)
  "abc".bytes           # As bytes; Array(UInt8)
  "abc".bytesize        # Number of bytes; Int32
  "abc".encode("utf-8") # Encode; Bytes
  "0.0".to_f            # Parse float; Float64
  "1".to_i              # Parse int; Int32

  # Methods (change)
  "abc".center(7)            # Pads edges with char (' ') until length n
  "abc_def".chomp("_def")    # Return string with suffix removed
  "blues".gsub("es", "rred") # Return string with substring replaced (global)
  "abcde".gsub({'c' => 'C'}) # Return string with characters replaced (global)
  " abc ".strip              # Remove leading/trailing instances of Char/String (' ')
  "cba".reverse              # Reverse order
  "abc def".split(" ")       # Split on Char/String; Array(String)

  # Methods (misc)
  "abcde".index("cde") # Index of substring start (or nil)
  "abc".lines          # Returns lines: Array(String)
  "abc".each_line      # Returns lines: Iterator(String)
end

def basic_arrays
  # https://crystal-lang.org/api/1.5.0/Array.html

  # Creation
  arr1 = [1, 2, 3, 4, 5]
  puts("array (#{arr1.class}): #{arr1}")

  # Details
  arr1.size

  # Indexing
  arr1[0, 2]  # start, count
  arr1[0, 2]? # start, count; returns nil if start is out of range
  arr1[0..4]  # slice (range)
  arr1[0..4]? # slice (range); returns nil if start is out of range

  # Operators
  # TODO

  # Push, Pop
  arr1.push(6)    # Push element to end
  arr1.push(7, 8) # Push elements to end (variadic)
  arr1.pop        # Pop single element from end
  arr1.pop?       # Pop single element from end (returns nil if empty)
  arr1.unshift(0) # Prepend a value
  arr1.shift      # Shift first element
  arr1.shift?     # Shift first element (returns nil if empty)

  # Methods (access)
  arr1.first    # First element
  arr1.first(1) # First n elements
  arr1.last     # Last element
  arr1.last(1)  # Last n elements
  arr1.index(3) # Index of first occurence of value
  arr1.max      # Max value
  arr1.min      # Min value

  # Methods (order)
  arr1.reverse                 # Reverse order
  arr1.rotate                  # Shift each element left n times
  arr1.shuffle                 # Shuffle
  arr1.sort                    # Sort based on value of comparison method (<=>)
  arr1.sort { |a, b| b <=> a } # Sort using custom comparator
  arr1.sample(5)               # Random sample (n elements)

  # Iterate
  arr1.map { |n| n * 2 }                 # Map
  arr1.select { |n| n > 3 }              # Filter
  arr1.reduce { |acc, curr| acc + curr } # Reduce
  arr1.all?                              # All (are truthy)
  arr1.all? { |n| n > 0 }                # All (pass predicate)
  arr1.any? { |n| n > 3 }                # Any
  arr1.count { |n| n > 3 }               # How many pass predicate
  arr1.each { |n| puts n }               # Foreach
  arr1.find { |n| n == 3 }               # Find
  arr1.partition { |n| n > 3 }           # Partition
  arr1.none? { |n| n > 7 }               # Do all fail predicate
  arr1.reject { |n| n > 3 }              # Opposite of Filter

  # Iterate (multiline)
  arr1.each do |n|
    puts n
  end

  # Methods (copy, concat, clear)
  arr1.clone           # Copy (elements and attributes) (shallow)
  arr1.dup             # Copy (elements only, not attributes) (shallow)
  arr1.concat(arr1)    # Concat
  [*arr1, nil].compact # Remove nil elements
  arr1.fill(1)         # Fill with value
  arr1.uniq            # Remove duplicates
  arr1.uniq { |n| n }  # Remove duplicates (custom comparotor)
  arr1.truncate(1..3)  # Only keep elements in range
  arr1.clear           # Remove all elements

  # TODO: delete, to_json, to_s, to_a, to_h, to_set, each_with_index, tap
end

def basic_hashes
  # https://crystal-lang.org/api/1.5.0/Hash.html
  hash1 = {"Kakashi" => "Hatake", "Iruka" => "Umino", "Hiruzen" => "Sarutobi"}

  # Length
  hash1.size

  # Access
  hash1["Kakashi"]                 # Access key
  hash1["Itachi"]?                 # Access key (nil if not found)
  hash1.fetch("Kakashi", "Sensei") # Access key (with fallback)
  hash1.dig("Kakashi")             # Traverse nested structure (like lodash get)
  hash1.dig?("a", "b", "c")        # Traverse, nil if not found
  hash1.key_for?("Umino")          # Get key for value, nil if not found
  hash1.keys                       # Get keys; Array<K>
  hash1.values                     # Get values; Array<V>

  # Operators
  hash1 == hash1 # Equality

  # Methods (check)
  hash1.empty?                 # Is empty?
  hash1.has_key?("Iruka")      # Has key?
  hash1.has_value?("Sarutobi") # Has value?

  # Methods (iterate)
  hash1.each { |k, v| puts("#{k}: #{v}") }         # Foreach (entries)
  hash1.each_key { |k| puts("#{k}: #{hash1[k]}") } # Foreach (keys)
  hash1.each_value { |v| puts(v) }                 # Foreach (values)
  hash1.select { |k, _| k.size > 3 }               # Return copy that keeps passing elements
  hash1.select("Kakashi", "Iruka")                 # Return copy with key args kept (variadic)
  hash1.reject { |k, _| k.size > 100 }             # Return copy that drops passing elements
  hash1.reject("Hiruzen")                          # Return copy with key args dropped (variadic)
  hash1.transform_keys(&.upcase)                   # Return copy with keys transformed (lodash mapKeys)
  hash1.transform_values(&.upcase)                 # Return copy with values transformed (lodash mapValues)

  # Methods (type cast)
  hash1.to_a # Array of k,v tuples

  # Methods (misc)
  hash1.clone                         # Clone hash
  hash1.dup                           # Clone hash (not sure how it's different than clone)
  hash1.compact                       # Return hash with nil values removed
  hash1.clear                         # Clear hash
  hash1.merge({"Itachi" => "Uchiha"}) # Return merged with other (other gets priority if clash)

  # TODO: put
end

def basic_tuples
  # TODO
  # https://crystal-lang.org/api/1.5.0/Tuple.html
end

def basic_procs
  # TODO
  # https://crystal-lang.org/api/1.5.0/Proc.html
end

def add_i32(a : Int32, b : Int32) : Int32
  a + b
end

def inc_i32(a : Int32, b : Int32 = 1)
  a + b
end

def greet(fn : String = "", ln : String = "") : String
  if fn.size == 0
    return "Hello friend!"
  end
  if ln.size == 0
    return "Hello #{fn.strip}!"
  end
  "Hello #{fn.strip} #{ln.strip}!"
end

def sum_i32(*numbers : Int32) : Int32
  numbers.reduce(0) { |acc, curr| acc + curr }
end

def add(a : Number, b : Number) : Number
  a + b
end

def basic_methods
  # With params
  add_result = add_i32(1, 2)
  puts("add_result: #{add_result}")
  # With default params
  inc_result = inc_i32(1)
  puts("inc_result: #{inc_result}")
  # With named params
  greet_result1 = greet(fn: "Kakashi", ln: "Hatake")
  puts("greet_result1: #{greet_result1}")
  greet_result2 = greet(**{fn: "Kakashi", ln: "Hatake"})
  puts("greet_result2: #{greet_result2}")
  # Variadic
  sum_i32_result = sum_i32(1, 2, 3)
  puts("sum_i32_result: #{sum_i32_result}")
  # Type restricted
  add_result = add(1.0, 2.0)
  puts("add_result (#{add_result.class}): #{add_result}")
end

class Ninja
  def initialize(@first_name : String, @last_name : String, @age : UInt8)
  end

  property first_name
  property last_name
  property age
end

def basic_classes
  # initialize: constructor function
  # getter, setter, property: get/set macros

  kakashi = Ninja.new("Kakashi", "Hatake", 27)
  first_name = kakashi.first_name
  puts("first_name: #{first_name}")
end

def basic_structs
  # TODO
  # https://crystal-lang.org/reference/1.5/syntax_and_semantics/structs.html
  # https://crystal-lang.org/api/1.5.0/Struct.html
end

def basic_constants
  # TODO
  # https://crystal-lang.org/reference/1.5/syntax_and_semantics/constants.html
end

def basic_enums
  # TODO
  # https://crystal-lang.org/reference/1.5/syntax_and_semantics/enum.html
  # https://crystal-lang.org/api/1.5.0/Enum.html
end

def basic_blocks
  # TODO
  # https://crystal-lang.org/reference/1.5/syntax_and_semantics/blocks_and_procs.html
  # https://crystal-lang.org/reference/1.5/syntax_and_semantics/capturing_blocks.html
  # https://crystal-lang.org/reference/1.5/syntax_and_semantics/proc_literal.html
  # https://crystal-lang.org/reference/1.5/syntax_and_semantics/block_forwarding.html
  # https://crystal-lang.org/reference/1.5/syntax_and_semantics/closures.html
end

def basic_exceptions
  # TODO
  # https://crystal-lang.org/reference/1.5/syntax_and_semantics/exception_handling.html
end

def basic_concurrency
  # TODO
end

def print_section_title(s : String)
  puts("\n", s.upcase, "\n")
end

def main
  print_section_title("basic print")
  basic_print()

  print_section_title("basic interpolation")
  basic_interpolation()

  print_section_title("basic initialization")
  basic_initialization()

  print_section_title("basic types")
  basic_types()

  print_section_title("basic reflection")
  basic_reflection()

  print_section_title("basic aliases")
  basic_aliases()

  print_section_title("basic if")
  basic_if()

  print_section_title("basic control flow")
  basic_control_flow()

  print_section_title("basic strings")
  basic_strings()

  print_section_title("basic arrays")
  basic_arrays()

  print_section_title("basic hashes")
  basic_hashes()

  print_section_title("basic tuples")
  basic_tuples()

  print_section_title("basic procs")
  basic_procs()

  print_section_title("basic methods")
  basic_methods()

  print_section_title("basic classes")
  basic_classes()

  print_section_title("basic structs")
  basic_structs()

  print_section_title("basic constants")
  basic_constants()

  print_section_title("basic enums")
  basic_enums()

  print_section_title("basic blocks")
  basic_blocks()

  print_section_title("basic exceptions")
  basic_exceptions()

  print_section_title("basic concurrency")
  basic_concurrency()
end

main()
