# ---
# Redis
# ---

# Install
# pip install redis

# Docs
# https://github.com/andymccurdy/redis-py

# ---
# Imports
# ---

from typing import Union, List
import redis

# ---
# Main
# ---


def main():
    # Dal
    redis_dal = RedisDAL()

    # String
    # https://redis.io/commands#string
    result = redis_dal.string_set("name", "Kakashi", 60)
    print(f"String SET result: {result}")
    result = redis_dal.string_get("name")
    print(f"String GET result: {result}")
    result = redis_dal.string_exp("name", 10)
    print(f"String EXPIRE result: {result}")
    result = redis_dal.string_del("name")
    print(f"String DEL result: {result}")

    # List
    # https://redis.io/commands#list
    result = redis_dal.list_lpush("dates", "2021-09-15")
    print(f"List LPUSH result: {result}")
    result = redis_dal.list_rpush("dates", "2021-05-26")
    print(f"List LPUSH result: {result}")
    result = redis_dal.list_lrange("dates", 0, -1)
    print(f"List LRANGE result: {result}")
    result = redis_dal.list_llen("dates")
    print(f"List LLEN result: {result}")
    result = redis_dal.list_lpop("dates")
    print(f"List LPOP result: {result}")
    result = redis_dal.list_rpop("dates")
    print(f"List RPOP result: {result}")
    result = redis_dal.list_del("dates")
    print(f"List DEL result: {result}")

    # Set
    # https://redis.io/commands#set
    for i, color in enumerate(["red", "yellow", "blue", "red"]):
        result = redis_dal.set_add("colors", color)
        print(f"Set SADD result {i}: {result}")
    result = redis_dal.set_card("colors")
    print(f"Set SCARD result: {result}")
    result = redis_dal.set_members("colors")
    print(f"Set SMEMBERS result: {result}")
    result = redis_dal.set_ismember("colors", "red")
    print(f"Set SISMEMBER result: {result}")
    result = redis_dal.set_del("colors")
    print(f"Set DEL result: {result}")

    # Sorted set
    # https://redis.io/commands#sorted_set
    score_items = [
        [500, "Player 1"],
        [400, "Player 2"],
        [300, "Player 3"],
        [200, "Player 4"],
        [100, "Player 5"],
    ]
    for (i, (score, player)) in enumerate(score_items):
        result = redis_dal.sorted_add("scores", score, player)
        print(f"Sorted set ZADD result {i}: {result}")
    result = redis_dal.sorted_card("scores")
    print(f"Sorted set ZCARD result: {result}")
    result = redis_dal.sorted_score("scores", "Player 1")
    print(f"Sorted set ZSCORE result: {result}")
    result = redis_dal.sorted_rank("scores", "Player 3")
    print(f"Sorted set ZRANK result: {result}")
    result = redis_dal.sorted_remrangebyrank("scores", 0, -4)
    print(f"Sorted set ZREMRANGEBYRANK result: {result}")
    result = redis_dal.sorted_range("scores", -10, -1)
    print(f"Sorted set ZRANGE result: {result.reverse()}")
    result = redis_dal.sorted_del("scores")
    print(f"Sorted set DEL result: {result}")

    # Hashes
    # https://redis.io/commands#hash
    # TODO

# ---
# Dal
# ---


