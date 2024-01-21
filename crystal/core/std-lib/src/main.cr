require "compress/gzip"
require "compress/zlib"
require "crypto/bcrypt"
require "digest/md5"
require "digest/sha256"
require "file"
require "file_utils"
require "json"
require "process"
require "random"
require "uuid"

def basic_base64
  s = "Is mayonnaise an instrument?"
  puts("string: #{s}")

  bytes = s.bytes
  puts("bytes: #{bytes}")

  # Encode / decode
  puts("Encode/decode")
  encoded = Base64.encode(s)
  puts("encoded: #{encoded}")
  decoded = Base64.decode(encoded)
  puts("decoded: #{decoded}")
  s2 = String.new(decoded)
  puts("decoded string: #{s2}")

  # IO
  puts("Encode/decode (io)")
  sb = String::Builder.new
  Base64.encode(s, sb)
  encoded = sb.to_s
  puts("encoded: #{encoded}")
  sb = String::Builder.new
  Base64.decode(encoded, sb)
  s2 = sb.to_s
  puts("decoded string: #{s2}")
end

def basic_compress
  s = "The inner machinations of my mind are an enigma."
  puts("string: #{s}")

  # Readers aren't implemented?

  # Gzip
  sb = String::Builder.new
  w = Compress::Gzip::Writer.new(sb)
  w.write(s.to_slice)
  w.close
  compressed = sb.to_s
  puts("compressed bytes: #{compressed.bytes}")
  puts("compressed string (base64): #{Base64.encode(compressed)}")
  # sb = String::Builder.new(compressed)
  # s2 = Compress::Gzip::Reader.open(sb) do |r|
  #   r.gets_to_end
  # end
  # puts("decompressed bytes: #{s2.bytes}")
  # puts("decompressed string: #{s2}")

  # Zlib
  sb = String::Builder.new
  w = Compress::Zlib::Writer.new(sb)
  w.write(s.to_slice)
  w.close
  compressed = sb.to_s
  puts("compressed bytes: #{compressed.bytes}")
  puts("compressed string (base64): #{Base64.encode(compressed)}")
  # sb = String::Builder.new(compressed)
  # s2 = Compress::Zlib::Reader.open(sb) do |r|
  #   r.gets_to_end
  # end
  # puts("decompressed bytes: #{s2.bytes}")
  # puts("decompressed string: #{s2}")
end

def basic_crypto
  # Bcrypt
  s = "No one can know, not even Squidward's house."
  hashed = Crypto::Bcrypt.hash_secret(s)
  puts("bcrypt hash_secret: #{hashed}")
  salt = "Low salt ketchup" # size should be 16
  bcrypt = Crypto::Bcrypt.new(s.to_slice, salt.to_slice)
  puts("bcrypt.password: #{String.new(bcrypt.password)}")
  puts("bcrypt.salt: #{String.new(bcrypt.salt)}")
  puts("bcrypt.digest: #{Base64.encode(String.new(bcrypt.digest))}")
  puts("bcrypt.to_s: #{bcrypt}")

  # Bcrypt Password
  s = "It should be set to W for wambo"
  puts("string: #{s}")
  password = Crypto::Bcrypt::Password.create(s) # Create new from unhashed
  v = password.verify(s)
  puts("password verify (wambo): #{v}")
  v = password.verify("You got it set to M for mini")
  puts("password verify (mini): #{v}")
  password = Crypto::Bcrypt::Password.new(password.to_s) # Create from hashed
  v = password.verify(s)
  puts("password verify (hashed to original): #{v}")
end

def basic_digest
  # MD5 (hash) (not secure)
  s = "He's just standing there, menacingly"
  puts("string: #{s}")
  md5 = Digest::MD5.new
  hashed = md5.update(s.to_slice).final
  puts("hashed (md5): #{Base64.encode(String.new(hashed))}")

  # SHA-256
  s = "The pioneers used to ride these babies for miles"
  puts("string: #{s}")
  md5 = Digest::SHA256.new
  hashed = md5.update(s.to_slice).final
  puts("hashed (sha-256): #{Base64.encode(String.new(hashed))}")

  # rsa is an external shard
