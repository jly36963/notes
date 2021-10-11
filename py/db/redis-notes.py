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

from typing import Union
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
    print(f"string SET result: {result}")
    result = redis_dal.string_get("name")
    print(f"string GET result: {result}")
    result = redis_dal.string_exp("name", 10)
    print(f"string EXPIRE result: {result}")
    result = redis_dal.string_del("name")
    print(f"string DEL result: {result}")

    # List
    # https://redis.io/commands#list
    # TODO

    # Sorted set
    # https://redis.io/commands#sorted_set
    # TODO

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
        return conn.get(k)

    def string_exp(self, k: str, s: int) -> bool:
        """Set an expiration on a key"""
        conn = self.get_conn()
        return conn.expire(k, s)

    def string_del(self, k: str) -> int:
        """Delete a key"""
        conn = self.get_conn()
        return conn.delete(k)


# ---
# Run
# ---

main()
