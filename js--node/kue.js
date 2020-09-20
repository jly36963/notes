// ------------
// kue
// ------------

// install
`
npm i --save kue
`

// explanation
  // https://medium.com/@niratattri/workers-and-node-kue-it-up-1c1215d9bddf

// purpose
  // creating a job in a route handler allows the request/response cycle to continue/complete while task is executed.

// ------------
// workflow
// ------------

// create queue (requires redis)
// create process
  // leverage function in process
// create job
  // this is the execution of the process
  // specify queue (string) and data (object)
  // chain on options (priority, attempts, backoff, ttl, save)
// set up job events
  // this is how you handle something that is now in a worker process
  // we're removing the task from the current request/response cycle
  // create listeners (with callback functions) for events
    // job.on('complete', (result) => console.log(result))
    // start, failed, complete, remove, etc

// ------------
// create queue
// ------------

// import
var kue = require('kue');

// default connection
const queue = kue.createQueue();

// custom connection
var queue = kue.createQueue({
  prefix: 'q', // prefix -- controls key names used by redis
  redis: {
    port: 6379,
    host: '127.0.0.1',
    // auth, options, etc
  }
});

// ------------
// create jobs
// ------------

// imports
const kue = require('kue');
// create queue
const queue = kue.createQueue();

// create job
const job = queue.create('email', {
  name: 'name here',
  description: 'description here',
})
  .removeOnComplete(true) // remove from queue once complete
  .priority('normal') // low (10), normal (0), medium (-5), high (-10), critical (-15)
  .attempts(3) // number of tries allowed -- default: 1
  .backoff(true) // delay between retries -- { type: 'exponential' }, { delay: 60*1000, type:'fixed' }
  .ttl(60 * 10000) // time to live (stop waiting if TTL exceeded) (ms)
  .save(err => console.log(err)); // save to queue

// ------------
// logs
// ------------

// expose info to the UI at any point of the job's lifetime.

job.log(`${amount} sent to ${person}`); // template literal
job.log('$%d sent to %s', amount, user.name); // sprintf-like formatting

// ------------
// job progress
// ------------

const completedTasks = 10000;
const totalTasks = 15000;
job.progress(completedTasks, totalTasks);

// ------------
// job events
// ------------

// enqueue -- now queued
// start -- started
// promotion -- promoted from delated state to queued
// progress -- progress between 0 and 100
// failed attempt -- failed, but has attempts left
// failed -- failed, no attempts left
// complete -- job has completed
// remove -- job has been removed

// imports
const kue = require('kue');
// create queue
const queue = kue.createQueue();

// create job
const job = queue.create('email', {
  name: 'name here',
  description: 'description here',
}).save();

job.on('complete', (result) => console.log(result));
job.on('failed attempt', (errorMessage, doneAttempts) => console.log(errorMessage, doneAttempts));
job.on('failed', (errorMessage) => console.log(errorMessage));
job.on('progress', (progress, data) => console.log(progress));

// ------------
// queue events
// ------------

queue.on('job enqueue', (id, type) => console.log(`job enqueued: ${id}`))
queue.on('job complete', (id, result) => console.log(id, result))

// ------------
// processing jobs
// ------------

// process
queue.process('email', (job, done) => {
  const { address } = job.data;
  try {
    const result = await email(address, done);
    console.log(result);
    return done();
  } catch (err) {
    return done(new Error(JSON.stringify(err)));
  }
})

// ------------
// error handling (queue)
// ------------

queue.on('error', (err) => {
  console.log("Error", err);
});

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