end

def basic_dir
  dir = "temp"
  fn = "my-file.txt"
  fp = Path.posix.join(".", dir, fn)
  Dir.mkdir_p(dir)
  File.touch(fp.to_s)

  # Class methods
  puts("dir: #{dir}")
  puts("current: #{Dir.current}")
  puts("exists?(dir): #{Dir.exists?(dir)}")
  puts("empty(dir): #{Dir.empty?(dir)}")
  puts("entries(dir): #{Dir.entries(dir)}")

  # Instance methods
  # NOTE: "children" and "entries" can only be read once
  d = Dir.new(dir)
  puts("d: #{d}")
  puts("d.children: #{d.children}")
  puts("d.entries: #{d.entries}") # Includes "." and ".."
  puts("d.path: #{d.path}")

  # Cleanup
  if File.exists?(fp) && File.file?(fp)
    File.delete(fp)
  end
  if Dir.exists?(dir) && File.directory?(dir) && Dir.empty?(dir)
    Dir.delete(dir)
  end
end

def basic_file
  # Setup
  dir = "temp"
  fn = "my-file.txt"
  fp = Path.posix.join(".", dir, fn)
  puts("fp: #{fp}")
  Dir.mkdir_p(dir)

  # File read/write
  File.open(fp.to_s, "w") do |file|
    contents = "It'll quench ya. Nothing is quenchier. It's the quenchiest!"
    file.write(contents.to_slice)
  end
  contents = File.open(fp.to_s, "r") do |file|
    file.gets_to_end
  end
  puts("contents: #{contents}")

  # File read/write (short)
  File.write(fp.to_s, "The owner of the white sedan, you left your lights on.")
  contents = File.read(fp.to_s)
  puts("contents: #{contents}")

  # File class methods
  # TODO

  # Cleanup
  if File.exists?(fp) && File.file?(fp)
    File.delete(fp)
  end
  if Dir.exists?(dir) && File.directory?(dir) && Dir.empty?(dir)
    Dir.delete(dir)
  end
end

def basic_file_utils
  # Setup
  dir = "temp"
  filenames = (1..3).map { |n| "file#{n}.txt" }
  fp, fp2, fp3 = filenames.map { |name| Path.posix.join(".", dir, name) }
  puts("dir: #{dir}")
  puts("filenames: #{filenames}")

  # FileUtils methods (mutate)
  FileUtils.mkdir_p(dir)
  FileUtils.touch(fp)
  FileUtils.cp(fp, fp2)
  FileUtils.cp_r(fp, fp2) # Recursive
  FileUtils.mv(fp2, fp3)

  # FileUtils methods (read)
  puts("pwd: #{FileUtils.pwd}")

  # Cleanup
  [fp, fp2, fp3].each do |path|
    if File.exists?(path) && File.file?(path)
      FileUtils.rm(path)
    end
  end
  if Dir.exists?(dir) && File.directory?(dir) && Dir.empty?(dir)
    FileUtils.rmdir(dir)
  end
end

def basic_http
  # TODO
  # https://crystal-lang.org/api/1.5.0/HTTP.html
end

def basic_io
  # TODO
  # https://crystal-lang.org/api/1.5.0/IO.html
end

class Ninja
  include JSON::Serializable

  @[JSON::Field(key: "firstName")]
  property first_name : String
  @[JSON::Field(key: "lastName")]
  property last_name : String
  @[JSON::Field(key: "age")]
  property age : UInt8

  def initialize(@first_name, @last_name, @age)
  end

  def to_s
    self.to_json
  end
end

