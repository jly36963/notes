extern crate redis;
use async_trait::async_trait;
use redis::AsyncCommands;
use redis::Commands;

// ---
// Main
// ---

#[tokio::main]
async fn main() {
    // ---
    // Async
    // ---

    // Create instance of DAL
    let redis_conn_str = String::from("redis://127.0.0.1:6379/");
    let client = redis::Client::open(redis_conn_str.clone()).unwrap();
    let async_redis_dal = AsyncRedisDAL { client };

    // Strings
    let result = async_redis_dal
        .string_set("name".to_string(), "Itachi".to_string())
        .await;
    match result {
        Ok(r) => println!("Async string SET result: {}", r),
        Err(e) => println!("Async string SET error: {}", e),
    }
    let result = async_redis_dal.string_get("name".to_string()).await;
    match result {
        Ok(r) => println!("Async string GET result: {}", r),
        Err(e) => println!("Async string GET error: {}", e),
    }
    let result = async_redis_dal.string_del("name".to_string()).await;
    match result {
        Ok(r) => println!("Async string DEL result: {}", r),
        Err(e) => println!("Async string DEL error: {}", e),
    }

    // ---
    // Sync
    // ---

    // Create instance of DAL
    let redis_conn_str = String::from("redis://127.0.0.1:6379/");
    let client = redis::Client::open(redis_conn_str.clone()).unwrap();
    let redis_dal = RedisDAL { client };

    // Strings
    let result = redis_dal.string_set("name".to_string(), "Kakashi".to_string());
    match result {
        Ok(r) => println!("String SET result: {}", r),
        Err(e) => println!("String SET error: {}", e),
    }
    let result = redis_dal.string_get("name".to_string());
    match result {
        Ok(r) => println!("String GET result: {}", r),
        Err(e) => println!("String GET error: {}", e),
    }
    let result = redis_dal.string_expire("name".to_string(), 60);
    match result {
        Ok(r) => println!("String EXPIRE result: {}", r),
        Err(e) => println!("String EXPIRE error: {}", e),
    }

    // List
    let result = redis_dal.list_lpush("dates".to_string(), "2021-09-15".to_string());
    match result {
        Ok(r) => println!("List LPUSH result: {}", r),
        Err(e) => println!("List LPUSH error: {}", e),
    }
    let result = redis_dal.list_rpush("dates".to_string(), "2021-05-26".to_string());
    match result {
        Ok(r) => println!("List RPUSH result: {}", r),
        Err(e) => println!("List RPUSH error: {}", e),
    }
    let result = redis_dal.list_lrange("dates".to_string(), 0, -1);
    match result {
        Ok(r) => println!("List LRANGE result: {:#?}", r),
        Err(e) => println!("List LRANGE error: {:#?}", e),
    }
    let result = redis_dal.list_llen("dates".to_string());
    match result {
        Ok(r) => println!("List LLEN result: {}", r),
        Err(e) => println!("List LLEN error: {}", e),
    }
    let result = redis_dal.list_lpop("dates".to_string());
    match result {
        Ok(r) => println!("List LPOP result: {}", r),
        Err(e) => println!("List LPOP error: {}", e),
    }
    let result = redis_dal.list_rpop("dates".to_string());
    match result {
        Ok(r) => println!("List RPOP result: {}", r),
        Err(e) => println!("List RPOP error: {}", e),
    }

    let result = redis_dal.list_del("dates".to_string());
    match result {
        Ok(r) => println!("List DEL result: {}", r),
        Err(e) => println!("List DEL error: {}", e),
    }

    // Set
    for (i, color) in vec!["red", "yellow", "blue", "red"].iter().enumerate() {
        let result = redis_dal.set_add("colors".to_string(), color.to_string());
        match result {
            Ok(r) => println!("Set SADD result({}): {}", i, r),
            Err(e) => println!("Set SADD error({}): {}", i, e),
        }
    }
    let result = redis_dal.set_card("colors".to_string());
    match result {
        Ok(r) => println!("Set SCARD result: {}", r),
        Err(e) => println!("Set SCARD error: {}", e),
    }
    let result = redis_dal.set_members("colors".to_string());
    match result {
        Ok(r) => println!("Set SMEMBERS result: {:#?}", r),
        Err(e) => println!("Set SMEMBERS error: {:#?}", e),
    }
    let result = redis_dal.set_ismember("colors".to_string(), "red".to_string());
    match result {
        Ok(r) => println!("Set SISMEMBER result: {}", r),
        Err(e) => println!("Set SISMEMBER error: {}", e),
    }
    let result = redis_dal.set_del("colors".to_string());
    match result {
        Ok(r) => println!("Set DEL result: {}", r),
        Err(e) => println!("Set DEL error: {}", e),
    }

    // Sorted set
    let score_items: Vec<(i32, String)> = vec![
        (500, "Player 1".to_string()),
        (400, "Player 2".to_string()),
        (300, "Player 3".to_string()),
        (200, "Player 4".to_string()),
        (100, "Player 5".to_string()),
    ];
    for (i, (score, player)) in score_items.iter().enumerate() {
        let result = redis_dal.sorted_add("scores".to_string(), *score, player.to_string());
        match result {
            Ok(r) => println!("Sorted set ZADD result({}): {}", i, r),
            Err(e) => println!("Sorted set ZADD error({}): {}", i, e),
        }
    }
    let result = redis_dal.sorted_card("scores".to_string());
    match result {
        Ok(r) => println!("Sorted set ZCARD result: {}", r),
        Err(e) => println!("Sorted set ZCARD error: {}", e),
    }
    let result = redis_dal.sorted_count("scores".to_string(), 200, 500);
    match result {
        Ok(r) => println!("Sorted set ZCOUNT result: {}", r),
        Err(e) => println!("Sorted set ZCOUNT error: {}", e),
    }
    let result = redis_dal.sorted_score("scores".to_string(), "Player 1".to_string());
    match result {
        Ok(r) => println!("Sorted set ZSCORE result: {}", r),
        Err(e) => println!("Sorted set ZSCORE error: {}", e),
    }
    let result = redis_dal.sorted_rank("scores".to_string(), "Player 3".to_string());
    match result {
        Ok(r) => println!("Sorted set ZRANK result: {}", r),
        Err(e) => println!("Sorted set ZRANK error: {}", e),
    }
    let result = redis_dal.sorted_remrangebyrank("scores".to_string(), 0, -4);
    match result {
        Ok(r) => println!("Sorted set ZREMRANGEBYRANK result: {}", r),
        Err(e) => println!("Sorted set ZREMRANGEBYRANK error: {}", e),
    }
    let result = redis_dal.sorted_range("scores".to_string(), -10, -1);
    match result {
        Ok(mut r) => {
            r.reverse(); // high to low score
            println!("Sorted ZRANGE result: {:#?}", r);
        }
        Err(e) => println!("Sorted ZRANGE error: {:#?}", e),
    }
    let result = redis_dal.sorted_del("scores".to_string());
    match result {
        Ok(r) => println!("Sorted set DEL result: {}", r),
        Err(e) => println!("Sorted set DEL error: {}", e),
    }

    // Hashes
    // TODO
}