class RedisDAL:
    def __init__(self, host: str = "127.0.0.1", port: str = "6379") -> None:
        """
        Initialize connection pool
        """
        self.pool: redis.ConnectionPool = redis.ConnectionPool(host=host, port=port)

    def get_conn(self) -> redis.Redis:
        """
        Get connection from pool
        """
        return redis.Redis(connection_pool=self.pool)

    # ---
    # String
    # ---

    def string_set(
        self,
        k: str,
        v: str,
        ex: Union[int, None] = None
    ) -> Union[bool, None]:
        """Set a string in redis"""
        conn = self.get_conn()
        return conn.set(k, v, ex)

    def string_get(self, k: str) -> Union[str, None]:
        """Get a string by its key"""
        conn = self.get_conn()
        result = conn.get(k)
        return result.decode('utf-8') if isinstance(result, bytes) else result

    def string_exp(self, k: str, s: int) -> bool:
        """Set an expiration on a key"""
        conn = self.get_conn()
        return conn.expire(k, s)

    def string_del(self, k: str) -> int:
        """Delete a key"""
        conn = self.get_conn()
        return conn.delete(k)

    # ---
    # List
    # ---

    def list_lpush(self, k: str, s: str) -> int:
        """Add to the beginning of a list"""
        conn = self.get_conn()
        return conn.lpush(k, s)

    def list_rpush(self, k: str, s: str) -> int:
        """Add to the end of a list"""
        conn = self.get_conn()
        return conn.rpush(k, s)

    def list_lrange(self, k: str, start: int, stop: int) -> List[str]:
        """Get list items, from start to stop"""
        conn = self.get_conn()
        result = conn.lrange(k, start, stop)
        return list(map(lambda x: x.decode('utf-8'), result))

    def list_llen(self, k: str) -> int:
        """Get the length of a list"""
        conn = self.get_conn()
        return conn.llen(k)

    def list_lpop(self, k: str) -> str:
        """Remove and return the first item of the list"""
        conn = self.get_conn()
        result = conn.lpop(k)
        return result.decode('utf-8')

    def list_rpop(self, k: str) -> str:
        """Remove and return the last item of the list"""
        conn = self.get_conn()
        result = conn.rpop(k)
        return result.decode('utf-8')

    def list_del(self, k: str) -> int:
        """Delete a key"""
        conn = self.get_conn()
        return conn.delete(k)

    # ---
    # Set
    # ---

    def set_add(self, k: str, s: str) -> int:
        """Add an item to a set"""
        conn = self.get_conn()
        return conn.sadd(k, s)

    def set_card(self, k: str) -> int:
        """Get the cardinality (number of elements) of a set"""
        conn = self.get_conn()
        return conn.scard(k)

    def set_members(self, k: str) -> List[str]:
        """Get the elements of the set"""
        conn = self.get_conn()
        result = conn.smembers(k)
        return list(map(lambda x: x.decode('utf-8'), result))

    def set_ismember(self, k: str, s: str) -> bool:
        """Determine whether the item is in the set"""
        conn = self.get_conn()
        return conn.sismember(k, s)

    def set_del(self, k: str) -> int:
        """Delete a key"""
        conn = self.get_conn()
        return conn.delete(k)

    # ---
    # Sorted Set
    # ---

    def sorted_add(self, k: str, s: int, m: str) -> int:
        """Add a member to a sorted set"""
        conn = self.get_conn()
        return conn.zadd(k, {m: s})

    def sorted_card(self, k: str) -> int:
        """Get the cardinality of a sorted set"""
        conn = self.get_conn()
        return conn.zcard(k)

    def sorted_count(self, k: str, lb: int, rb: int) -> int:
        """Get the number of elements between two scores"""
        conn = self.get_conn()
        return conn.zcount(k, lb, rb)

    def sorted_score(self, k: str, m: str) -> Union[float, None]:
        """Get the score of a member"""
        conn = self.get_conn()
        return conn.zscore(k, m)

    def sorted_rank(self, k: str, m: str) -> Union[int, None]:
        """Get the rank of an element"""
        conn = self.get_conn()
        return conn.zrank(k, m)

    def sorted_remrangebyrank(self, k: str, lb: int, rb: int) -> int:
        """Remove all elements between two ranks"""
        conn = self.get_conn()
        return conn.zremrangebyrank(k, lb, rb)

    def sorted_range(self, k: str, lb: int, rb: int) -> List[str]:
        """Get all elements between two ranks"""
        conn = self.get_conn()
        return conn.zrange(k, lb, rb)

    def sorted_del(self, k: str) -> int:
        """Delete a key"""
        conn = self.get_conn()
        return conn.delete(k)

    # ---
    # Hashes
    # ---

    # TODO


# ---
# Run
# ---

main()