def basic_json
  # Array
  arr = [1, 2, 3]
  arr_json = arr.to_json # %(#{arr})
  arr_from_json = Array(Int32).from_json(arr_json)
  puts("arr (#{arr.class}): #{arr}")
  puts("arr_json (#{arr_json.class}): #{arr_json}")
  puts("arr_from_json (#{arr_from_json.class}): #{arr_from_json}")

  # Hash
  hash = {"Kakashi" => "Hatake", "Iruka" => "Umino", "Hiruzen" => "Sarutobi"}
  hash_json = hash.to_json
  hash_from_json = Hash(String, String).from_json(hash_json)
  puts("hash (#{hash.class}): #{hash}")
  puts("hash_json (#{hash_json.class}): #{hash_json}")
  puts("hash_from_json (#{hash_from_json.class}): #{hash_from_json}")

  # Object (requires JSON::Serializable)
  ninja = Ninja.new("Kakashi", "Hatake", 27)
  puts("ninja (constructor) (#{ninja.class}): #{ninja.to_s}")
  ninja = Ninja.from_json(%({"firstName": "Kakashi", "lastName": "Hatake", "age": 27}))
  puts("ninja (from_json) (#{ninja.class}): #{ninja.to_s}")
  ninja_json = ninja.to_json
  puts("ninja_json (#{ninja_json.class}): #{ninja_json}")
  ninja_from_json = Ninja.from_json(ninja_json)
  puts("ninja_from_json (#{ninja_from_json.class}): #{ninja_from_json.to_s}")
  # JSON::Serializable -- https://crystal-lang.org/api/1.5.0/JSON/Serializable.html
  # JSON::Builder -- https://crystal-lang.org/api/1.5.0/JSON/Builder.html
  # JSON::Builder Usage -- https://stackoverflow.com/a/46889741

  # TODO: JSON.parse
end

def basic_path
  # Path.posix is specific, Path.new is platform dependent

  # Setup
  dir = "temp"
  fn = "my-file.txt"
  fp = Path.posix.join(".", dir, fn)
  Dir.mkdir_p(dir)
  File.touch(fp.to_s)

  # Path constructors
  puts("home: #{Path.home}")

  # Path class methods
  puts("fp: #{fp}")
  puts("absolute?: #{fp.absolute?}")
  puts("anchor: #{fp.anchor.inspect}")
  puts("basename: #{fp.basename}")
  puts("dirname: #{fp.dirname}")
  puts("drive: #{fp.drive.inspect}")
  puts("each_part.to_a: #{fp.each_part.to_a}")
  puts("extension: #{fp.extension}")
  puts("parent: #{fp.parent}")
  puts("parts: #{fp.parts}")
  puts("posix?: #{fp.posix?}")
  puts("root: #{fp.root.inspect}")
  puts("stem: #{fp.stem}")

  # Cleanup
  if File.exists?(fp) && File.file?(fp)
    File.delete(fp)
  end
  if Dir.exists?(dir) && File.directory?(dir) && Dir.empty?(dir)
    Dir.delete(dir)
  end
end

def basic_process
  puts("executable_path: #{Process.executable_path}")

  pid = Process.pid
  puts("pid: #{pid}")
  puts("exists: #{Process.exists?(pid)}")

  cmd_with_args = "ls -a"
  puts("parse_arguments(cmd_with_args) #{Process.parse_arguments(cmd_with_args)}")

  sb = String::Builder.new
  Process.run("ls", args: ["-p"], shell: true, output: sb)
  output = sb.to_s
  puts("run(\"ls -a\"):", output)

  # Process.exec("ls") # Replace current process
  # Process.exit(0) # Exit process with status
end

def basic_random
  puts("rand: #{Random.rand}")                       # float 0 <= x < 1
  puts("rand(5): #{Random.rand(5)}")                 # int; 0 <= x < n
  puts("rand(5.0): #{Random.rand(5.0)}")             # float; 0 <= x < n
  puts("rand(-3..3): #{Random.rand(-3..3)}")         # int; m <= x < n
  puts("rand(-3.0..3.0): #{Random.rand(-3.0..3.0)}") # float; m <= x < n
end

# has_match has similar behavior to "Regex#matches?"
def has_match?(s : String, r : Regex)
  !!(s =~ r)
end

