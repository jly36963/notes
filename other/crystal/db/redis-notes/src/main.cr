require "redis"

class RedisDAL
  private property host : String
  private property port : Int32
  private property conn : Redis # property pool : Redis::PooledClient

  def initialize(@host = "127.0.0.1", @port = 6379)
    @conn = Redis.new(host: @host, port: @port)
  end

  # ---
  # Internal
  # ---

  # Get a connection from the connection pool
  private def get_conn
    @conn
  end

  # ---
  # General
  # ---

  # Set an expiration for a key
  def key_exp(k : String, s : Int) : Bool
    conn = get_conn()
    result = conn.expire(k, s)
    result > 0
  end

  # Delete key(s)
  def key_del(*k : String) : Bool
    conn = get_conn()
    len = k.size
    result = conn.del(*k)
    result == len
  end

  # ---
  # String
  # ---

  # Set a string
  def string_set(k : String, v : String, ex : Int?) : Bool
    conn = get_conn()
    result = ex ? conn.set(k, v, ex: ex) : conn.set(k, v)
    !!result
  end

  # Get a string
  def string_get(k : String) : String?
    conn = get_conn()
    conn.get(k)
  end

  # ---
  # List
  # ---

  # Add elements to the beginning of a list
  def list_lpush(k : String, *s : String) : Bool
    conn = get_conn()
    len = s.size
    result = conn.lpush(k, *s)
    result == len
  end

  # Add elements to the end of a list
  def list_rpush(k : String, *s : String) : Bool
    conn = get_conn()
    len = s.size
    result = conn.rpush(k, *s)
    result == len
  end

  # Get list elements, from start to stop
  def list_lrange(k : String, start : Int, stop : Int) : Array(String)
    conn = get_conn()
    result = conn.lrange(k, start, stop)
    result.map(&.to_s)
  end

  # Get the length of a list
  def list_llen(k : String) : Int
    conn = get_conn()
    conn.llen(k)
  end

  # Remove and return the first element of a list
  def list_lpop(k : String) : String?
    conn = get_conn()
    result = conn.lpop(k)
    result ? result.to_s : nil
  end

  # Remove and return the last element of a list
  def list_rpop(k : String) : String?
    conn = get_conn()
    result = conn.rpop(k)
    result ? result.to_s : nil
  end

  # ---
  # Set
  # ---

  # Add an element to a set
  def set_add(k : String, s : String) : Int
    conn = get_conn()
    conn.sadd(k, s)
  end

  # Get the cardinality (number of elements) of a set
  def set_card(k : String) : Int
    conn = get_conn()
    conn.scard(k)
  end

  # Get the elements of a set
  def set_members(k : String) : Array(String)
    conn = get_conn()
    conn.smembers(k).map(&.to_s)
  end

  # Check membership of element in a set
  def set_ismember(k : String, m : String) : Bool
    conn = get_conn()
    conn.sismember(k, m) > 0
  end

  # ---
  # Sorted Set
  # ---

  # Add a member to a sorted set

  def sorted_add(k : String, s : Float, m : String) : Int
    conn = get_conn()
    result = conn.zadd(k, s, m) # variadic; Eg: conn.zadd(k, s1, m1, s2, m2)
    result.is_a?(Int) ? result : result.to_i
    # TODO: why does zadd return (Int | String)
  end

  # Get the cardinality of a sorted set
  def sorted_card(k : String) : Int
    conn = get_conn()
    conn.zcard(k)
  end

  # Get the number of members between two scores
  def sorted_count(k : String, lb : Float, rb : Float) : Int
    conn = get_conn()
    conn.zcount(k, lb, rb)
  end

  # Get the score of a member
  def sorted_score(k : String, m : String) : Float64?
    conn = get_conn()
    result = conn.zscore(k, m)
    result ? result.to_f : nil
  end

  # Get the rank of a member
  def sorted_rank(k : String, m : String) : Int64?
    conn = get_conn()
    conn.zrank(k, m)
  end

  # Remove all members between two ranks
  def sorted_remrangebyrank(k : String, lb : Int, rb : Int) : Int
    conn = get_conn()
    conn.zremrangebyrank(k, lb, rb)
  end

  # Get all members between two ranks
  def sorted_range(k : String, lb : Int, rb : Int) : Array(String)
    conn = get_conn()
    conn.zrange(k, lb, rb).map(&.to_s)
  end

  # ---
  # Hashes
  # ---

  # TODO
end

def main_
  r = RedisDAL.new

  # String
  # https://redis.io/commands#string
  puts("String SET result: #{r.string_set("name", "Kakashi", 60)}")
  puts("String GET result: #{r.string_get("name")}")
  puts("General EXPIRE result: #{r.key_exp("name", 30)}")
  puts("General DEL result: #{r.key_del("name")}")

  # List
  # https://redis.io/commands#list
  puts("List LPUSH result: #{r.list_lpush("dates", "2021-09-15")}")
  puts("List RPUSH result: #{r.list_rpush("dates", "2021-05-26")}")
  puts("List LRANGE result: #{r.list_lrange("dates", 0, -1)}")
  puts("List LLEN result: #{r.list_llen("dates")}")
  puts("List LPOP result: #{r.list_lpop("dates")}")
  puts("List RPOP result: #{r.list_rpop("dates")}")
  puts("General DEL result: #{r.key_del("dates")}")

  # Set
  # https://redis.io/commands#set
  ["red", "yellow", "blue", "red"].each_with_index do |c, i|
    puts("Set SADD result #{i}: #{r.set_add("colors", c)}")
  end
  puts("Set SCARD result: #{r.set_card("colors")}")
  puts("Set SMEMBERS result: #{r.set_members("colors")}")
  puts("Set SISMEMBER result: #{r.set_ismember("colors", "red")}")
  puts("General DEL result: #{r.key_del("colors")}")

  # Sorted set
  # https://redis.io/commands#sorted_set
  score_items : Array(Tuple(Float64, String)) = [
    {500.0, "Player 1"},
    {400.0, "Player 2"},
    {300.0, "Player 3"},
    {200.0, "Player 4"},
    {100.0, "Player 5"},
  ]
  score_items.each_with_index do |(score, player), i|
    puts("Sorted set ZADD result #{i}: #{r.sorted_add("scores", score, player)}")
  end
  puts("Sorted set ZCARD result: #{r.sorted_card("scores")}")
  puts("Sorted set ZCOUNT result: #{r.sorted_count("scores", 200.0, 400.0)}")
  puts("Sorted set ZSCORE result: #{r.sorted_score("scores", "Player 1")}")
  puts("Sorted set ZRANK result: #{r.sorted_rank("scores", "Player 3")}")
  puts("Sorted set ZREMRANGEBYRANK result: #{r.sorted_remrangebyrank("scores", 0, -4)}")
  puts("Sorted set ZRANGE result: #{r.sorted_range("scores", -10, -1).reverse}")
  puts("General DEL result: #{r.key_del("scores")}")
end

main_()
