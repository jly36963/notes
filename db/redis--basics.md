# redis

## about

- Redis -- REmote DIctionary Server
- open source, in-memory db
- written in C

## common uses

- user sessions
- job queues

## data structures

- strings
  - unicode
  - `"Hello"`
- bitmaps
  - 0s and 1s
  - `01100101100011101011`
- bitfield
  - signed or unsigned ints
  - `{23334}{112345569}{766538}`
- hashes
  - hash maps
  - `{ A: "foo", B: "bar", C: "baz" }`
- lists
  - doubly linked lists
  - `[A -> B -> C -> D -> E]`
  - add/remove from beginning or end
- sets
  - mathmatical sets (set theory)
- sorted sets
  - similar to set
- geospatial indexes
  - similar to set
- hyperloglog
  - estimate cardinality
- streams
  - series of hashmap-like objects, stored in time-sequence order

## about redis

- all keys can have an expiry
- keys and operations can be registered (listented to)
- nil if no value for key
- expire is approximate, not exact
- people use colons as delimiters (ie -- "jobs:user:create:ae152329f0")

## redis cli

```
# ---
# strings
# ---

# set
SET <key> <value>

# mset (set multiple)
MSET <key> <value> [ <key> <value> [ ... ] ]

# get
GET <key>

# expire
EXPIRE <key> <seconds-until-expire>

# unlink (remove association, free up memory at some time in future) (async/non-blocking)
UNLINK <key>

# del (delete, take the time to free up memory immediately) (sync/blocking)
DEL <key>

# ---
# hashes
# ---

# hset (variadic)
HSET <key> <field> <value> [ <field> <value> [...] ]

# hget (get one)
HGET <key> <field>

# hmget (get multiple)
HMGET <key> <field> [ <field> [...] ]

# hincrby (increment a field by n)
HINCRBY <key> <field> <n>

# hdel
HDEL <key> <field>

# ---
# lists
# ---

# lpush (add to beginning)
LPUSH <key> <element> [<element> [...]]

# rpush (add to end)
RPUSH <key> <element> [<element> [...]]

# lpop (remove from beginning)
LPOP <key> [<count>]

# rpop (remove from end)
RPOP <key> [<count>]

# llen (length of list)
LLEN <key>

# rpoplpush (remove item from end and add to beginning of another)
RPOPLPUSH <source-queue> <dest-queue>

# ---
# sets
# ---

# sadd
SADD <key> <member> [<member> [...]]

# smembers (get all members in a set)
SMEMBERS <key>

# scard (get number of members in set)
SCARD <key>

# sunion (add multiple sets)
SUNION <key> [<key> [...]]

# sinter (intersection)
SINTER <key> [<key> [...]]

# ---
# sorted set
# ---

# zadd
ZADD <key> <score> <member> [ <score> <member> [...] ]

# zrem
ZREM <key> <member>

# zcard (get number of members in sorted set)
ZCARD <key>

# zcount (count members where scores fall within range)
ZCOUNT <key> <min> <max>

# zrange (return range of members) (low to high)
ZRANGE <key> <min> <max> [WITHSCORES]

# zrevrange (return reversed range of members) (high to low)
ZREVRANGE <key> <start> <stop> [WITHSCORES]

# zrank (determine index of member in sorted set)
ZRANK <key> <member>

# ---
# geoset (todo)
# ---

# geoadd
# geodist
# georadius

# ---
# memory (todo)
# ---

MEMORY STATS

```
