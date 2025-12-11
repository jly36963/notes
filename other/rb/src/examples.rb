# frozen_string_literal: true

def basic_print
  puts('Hello')
end

def basic_string_interpolation
  name = 'Kakashi'
  puts("Hello #{name}")
end

def basic_type_reflection
  # class (type)
  name = 'Kakashi'
  puts("name is #{name} (type: #{name.class})")

  # is_a? (isinstance)
  a = 'No Patrick, horesradish is not an instrument'
  if a.is_a?(String)
    puts('Yup, it is a String.')
  else
    puts("Nope, it is not a string, it is a #{a.class}.")
  end

  some_condition = false

  b = some_condition ? 'a' : 5
  puts("b is #{b}")
  if b.respond_to?(:abs)
    puts("Yup, #{b} (type #{b.class}) has the :abs method")
  else
    puts("Nope, it doesn't have the :abs method")
  end

  c = some_condition ? 'a' : nil
  puts("c is #{c.inspect}")
  if c.nil?
    puts('Yup, it is nil')
  else
    puts("Nope, it isn't nil")
  end
end

def basic_types
  # Nil
  n = nil
  puts("Type of #{n.inspect} is #{n.class}")

  # TrueClass/FalseClass (No boolean class)(wtf)
  t = true
  f = false
  puts("Type of #{t} is #{t.class}")
  puts("Type of #{f} is #{f.class}")

  # Int
  int = 7
  puts("Type of #{int} is #{int.class}")

  # Float
  fl = 7.0
  puts("Type of #{fl} is #{fl.class}")

  # String
  str = 'Is mayonnaise an instrument?'
  puts("Type of #{str} is #{str.class}")

  # Arr
  arr = [1, 2, 3]
  puts("Type of #{arr} is #{arr.class}")

  # Hash
  h = { 'Kakashi' => 'Hatake', 'Iruka' => 'Umino' }
  puts("Type of #{h} is #{h.class}")

  # Range
  r = 0..5
  puts("Type of #{r} is #{r.class}")

  # Regexp
  regex = /equivocal|ambiguous/i # Regex with `i` modifier
  puts("Type of #{regex} is #{regex.class}")

  pr = ->(a, b) { a + b } # pr.call(1, 2)
  puts("Type of #{pr} is #{pr.class}")
end

def basic_operators
  # TODO
end

def basic_if
  some_condition = true
  name = some_condition ? 'Kakashi' : nil
  if name == 'Kakashi'
    puts('Hey Kaka Sensei!')
  elsif name == 'Iruka'
    puts('Hey Iruka Sensei!')
  elsif name.nil?
    puts('Hey!')
  else
    puts('Hey friend!')
  end
end

def basic_case
  a = 'a'
  case a
  when 'a'
    puts('a case')
  when 'b', 'c'
    puts('b or c case')
  else
    puts('unknown case')
  end
end

def basic_while_and_until
  # While (break, break if, next)
  puts('while')
  a = 0
  while a < 5
    a += 1
    puts(a)
  end

  # Until
  puts('until')
  a = 0
  until a >= 5
    a += 1
    puts(a)
  end
end

def basic_strings
  # Indexing
  'abc'[0]     # Character at
  'abc'[0..2]  # Substring

  # Operators
  'abc' * 3       # Repeat
  'abc' + 'def'   # Concatenate
  'abc' == 'abc' # Equality
  'abc' =~ /abc/i # Match regex

  # Length
  'abc'.size # Number of unicode codepoints

  # Methods (checks)
  ''.empty? # Is empty?
  '  '.strip.empty? # Only whitespace?
  'abcde'.end_with?('cde') # Ends with substring?
  'abcde'.include?('abc') # Include substring?
  'abc'.match?(/ab./) # Matches regex?
  'abcde'.start_with?('abc') # Starts with substring?

  # Methods (case)
  'abc'.capitalize # First upper, otherwise lower
  'abc'.upcase # Upper
  'abc'.downcase # Lower

  # Methods (type conversion)
  'abc'.bytes # array of bytes
  'abc'.bytesize # Number of bytes
  'abc'.encode('utf-8') # Encode bytes
  '0.0'.to_f # Parse float
  '1'.to_i # Parse int

  # Methods (change)
  'abc'.center(7) # Pads edges with char (' ') until length n
  'abc_def'.chomp('_def') # Return string with suffix removed
  'blues'.gsub('es', 'rred') # Return string with substring replaced (global)
  'abcde'.gsub({ 'c' => 'C' }) # Return string with characters replaced (global)
  ' abc '.strip # Remove leading/trailing instances of Char/String (' ')
  'cba'.reverse # Reverse order
  'abc def'.split(' ') # Split on Char/String; Array(String)

  # Methods (misc)
  'abcde'.index('cde') # Index of substring start (or nil)
  'abc'.lines # Returns lines: Array(String)
  'abc'.each_line # Returns lines: Iterator(String)
end