// ---
// DAL (SYNC)
// ---

struct RedisDAL {
    client: redis::Client,
}

pub trait TRedisDAL {
    // Connection
    fn get_conn(&self) -> redis::Connection;
    // String (GET, SET, EXPIRE)
    // https://redis.io/commands#string
    fn string_get(&self, k: String) -> Result<String, redis::RedisError>;
    fn string_set(&self, k: String, v: String) -> Result<String, redis::RedisError>;
    fn string_expire(&self, k: String, s: usize) -> Result<i32, redis::RedisError>;
    // List (LPUSH, RPUSH, LRANGE, LTRIM, LLEN, LPOP, RPOP, DEL)
    // https://redis.io/commands#list
    fn list_lpush(&self, k: String, s: String) -> Result<i32, redis::RedisError>;
    fn list_rpush(&self, k: String, s: String) -> Result<i32, redis::RedisError>;
    fn list_lrange(
        &self,
        k: String,
        start: isize,
        stop: isize,
    ) -> Result<Vec<String>, redis::RedisError>;
    fn list_llen(&self, k: String) -> Result<i32, redis::RedisError>;
    fn list_lpop(&self, k: String) -> Result<String, redis::RedisError>;
    fn list_rpop(&self, k: String) -> Result<String, redis::RedisError>;
    fn list_del(&self, k: String) -> Result<i32, redis::RedisError>;
    // Set (SADD, SCARD, SMEMBERS, SISMEMBER)
    // https://redis.io/commands#set
    // Other useful methods: SMOVE, SPOP, SREM, SUNION, SDIFF, SINTER
    fn set_add(&self, k: String, s: String) -> Result<i32, redis::RedisError>;
    fn set_card(&self, k: String) -> Result<i32, redis::RedisError>;
    fn set_members(&self, k: String) -> Result<Vec<String>, redis::RedisError>;
    fn set_ismember(&self, k: String, s: String) -> Result<bool, redis::RedisError>;
    fn set_del(&self, k: String) -> Result<i32, redis::RedisError>;
    // Sorted set
    // https://redis.io/commands#sorted_set
    fn sorted_add(&self, k: String, s: i32, m: String) -> Result<i32, redis::RedisError>;
    fn sorted_card(&self, k: String) -> Result<i32, redis::RedisError>;
    fn sorted_count(&self, k: String, min: i32, max: i32) -> Result<i32, redis::RedisError>;
    fn sorted_score(&self, k: String, m: String) -> Result<i32, redis::RedisError>;
    fn sorted_rank(&self, k: String, m: String) -> Result<i32, redis::RedisError>;
    fn sorted_remrangebyrank(
        &self,
        k: String,
        start: isize,
        stop: isize,
    ) -> Result<i32, redis::RedisError>;
    fn sorted_range(
        &self,
        k: String,
        start: isize,
        stop: isize,
    ) -> Result<Vec<String>, redis::RedisError>;
    fn sorted_del(&self, k: String) -> Result<i32, redis::RedisError>;

