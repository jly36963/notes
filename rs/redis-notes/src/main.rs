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
        .set_str("name".to_string(), "Itachi".to_string())
        .await;
    match result {
        Ok(r) => println!("Async string set result: {}", r),
        Err(e) => println!("Async string set error: {}", e),
    }
    let result = async_redis_dal.get_str("name".to_string()).await;
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
    let result = redis_dal.set_str("name".to_string(), "Kakashi".to_string());
    match result {
        Ok(r) => println!("String set result: {}", r),
        Err(e) => println!("String set error: {}", e),
    }
    let result = redis_dal.get_str("name".to_string());
    match result {
        Ok(r) => println!("String get result: {}", r),
        Err(e) => println!("String get error: {}", e),
    }
    let result = redis_dal.expire_str("name".to_string(), 60);
    match result {
        Ok(r) => println!("String expire result: {}", r),
        Err(e) => println!("String expire error: {}", e),
    }
}

// ---
// Structs
// ---

struct RedisDAL {
    client: redis::Client,
}

pub trait TRedisDAL {
    // Connection
    fn get_conn(&self) -> redis::Connection;
    // String
    fn get_str(&self, k: String) -> Result<String, redis::RedisError>;
    fn set_str(&self, k: String, v: String) -> Result<String, redis::RedisError>;
    fn expire_str(&self, k: String, s: usize) -> Result<i32, redis::RedisError>;

    // TODO:
    // lists, sets, sorted sets, hashes
}

impl TRedisDAL for RedisDAL {
    // Connection
    fn get_conn(&self) -> redis::Connection {
        let conn = self.client.get_connection();
        conn.unwrap()
    }
    // String
    fn get_str(&self, k: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.get(k);
        result
    }
    fn set_str(&self, k: String, v: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.set(k, v);
        result
    }
    fn expire_str(&self, k: String, s: usize) -> Result<i32, redis::RedisError> {
        let mut conn = self.get_conn();
        let result = conn.expire(k, s);
        result
    }
}

struct AsyncRedisDAL {
    client: redis::Client,
}

#[async_trait]
pub trait TAsyncRedisDAL {
    // Connection
    async fn get_conn(&self) -> redis::aio::Connection;
    // String
    async fn get_str(&self, k: String) -> Result<String, redis::RedisError>;
    async fn set_str(&self, k: String, v: String) -> Result<String, redis::RedisError>;
}

#[async_trait]
impl TAsyncRedisDAL for AsyncRedisDAL {
    // Connection
    async fn get_conn(&self) -> redis::aio::Connection {
        let conn = self.client.get_async_connection().await;
        conn.unwrap()
    }
    // String
    async fn get_str(&self, k: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn().await;
        let result = conn.get(k).await;
        result
    }
    async fn set_str(&self, k: String, v: String) -> Result<String, redis::RedisError> {
        let mut conn = self.get_conn().await;
        let result = conn.set(k, v).await;
        result
    }
}