def basic_regex
  s = "In order to survive, we cling to all we know and understand. " +
      "And label it reality. " +
      "But knowledge and understanding are ambiguous. " +
      "That reality could be an illusion. " +
      "All humans live with the wrong assumptions."

  contains = has_match?(s, /ambiguous/)
  begins_with = has_match?(s, /^In/)
  ends_with = has_match?(s, /assumptions.$/)
  one_or_more = has_match?(s, /Al+/)
  zero_or_one = has_match?(s, /labels?/)
  zero_or_more = has_match?(s, /il*usion/)
  one_of = has_match?(s, /B[aeiou]t/)
  match_or = has_match?(s, /equivocal|ambiguous/)
  not = has_match?(s, /[^sharingan]/)
  any_char = has_match?(s, /under.tanding/)
  zero_to_three = has_match?(s, /Al{0,3}/)
  insensitive = has_match?(s, /(?i)REALITY/)
  seven_lower = has_match?(s, /[a-z]{7}/)
  four_alnum = has_match?(s, /[[:alnum:]]{4} reality/)

  puts("s: #{s}")
  puts("contains 'ambiguous': #{contains}")
  puts("begins_with 'In': #{begins_with}")
  puts("ends_with 'assumptions.': #{ends_with}")
  puts("one_or_more 'Al+.': #{one_or_more}")
  puts("zero_or_one 'labels?': #{zero_or_one}")
  puts("zero_or_more 'il*usion': #{zero_or_more}")
  puts("one_of 'B[aeiou]t': #{one_of}")
  puts("match_or 'equivocal|ambiguous': #{match_or}")
  puts("not '[^sharingan]': #{not}")
  puts("any_char 'under.tanding': #{any_char}")
  puts("zero_to_three 'Al{0,3}': #{zero_to_three}")
  puts("insensitive '(?i)REALITY': #{insensitive}")
  puts("seven_lower '[a-z]{7}': #{seven_lower}")
  puts("four_alnum '[[:alnum:]]{4} reality': #{four_alnum}")

  # TODO: match, matches, source
end

def basic_time
  # Time instance methods
  # Some methodss have variants for year, month, day, hour, minute, second, etc
  t = Time.utc
  puts("to_s: #{t}")
  puts("to_s(...): #{t.to_s("%Y-%m-%d %H:%M:%S %:z")}")
  puts("year: #{t.year}")
  puts("at_beginning_of_day: #{t.at_beginning_of_day}")
  puts("at_end_of_day: #{t.at_end_of_day}")
  puts("day_of_week: #{t.day_of_week}")
  puts("time_of_day: #{t.time_of_day}")
  puts("friday?: #{t.friday?}")
  puts("date: #{t.date.map(&.to_s.rjust(2, '0')).join("-")}")

  # Diff
  t1 = Time.monotonic
  sleep(0.1)
  t2 = Time.monotonic
  span = t2 - t1
  puts("span: #{span.total_seconds.round(3)}s")

  # Measure
  elapsed_time = Time.measure do
    sleep(0.1)
  end
  puts("measure: #{elapsed_time.total_seconds.round(3)}s")

  # Time::Span: https://crystal-lang.org/api/1.5.0/Time/Span.html
end

def basic_uuid
  # Constructor
  uuid = UUID.new("c2fe82f4-2a48-4c78-aa01-590809058f0a")
  puts("uuid (from string): #{uuid}")
  puts("random: #{UUID.random}")

  # Methods
  puts("v4?: #{uuid.v4?}")
  puts("variant: #{uuid.variant}")
end

def print_section_title(s : String)
  puts("\n", s.upcase, "\n")
end

def main_
  print_section_title("basic base64")
  basic_base64()

  print_section_title("basic compress")
  basic_compress()

  print_section_title("basic crypto")
  basic_crypto()

  print_section_title("basic digest")
  basic_digest()

  print_section_title("basic dir")
  basic_dir()

  print_section_title("basic file")
  basic_file()

  print_section_title("basic file utils")
  basic_file_utils()

  print_section_title("basic http")
  basic_http()

  print_section_title("basic io")
  basic_io()

  print_section_title("basic json")
  basic_json()

  print_section_title("basic path")
  basic_path()

  print_section_title("basic process")
  basic_process()

  print_section_title("basic random")
  basic_random()

  print_section_title("basic regex")
  basic_regex()

  print_section_title("basic time")
  basic_time()

  print_section_title("basic uuid")
  basic_uuid()
end

main_()