def basic_arrays
  # Creation
  arr1 = [1, 2, 3, 4, 5]
  puts("array (#{arr1.class}): #{arr1}")

  # Details
  arr1.size

  # Indexing
  arr1[0, 2]  # start, count
  arr1[0..4]  # slice (range)

  # Operators
  # TODO

  # Push, Pop
  arr1.push(6) # Push element to end
  arr1.push(7, 8) # Push elements to end (variadic)
  arr1.pop # Pop single element from end
  arr1.unshift(0) # Prepend a value
  arr1.shift # Shift first element

  # Methods (access)
  arr1.first # First element
  arr1.first(1) # First n elements
  arr1.last # Last element
  arr1.last(1) # Last n elements
  arr1.index(3) # Index of first occurence of value
  arr1.max # Max value
  arr1.min # Min value

  # Methods (order)
  arr1.reverse # Reverse order
  arr1.rotate # Shift each element left n times
  arr1.shuffle # Shuffle
  arr1.sort # Sort based on value of comparison method (<=>)
  arr1.sort { |a, b| b <=> a } # Sort using custom comparator
  arr1.sample(5) # Random sample (n elements)

  # Iterate
  arr1.map { |n| n * 2 } # Map
  arr1.select { |n| n > 3 } # Filter
  arr1.reduce { |acc, curr| acc + curr } # Reduce
  arr1.all? # All (are truthy)
  arr1.all? { |n| n > 0 } # All (pass predicate)
  arr1.all?(&:positive?) # All (pass predicate)
  arr1.any? { |n| n > 3 } # Any
  arr1.count { |n| n > 3 } # How many pass predicate
  arr1.each { |n| puts n } # Foreach
  arr1.find { |n| n == 3 } # Find
  arr1.partition { |n| n > 3 } # Partition
  arr1.none? { |n| n > 7 } # Do all fail predicate
  arr1.reject { |n| n > 3 } # Opposite of Filter

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
  arr1.take(3) # Limit n elements
  arr1.clear # Remove all elements
end

def basic_hashes
  hash1 = { 'Kakashi' => 'Hatake', 'Iruka' => 'Umino', 'Hiruzen' => 'Sarutobi' }

  # Length
  hash1.size

  # Access
  hash1['Kakashi'] # Access key (nil if not found)
  hash1.fetch('Kakashi', 'Sensei') # Access key (with fallback)
  hash1.key?('Umino') # Get key for value, nil if not found
  hash1.keys # Get keys; Array<K>
  hash1.values # Get values; Array<V>

  # Operators
  hash1 == hash1 # Equality

  # Methods (check)
  hash1.empty? # Is empty?
  hash1.include?('Iruka') # Has key?
  hash1.value?('Sarutobi') # Has value?

  # Methods (iterate)
  hash1.each { |k, v| puts("#{k}: #{v}") } # Foreach (entries)
  hash1.each_key { |k| puts("#{k}: #{hash1[k]}") } # Foreach (keys)
  hash1.each_value { |v| puts(v) } # Foreach (values)
  hash1.select { |k, _| k.size > 3 } # Return copy that keeps passing elements
  hash1.reject { |k, _| k.size > 100 } # Return copy that drops passing elements
  hash1.transform_keys(&:upcase) # Return copy with keys transformed (lodash mapKeys)
  hash1.transform_values(&:upcase) # Return copy with values transformed (lodash mapValues)

  # Methods (type cast)
  hash1.to_a # Array of k,v tuples

  # Methods (misc)
  hash1.clone # Clone hash
  hash1.dup # Clone hash (not sure how it's different than clone)
  hash1.compact # Return hash with nil values removed
  hash1.clear # Clear hash
  hash1.merge({ 'Itachi' => 'Uchiha' }) # Return merged with other (other gets priority if clash)
end

def add_int(num1, num2)
  num1 + num2
end

def inc_int(num1, num2 = 1)
  num1 + num2
end

def greet(first_name: '', last_name: '')
  puts(first_name.class)
  return 'Hello friend!' if first_name.empty?
  return "Hello #{first_name.strip}!" if last_name.empty?

  "Hello #{first_name.strip} #{last_name.strip}!"
end

def sum_int(*numbers)
  numbers.reduce(0) { |acc, curr| acc + curr }
end

def add(num1, num2)
  num1 + num2
end

def basic_methods
  # With params
  add_result = add_int(1, 2)
  puts("add_result: #{add_result}")
  # With default params
  inc_result = inc_int(1)
  puts("inc_result: #{inc_result}")
  # With named params
  greet_result1 = greet(first_name: 'Kakashi', last_name: 'Hatake')
  puts("greet_result1: #{greet_result1}")
  greet_result2 = greet(**{ first_name: 'Kakashi', last_name: 'Hatake' })
  puts("greet_result2: #{greet_result2}")
  # Variadic
  sum_int_result = sum_int(1, 2, 3)
  puts("sum_int_result: #{sum_int_result}")
  # Type restricted
  add_result = add(1.0, 2.0)
  puts("add_result (#{add_result.class}): #{add_result}")
end

# TODO: classes