    // Hashes
    // https://redis.io/commands#hash
    // TODO
}

impl TRedisDAL for RedisDAL {
    // Connection
    fn get_conn(&self) -> redis::Connection {
        let conn = self.client.get_connection();
        conn.unwrap()
    }

    // String
    fn string_get(&self, k: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.get(k)
    }
    fn string_set(&self, k: String, v: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.set(k, v)
    }
    fn string_expire(&self, k: String, s: usize) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.expire(k, s)
    }

    // List
    fn list_lpush(&self, k: String, s: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.lpush(k, s)
    }
    fn list_rpush(&self, k: String, s: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.rpush(k, s)
    }
    fn list_lrange(
        &self,
        k: String,
        start: isize,
        stop: isize,
    ) -> Result<Vec<String>, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.lrange(k, start, stop)
    }
    fn list_llen(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.llen(k)
    }
    fn list_lpop(&self, k: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.lpop(k, None)
    }
    fn list_rpop(&self, k: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.rpop(k, None)
    }
    fn list_del(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.del(k)
    }

    // Set
    fn set_add(&self, k: String, s: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.sadd(k, s)
    }
    fn set_card(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.scard(k)
    }
    fn set_members(&self, k: String) -> Result<Vec<String>, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.smembers(k)
    }
    fn set_ismember(&self, k: String, s: String) -> Result<bool, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.sismember(k, s)
    }
    fn set_del(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.del(k)
    }

    // Sorted Set
    fn sorted_add(&self, k: String, s: i32, m: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.zadd(k, m, s)
    }
    fn sorted_card(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.zcard(k)
    }
    fn sorted_count(&self, k: String, min: i32, max: i32) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.zcount(k, min, max)
    }
    fn sorted_score(&self, k: String, m: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.zscore(k, m)
    }
    fn sorted_rank(&self, k: String, m: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.zrank(k, m)
    }

    fn sorted_remrangebyrank(
        &self,
        k: String,
        start: isize,
        stop: isize,
    ) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.zremrangebyrank(k, start, stop)
    }
    fn sorted_range(
        &self,
        k: String,
        start: isize,
        stop: isize,
    ) -> Result<Vec<String>, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.zrange(k, start, stop)
    }
    fn sorted_del(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        conn.del(k)
    }
}

// ---
// DAL (ASYNC)
// ---

struct AsyncRedisDAL {
    client: redis::Client,
}

#[async_trait]
pub trait TAsyncRedisDAL {
    // Connection
    async fn get_conn(&self) -> redis::aio::Connection;
    // String
    async fn string_get(&self, k: String) -> Result<String, redis::RedisError>;
    async fn string_set(&self, k: String, v: String) -> Result<String, redis::RedisError>;
    async fn string_del(&self, k: String) -> Result<i32, redis::RedisError>;
}

#[async_trait]
impl TAsyncRedisDAL for AsyncRedisDAL {
    // Connection
    async fn get_conn(&self) -> redis::aio::Connection {
        let conn = self.client.get_async_connection().await;
        conn.unwrap()
    }
    // String
    async fn string_get(&self, k: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn().await;
        conn.get(k).await
    }
    async fn string_set(&self, k: String, v: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn().await;
        conn.set(k, v).await
    }
    async fn string_del(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn().await;
        conn.del(k).await
    }
}
