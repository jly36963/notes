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
        Ok(r) => println!("Async string set result: {}", r),
        Err(e) => println!("Async string set error: {}", e),
    }
    let result = async_redis_dal.string_get("name".to_string()).await;
    match result {
        Ok(r) => println!("Async string get result: {}", r),
        Err(e) => println!("Async string get error: {}", e),
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
            Ok(r) => println!("Set SADD result({}): {}", i, r), // TODO: result is 0?
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
    // TODO
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
    fn string_get(&self, k: String) -> Result<String, redis::RedisError>;
    fn string_set(&self, k: String, v: String) -> Result<String, redis::RedisError>;
    fn string_expire(&self, k: String, s: usize) -> Result<i32, redis::RedisError>;
    // List (LPUSH, RPUSH, LRANGE, LTRIM, LLEN, LPOP, RPOP, DEL)
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
    // Other useful methods: SMOVE, SPOP, SREM, SUNION, SDIFF, SINTER (https://redis.io/commands#set)
    fn set_add(&self, k: String, s: String) -> Result<i32, redis::RedisError>;
    fn set_card(&self, k: String) -> Result<i32, redis::RedisError>;
    fn set_members(&self, k: String) -> Result<Vec<String>, redis::RedisError>;
    fn set_ismember(&self, k: String, s: String) -> Result<bool, redis::RedisError>;
    fn set_del(&self, k: String) -> Result<i32, redis::RedisError>;
    // Sorted set
    // TODO
    // Hashes
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
        let result = conn.get(k);
        result
    }
    fn string_set(&self, k: String, v: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.set(k, v);
        result
    }
    fn string_expire(&self, k: String, s: usize) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.expire(k, s);
        result
    }
    // List
    fn list_lpush(&self, k: String, s: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.lpush(k, s);
        result
    }
    fn list_rpush(&self, k: String, s: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.rpush(k, s);
        result
    }
    fn list_lrange(
        &self,
        k: String,
        start: isize,
        stop: isize,
    ) -> Result<Vec<String>, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.lrange(k, start, stop);
        result
    }
    fn list_llen(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.llen(k);
        result
    }
    fn list_lpop(&self, k: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.lpop(k, None);
        result
    }
    fn list_rpop(&self, k: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.rpop(k, None);
        result
    }
    fn list_del(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.del(k);
        result
    }
    // Set
    fn set_add(&self, k: String, s: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.sadd(k, s);
        result
    }
    fn set_card(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.scard(k);
        result
    }
    fn set_members(&self, k: String) -> Result<Vec<String>, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.smembers(k);
        result
    }
    fn set_ismember(&self, k: String, s: String) -> Result<bool, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.sismember(k, s);
        result
    }
    fn set_del(&self, k: String) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.del(k);
        result
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
        let result = conn.get(k).await;
        result
    }
    async fn string_set(&self, k: String, v: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn().await;
        let result = conn.set(k, v).await;
        result
    }
}
