// ------------
// bullmq (distributed)
// ------------

// docs
  // https://docs.bullmq.io/

// install
// npm i --save bullmq

// *** redis must be running (default: port 6379) ***

// ------------
// basics
// ------------

// bullmq -- four classes:
  // Queue -- an instance will manage jobs.
  // Worker -- an instance will process the jobs. (bullmq supports mutliple workers.)
  // QueueScheduler -- an instance will help manage stalled/delayed jobs.
  // QueueEvents -- an instance will listen for all events from all workers.

// queue -- a list of jobs waiting to be processed. This class can add jobs or manipulate them.
// job -- user created data structure that can be stored in the (redis) queue.
// bullmq supports multiple workers. 
  // multiple workers in a nodejs process, multiple processes, and/or different machines
  // bullmq will distribute jobs across workers in a round robin fashion.
  // workers will all consume jobs from the queue and mark them as completed/failed
// connection -- bullmq uses 'ioredis' to connect to redis 
  // and the options passed during bullmq instantiation are forwarded to ioredis.

// ------------
// basic usage
// ------------

// add jobs to queue

// import
import { Queue, Worker, QueueScheduler, QueueEvents } from 'bullmq';
// create queue scheduler
myQueueScheduler = new QueueScheduler('Paint');
// create queue
const paintQueue = new Queue('Paint', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});
// add queue listeners
paintQueue.on('waiting', (job) => {
  console.log('waiting...');
});
// create worker
const worker = new Worker('Paint', async job => {
  if (job.name === 'cars') {
    await paintCar(job.data.color);
  }
})
// add worker listeners
worker.on('completed', job => {
  console.log(`${job.id} has completed`);
})
worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
})
// add job to queue
const addJobs = async () => {
  await paintQueue.add('cars', { color: 'blue' });
  await paintQueue.add('cars', { color: 'green' });
  await paintQueue.add('cars', { color: 'red' });
}
addJobs();
// queueEvents (listen to all events from all workers in a single place)
const queueEvents = new QueueEvents();
// create queueEvents listeners
queueEvents.on('progress', ({ jobId, data }, timestamp) => {
  console.log(`${jobId} reported progress ${data} at ${timestamp}`);
})
queueEvents.on('completed', jobId => {
  console.log('complete!');
})
queueEvents.on('failed', (jobId, err) => {
  console.log(`id: ${jobId}, err: ${err.message}`);
})

// ------------
// connection
// ------------

// imports
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

// queue using default redis connection (localhost:6379)
const myQueue = new Queue('my-queue');
// queue using custom options for redis connection
const myQueue = new Queue('my-queue', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});
// using ioredis connection
const connection = new IORedis();
const myQueue = new Queue('my-queue', { connection });
const myWorker = new Worker(
  'my-worker', // name
  async (job) => { doSomething(job.data) }, // job process
  { connection }); // options

// ------------
// queues
// ------------

// add
  // adds a job to the queue. it will be stored in redis until a worker picks it up.
  // options -- delay (integer), priority (integer), backoff (integer), lifo (boolean), repeat (object), remove-on-complete, etc
await myQueue.add('paint', { colour: 'red' }) // params: name, data
await myQueue.add('paint', { colour: 'blue' }, { delay: 5000 }) // params: name, data, options


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



