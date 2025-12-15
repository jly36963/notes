local cjson = require "cjson"

-- ---
-- Main
-- ---

local function main()
  Print_section_title('Basic_variables')
  Basic_variables()

  Print_section_title('Basic_string_interpolation')
  Basic_string_interpolation()

  Print_section_title('Basic_types')
  Basic_types()

  Print_section_title('Basic_operators')
  Basic_operators()

  Print_section_title('Basic_string_methods')
  Basic_string_methods()

  Print_section_title('Basic_if_else')
  Basic_if_else()

  Print_section_title('Basic_for_loop')
  Basic_for_loop()

  Print_section_title('Basic_while')
  Basic_while()

  Print_section_title('Basic_repeat')
  Basic_repeat()

  Print_section_title('Basic_arrays')
  Basic_arrays()

  Print_section_title('Basic_tables')
  Basic_tables()

  Print_section_title('Basic_classes')
  Basic_classes()

  Print_section_title('Basic_io')
  Basic_io()

  Print_section_title('Basic_os')
  Basic_os()

  Print_section_title('Basic_coroutines')
  Basic_coroutines()

  Print_section_title('Basic_errors')
  Basic_errors()
end

-- ---
-- Utils
-- ---

--- print a string in uppercase (wrapped with newlines)
--- @param title string: title to print
--- @return nil
function Print_section_title(title)
  print("\n" .. title .. "\n")
end

-- ---
-- Examples
-- ---

function Basic_variables()
  -- local variables use "local" prefix
  local a = 5
  print('...')
end

function Basic_string_interpolation()
  local name = 'Kakashi'
  local greeting = 'Hello, ' .. name .. '!'
  print(greeting)
end

function Basic_types()
  -- nil
  -- number
  -- string
  -- function
  -- table
  -- CFunction
  -- userdata
end

function Basic_operators()
  print('...')
end

function Basic_string_methods()
  local s = "The inner machinations of my mind are an enigma."
  print('lower:', string.lower(s))
  print('upper:', string.upper(s))
  print('len:', string.len(s))
end

function Basic_if_else()
  -- if ... then, elseif ... then, else, end
  local a = 5
  local b = 10
  if b == 0 then
    print("Please don't divide by zero")
  else
    print("a/b =", a / b)
  end
end

function Basic_for_loop()
  for i = 1, 5 do
    print(i)
  end
end

function Basic_while()
  local n = 1
  while n <= 5 do
    print(n)
    n = n + 1
  end
end

function Basic_repeat()
  local n = 1
  repeat
    print(n)
    n = n + 1
  until n > 5
end

function Basic_arrays()
  local arr = { 1, 2, 3, 4, 5 }
  for i, n in ipairs(arr) do
    print(i, n)
  end
end

function Basic_tables()
  local t = {}
  t['a'] = 1
  t['b'] = 2
  t['c'] = 3

  local data = cjson.encode(t)
  print(data)
end

function Basic_classes()
  print('...')
end

function Basic_io()
  -- io.read
  -- io.write
  -- io.open
  -- io.close

  -- io.stdin
  -- io.stdout
  -- io.stderr

  print('...')
end

function Basic_os()
  -- os.time
  -- os.date
  -- os.clock
  -- os.exit
  -- os.remove
  -- os.rename
  -- os.tmpname
  -- os.getenv
  -- os.execute

  print('...')
end

function Basic_coroutines()
  -- coroutine.create
  -- coroutine.resume
  -- coroutine.yield
  -- coroutine.status
  -- coroutine.wrap
  -- coroutine.running

  print('...')
end

function Basic_errors()
  print('...')
  -- pcall
end

-- ---
-- Run
-- ---

main()

--[[
Mutiline comments
--]]
