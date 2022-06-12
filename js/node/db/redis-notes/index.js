import Redis from "ioredis";

class RedisDAL {
  constructor(
    url = "redis://localhost:6379",
    options = { retryStrategy: (times) => Math.min(times * 50, 2000) },
  ) {
    this.url = url;
    this.options = options;
    this.connection = null;
  }

  // ---
  // Conn
  // ---

  /** Get a connection */
  getConnection() {
    if (!this.connection) {
      this.connection = new Redis(this.url, this.options);
    }
    return this.connection;
  }
  /** Close connection */
  close() {
    this.connection.close();
    this.connection = null;
  }

  // ---
  // String
  // ---

  /** Set a string value */
  async stringSet(k, v, exp = undefined) {
    const c = this.getConnection();
    return exp ? c.set(k, v, "ex", exp) : c.set(k, v);
  }
  /** Get a string value */
  async stringGet(k) {
    const c = this.getConnection();
    return c.get(k);
  }
  /** Set an expiration on a key */
  async stringExp(k, seconds) {
    const c = this.getConnection();
    return c.expire(k, seconds);
  }

  // ---
  // List
  // ---

  /** Add to the beginning of a list */
  async listLpush(k, s) {
    const c = this.getConnection();
    return c.lpush(k, s);
  }
  /** Add to the end of a list */
  async listRpush(k, s) {
    const c = this.getConnection();
    return c.rpush(k, s);
  }
  /** Get list items, from start to stop */
  async listLrange(k, start, stop) {
    const c = this.getConnection();
    return c.lrange(k, start, stop);
  }
  /** Get the length of a list */
  async listLlen(k) {
    const c = this.getConnection();
    return c.llen(k);
  }
  /** Remove and return the first item from the list */
  async listLpop(k) {
    const c = this.getConnection();
    return c.lpop(k);
  }
  /** Remove and return the last item of the list */
  async listRpop(k) {
    const c = this.getConnection();
    return c.rpop(k);
  }

  // ---
  // Set
  // ---

  /** Add an item to a set */
  async setAdd(k, s) {
    const c = this.getConnection();
    return c.sadd(k, s);
  }
  /** Get the cardinality (elements count) of a set */
  async setCard(k) {
    const c = this.getConnection();
    return c.scard(k);
  }
  /** Get the elements of a set */
  async setMembers(k) {
    const c = this.getConnection();
    return c.smembers(k);
  }
  /** Determine whether item is in the set */
  async setIsmember(k, s) {
    const c = this.getConnection();
    return c.sismember(k, s);
  }

  // ---
  // Sorted Set
  // ---

  /** Add a member to a sorted set */
  async ssAdd(k, s, m) {
    const c = this.getConnection();
    return c.zadd(k, s, m);
  }
  /** Get the cardinality of a sorted set */
  async ssCard(k) {
    const c = this.getConnection();
    return c.zcard(k);
  }
  /** Get the number of elements between two scores in a sorted set */
  async ssCount(k, lb, rb) {
    const c = this.getConnection();
    return c.zcount(k, lb, rb);
  }
  /** Get the score of a member in a sorted set */
  async ssScore(k, m) {
    const c = this.getConnection();
    return c.zscore(k, m);
  }
  /** Get the rank of an element in a sorted set */
  async ssRank(k, m) {
    const c = this.getConnection();
    return c.zrank(k, m);
  }
  /** Remove all elements between two ranks in a sorted set */
  async ssRemrangebyrank(k, lb, rb) {
    const c = this.getConnection();
    return c.zremrangebyrank(k, lb, rb);
  }
  /** Get all elements between two ranks in a sorted set */
  async ssRange(k, lb, rb) {
    const c = this.getConnection();
    return c.zrange(k, lb, rb);
  }

  // ---
  // General
  // ---

  /** Delete a key */
  async del(k) {
    const c = this.getConnection();
    return c.del(k);
  }
}

const main = async () => {
  const redisDal = new RedisDAL();
  let result;

  // ---
  // String
  // ---

  result = await redisDal.stringSet("name", "Kakashi", 60);
  console.log("string SET result: ", result);

  result = await redisDal.stringGet("name");
  console.log("string GET result: ", result);

  result = await redisDal.stringExp("name", 10);
  console.log("string EXPIRE result: ", result);

  result = await redisDal.del("name");
  console.log("string DEL result: ", result);

  // ---
  // List
  // ---

  result = await redisDal.listLpush("dates", "2021-09-15");
  console.log("List LPUSH result:", result);

  result = await redisDal.listRpush("dates", "2021-05-26");
  console.log("List RPUSH result:", result);

  result = await redisDal.listLrange("dates", 0, -1);
  console.log("List LRANGE result:", result);

  result = await redisDal.listLlen("dates");
  console.log("List LLEN result:", result);

  result = await redisDal.listLpop("dates");
  console.log("List LPOP result:", result);

  result = await redisDal.listRpop("dates");
  console.log("List RPOP result:", result);

  result = await redisDal.del("dates");
  console.log("List DEL result:", result);

  // ---
  // Set
  // ---

  for (const [i, color] of Object.entries(["red", "yellow", "blue", "red"])) {
    result = await redisDal.setAdd("colors", color);
    console.log("Set SADD result:", i, result);
  }

  result = await redisDal.setCard("colors");
  console.log("Set SCARD result:", result);

  result = await redisDal.setMembers("colors");
  console.log("Set SMEMBERS result:", result);

  result = await redisDal.setIsmember("colors", "red");
  console.log("Set SISMEMBER result:", result);

  result = await redisDal.del("colors");
  console.log("Set DEL result:", result);

  // ---
  // Sorted set
  // ---

  const scoreItems = [
    [500, "Player 1"],
    [400, "Player 2"],
    [300, "Player 3"],
    [200, "Player 4"],
    [100, "Player 5"],
  ];

  for (const [i, [score, player]] of Object.entries(scoreItems)) {
    result = await redisDal.ssAdd("scores", score, player);
    console.log("Sorted set ZADD result:", i, result);
  }

  result = await redisDal.ssCard("scores");
  console.log("Sorted set ZCARD result:", result);

  result = await redisDal.ssScore("scores", "Player 1");
  console.log("Sorted set ZSCORE result:", result);

  result = await redisDal.ssRank("scores", "Player 3");
  console.log("Sorted set ZRANK result:", result);

  result = await redisDal.ssRemrangebyrank("scores", 0, -4);
  console.log("Sorted set ZREMRANGEBYRANK result:", result);

  result = await redisDal.ssRange("scores", -10, -1);
  console.log("Sorted set ZRANGE result:", result);

  result = await redisDal.del("scores");
  console.log("Sorted set DEL result:", result);

  // ---
  // Terminar
  // ---

  process.exit(0);
};

main();
