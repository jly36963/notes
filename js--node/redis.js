// ------------
// redis
// ------------

// install
`
npm i --save moment redis
`

// docs
  // https://www.npmjs.com/package/redis

// promisify
  // https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original

// ------------
// connect
// ------------

// import
const redis = require('redis');
const { promisify } = require('util'); // promisify redis
// config
const config = {
  port: 6379, // default port
  host: '127.0.0.1', // default host
}
// create client
const client = redis.createClient(config);
// promisify client
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// ------------
// log
// ------------

// on connect
client.on('connect', () => {
  console.log(`Connected on ${host}:${port}`)
})

// on error
client.on('error', (err) => {
  console.log("error", err);
})

// ------------
// callback
// ------------

// set
client.set(
  'name', // key
  'Kakashi', // value
  redis.print // callback
);

// get
client.get(
  'name', // key
  redis.print // callback
);


// ------------
// promises (async / await)
// ------------

// set
const redisSet = async (k, v) => {
  const redisResponse = await setAsync(k, v);
  console.log(redisResponse); // OK
  return redisResponse;
};

redisSet('name', 'Yamato')

// get
const redisGet = async (k) => {
  const redisResponse = await getAsync(k);
  console.log(redisResponse);
  return redisResponse;
};

redisGet('name');


// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



