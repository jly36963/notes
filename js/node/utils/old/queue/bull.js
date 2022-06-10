// ------------
// bull
// ------------

// purpose
// reliable, fast redis-based queue for Node.js

// install
// npm i --save bull

// docs
// https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queue
// https://optimalbits.github.io/bull/

// *** redis must be running (default: port 6379) ***

// ------------
// explanation
// ------------

// import
const Queue = require("bull");
// queue --
const myQueue = new Queue("my-queue");
// consumer (worker)
myQueue.process(async (job) => {
  return doSomething(job.data);
});
// producer (add jobs)
const job = await myQueue.add({
  foo: "bar",
});
// listener
myQueue.on("completed", (job, result) => {
  console.log(job, result);
});

// ------------
// job lifecycle
// ------------

// job added --> wait or delayed --> active --> completed or failed --> job finished

// ------------
// queue options
// ------------

const myQueue = new Queue("my-queue", {
  redis: { port: 6379, host: "127.0.0.1", password: "foobar" }, // specify redis connection
  prefix: "bull", // prefix for all queue keys
  limiter: {
    max: 1000, // max number of jobs processed in a given time
    duration: 5000, // given time
  },
});

// ------------
// process syntaxes
// ------------

myQueue.process((job, done) => promise);
myQueue.process((job, done) => string);
myQueue.process(name, (job, done) => string);
myQueue.process(name, concurrency, (job, done) => string);

// ------------
// add options
// ------------

// name is optional, but makes for clearer code and better visualization in UI
// opts is optional, but allows for customization of job

const job = await myQueue.add(name, data, opts); // returns promise

const job = await myQueue.add({ id: 307 });
const job = await myQueue.add(
  "image",
  { fn: "image.jpg", bucket: "my-bucket" },
  { delay: 5000 }
);
const job = await myQueue.add(
  "image",
  { db: "postgres", table: "profiles" },
  { repeat: { every: 10000 } }
);

// ------------
// basic usage
// ------------

// import
const Queue = require("bull");
// create queues
const videoQueue = new Queue("video transcoding", "redis://127.0.0.1:6379"); // specify redis connection string
const audioQueue = new Queue("audio transcoding", {
  redis: { port: 6379, host: "127.0.0.1", password: "foobared" }, // Specify redis connection using object
});
const imgQueue = new Queue("image transcoding");
const pdfQueue = new Queue("pdf transcoding");
// create process
// job.data -- the custom data passed when job was created
// job.id -- id of this job
videoQueue.process((job, done) => {
  try {
    job.progress(42); // transcode video and report progress
    done(); // call done when finished
    done(null, { status: "completed" }); // call done with a result object
  } catch (err) {
    console.log(err);
    done(new Error(err.message)); // call done with error
  }
});
// add to queue
videoQueue.add({ video: "http://example.com/my-video.mov" });

// ------------
// promises
// ------------

videoQueue.process(function (job) {
  // don't forget to remove the done callback!
  // Simply return a promise
  return fetchVideo(job.data.url).then(transcodeVideo);
  // Handles promise rejection
  return Promise.reject(new Error("error transcoding"));
  // Passes the value the promise is resolved with to the "completed" event
  return Promise.resolve({ framerate: 29.5 /* etc... */ });
  // If the job throws an unhandled exception it is also handled correctly
  throw new Error("some unexpected error");
  // same as
  return Promise.reject(new Error("some unexpected error"));
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
