# Redis

## Key naming

People use `:` as a delimiter.\
A new pattern would use `#` before unique identifiers.

Use functions to generate keys (for consistency).

## Design

SQL:

- Create tables to house data
- Query it

Redis:

- figure out what queries need answering
- choose data structure to best answer those queries

## Structures and Commands

### General

#### Del

Delete a key (or keys)\
`DEL color`

Set expiration for a key (seconds)\
`EXPIRE color 10`

### String

Set string key\
`SET color red`

Set and get previous value\
`SET color green GET`

Only set if 1) exists, 2) not exists\
`SET color blue XX`\
`SET color blue NX`

Set with expiration (seconds)\
`SET color lavender EX 2`\
Also: PX (ms), EXAT (timestamp seconds), PXAT (timestamp ms)

Get string key\
`GET color`

Set multiple string keys\
`MSET car1:color red car2:color blue`

GET multiple string keys\
`MGET car1:color car2:color`

### String (integer)

`SET mynum 10`\
`INCR mynum`\
`DECR mynum`\
`INCRBY mynum 5`\
`DECRBY mynum 5`

### Hash

Set hash\
`HSET colorhash r red g green b blue`

Add new (or overwrite existing) keys in existing hash\
`HSET colorhash w white b black`

Get value from hash\
`HGET colorhash r`

Get all values from hash (returned as list of values)\
Gotcha: if key DNE, returns empty array (client may format as empty obj)\
`HGETALL colorhash`

See if key is defined in hash\
`HEXISTS colorhash b`

Delete key on hash\
`HDEL colorhash g`

Get list of keys in hash\
`HKEYS colorhash`

### Set

Create set\
`SADD colorset red green blue white black`

Remove set elements\
`SREM colorset white black`

Get random element\
`SRANDMEMBER colorset`

Get cardinality (count)\
`SCARD colorset`

Get members (use SSCAN for chunking)\
`SMEMBERS colorset`

Check membership\
`SISMEMBER colorset red`

Also: SUNION, SDIFF, SINTER

### Sorted set

Add elements to ss\
`ZADD scores 500 "Player 1" 400 "Player2" 300 "Player3"`

Get cardinality of ss (count)\
`ZCARD scores`

Get score of element\
`ZSCORE scores "Player 1"`

Get rank of element\
`ZRANK scores "Player 1"`

Also: ZINCRBY, ZREM, ZRANGE

### List

Add element to front of list\
`LPUSH dates "2021-09-15"`

Add element to end of list\
`RPUSH dates "2021-05-26"`

Get range of elements\
`LRANGE dates 0 -1`

Get length of list\
`LLEN dates`

Remove/return first element\
`LPOP dates`

Remove/return last element\
`RPOP dates`

Also: LSET, LINSERT

## Pipeline

TODO

## Transactions

Notes:

- docs: https://redis.io/docs/manual/transactions/
- transactions should use an isolated client connection
  - don't do unrelated operations during transaction

Transaction pattern:

- `WATCH <key>`
  - cancel transaction if value changes during transaction
- read operations
- `MULTI`
  - start transaction
- write operations
- `EXEC`
  - complete transaction

## Lua Scripting

### Lua basics

```lua
-- print number
print(123)
-- print string
print('Hello there')

-- global variable (DONT)
a = 1
-- local variable
local a = 1

-- if ... then
local result = 5 + 3
if result > 0 then
  print('result is positive')
end
if result ~= 0 then
  print('result is not zero')
end
if result == 0 then
  print('result is zero')
end
if false or not true or nil then
  print('never gets here')
end

-- array
local colors = {'red', 'green', 'blue'}
local first = colors[1] -- one-indexed
local count = #colors
table.insert(colors, 'white') -- append
-- for loop
for i, v in ipairs(colors) do
  print(i, v)
end
-- map
local arr1 = {'1', '2', '3'}
local nums = {}
for _, v in ipairs(arr1) do
    table.insert(nums, tonumber(v))
end


-- table (associative array)
local ninja = {id = 1, name = 'Kakashi'}
print(user['id'])
for k, v in pairs(user) do
  print(k, v)
end
```

### Loading and using script

Steps:

- write script
- load script into redis
  - `SCRIPT LOAD <cmd-str>`
- get script id from redis response
- run script
  - `EVALSHA <sha1> <numkeys> [keys..] [args..]`
- get value from redis reponse

Examples:

TODO

## Redlock

TODO

## Modules

Add additional datatypes/functionality.\
Two popular modules:

- RediSearch
- RedisJSON

RedisStack (by default) includes:

- RediSearch
- RedisJSON
- RedisGraph
- RedisTimeSeries
- RedisBloom

### RediSearch

https://redis.io/docs/stack/search/

Usage:

- create hashes
- create index
  - leverages hash prefix
  - uses schema
- run query

NOTE: the following are changed in tag/text queries:

- punctuation removed
- 'stop' words removed (a, an, the, is, etc)
- stemmming to get base word (runs -> run, running -> run)

Query vs Search:

- Query -- get exact match
- Search -- get close

Text Search special chars:

- Mismatch and `%`
  - `%bar%` allow one char mismatch
  - `%%%vehicle%%%` allow three char mismatch
- Prefix and `*`
  - `bar*` text with `bar` prefix
  - prefix must be gte 2 chars

```
HSET cars:a1 name 'car 1' color black year 2022

FT.CREATE idx:cars ON HASH PREFIX 1 cars#
    SCHEMA name TEXT color TAG year NUMERIC

FT.SEARCH idx:cars '@name:(car 1)'
FT.SEARCH idx:cars '@color:{black}'
FT.SEARCH idx:cars '@year:[1990 2022]'

FT.SEARCH idx:cars '@name:(car)'
FT.SEARCH idx:cars '@name:(car 1 | car 2)'
FT.SEARCH idx:cars '-@name:(car 2)'
FT.SEARCH idx:cars '@name:(%bar%)'

FT.SEARCH idx:cars '@color:{black} @year:[1990 2022]'
FT.SEARCH idx:cars '@color:{black | white | gray | light\ blue}'
FT.SEARCH idx:cars '-@color:{red}'

FT.SEARCH idx:cars '@year:[1990 +inf]'
FT.SEARCH idx:cars '@year:[(2000 (2023]'
FT.SEARCH idx:cars '-@year:[2000 2010]'
```

TODO: EXPLAIN, PROFILE
