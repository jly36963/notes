// ------------
// mongodb
// ------------

// mongodb -- js client for mongodb (like psycopg2)
// mongoose -- ODM for mongodb (like SQLAlchemy ORM)

// mongodb port is 27017
// nodejs uses promises when working with mongodb

// ------------
// docker
// ------------

// persisting data
  // windows and OSX can't mount local volumes
  // use named volume
`
docker volume create mongodata
`

// docker-compose
`
services:
  mongo:
    image: mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    ports:
      - "27017:27017"  
    volumes:
      - mongodata:/data/db

volumes:
  mongodata:
    external: true
`

// ------------
// npm installs
// ------------

`
npm init # create nodejs project (sets up node_modules, package.json, etc)
npm install --save mongodb mongoose
`

// ------------
// connect
// ------------

// imports
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// connection string
const url = 'mongodb://localhost:27017'; // connect local
const url = 'mongodb://mongo:27017'; // connect docker-compose
const url = 'mongodb://localhost:27017,localhost:27018/?replicaSet=foo'; // replica set
const url = 'mongodb://localhost:50000,localhost:50001'; // sharded cluster
// which db?
const dbName = 'db1';
// create client
const client = new MongoClient(url);
client.connect((err) => {
  // test
  assert.equal(null, err);
  console.log("Connected successfully to server");
  // select db
  const db = client.db(dbName);
  // DO SOME STUFF
  // close client
  client.close();
});


// ------------
// CRUD
// ------------

// collection methods
// https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne

// imports
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// connect
const url = 'mongodb://mongo:27017';
const dbName = 'db1';
const client = new MongoClient(url);
client.connect((err) => {
  // test
  assert.equal(null, err);
  console.log("Connected successfully to server");
  // select db
  const db = client.db(dbName);

  // CRUD
  // mongodb -- https://docs.mongodb.com/manual/crud/
  // mongodb github -- https://mongodb.github.io/node-mongodb-native/2.2/tutorials/crud/
  // nodejs & mongodb -- http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html

  // insert one
    // '_id' is automatically generated
    // returns document containing 'insertedId' (_id) of inserted document
  db.people.insertOne({
    firstName: "Kakashi",
    lastName: "Hatake",
    age: 46
  })
  // insert many
    // '_id' is automatically generated
    // returns an array of '_id' values for successfully inserted documents
  db.people.insertMany([
    {
      firstName: "Konohamaru",
      lastName: "Sarutobi",
      age: 28
    }, {
      firstName: "Iruka",
      lastName: "Umino",
      age: 45
    }
  ]);
  // find
    // query options -- https://docs.mongodb.com/manual/tutorial/query-documents/#read-operations-query-argument
    // ObjectId will look like `ObjectId('57bf38394b39d2a557e98')`
  db.people.findOne({ _id: 1 }); // return first document match or null
  db.people.find(); // return a cursor of selected documents
  db.people.find().pretty(); // returns documents in pretty format
  db.people.find({ firstName: "Konohamaru" }); // returns cursor of documents that match condition
  db.people.find({ "name.first": "Konohamaru" }); // same as above, with embedded document property
  db.people.find({ firstName: { $in: ["Kakashi", "Konohamaru"]}}) // membership testing
  db.people.find({ firstName: "Hiruzen", lastName: "Sarutobi"}) // multiple conditions
  db.people.find({ $or: [{ firstName: "Itachi" }, { lastName: "Uchiha" }]}); // or condition
  db.people.find({ name: { $regex: '^Kaka*' }}) // regex expression
  db.people.find().filter({ _id: 1 }); // return cursor of documents, then filter. 
  db.people.find().sort({ lastName: 1, firstName: -1 }); // sort by lastname (asc), firstname (desc)
  db.people.find().limit(10); // limit cursor size to 10
  // find and update (filter, update method, options)
  db.people.findOneAndUpdate({ firstName: "Kakashi" }, { $set: { firstName: "Kaka Sensei" } }) // update and return old document
  db.people.findOneAndUpdate({ firstName: "Kakashi" }, { $set: { firstName: "Kaka Sensei" } }, { returnNewDocument: true }) // update and return new document
  db.people.updateOne({ firstName: "Kakashi" }, { $set: { firstName: "Kaka Sensei" }}) // update, return document with 'modifiedCount'
  db.people.updateMany({ lastName: "Uchiha" }, { $set: { lastName: "Of the Uchiha Clan" }}) //  update, return document with 'modifiedCount'
  // find and delete
  db.people.findOneAndDelete({ _id: 1 }); // find first matching document, delete it, return it
  db.people.deleteOne({ _id: 1 }) // find first matching document, delete it, return document with 'deletedCount'
  db.people.deleteMany({ lastName: "Uchiha" }); // delete all matching documents, return document with 'deletedCount'
  
  // close client
  client.close();
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







// ---------------
// MONGODB
// ---------------

// MONGODB-CONNECT.JS

// connection (documentation)

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'app1';
MongoClient.connect(url, (err, client) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName)
  client.close();
});
`
// manual id creation (destructuring)
`
const { MongoClient, ObjectID } = require('mongodb');
let obj = new ObjectID();
console.log(obj);


// andrew mead's way
const { MongoClient, ObjectID } = require('mongodb'); // destructuring
const url = 'mongodb://localhost:27017/App1'
MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDB server');
  } else {
    console.log('Connected to MongoDB server!');
    const db = client.db('App1');
    // insert document (Tasks)
    db.collection('Tasks').insertOne({
      text: "1st task",
      completed: false
    }, (err, result) => {
      if (err) {
        console.log('Unable to insert task', err);
      } else {
        console.log(JSON.stringify(result.ops, undefined, 2));
      }
    });
    // insert document (Users)
    db.collection('Users').insertOne({
      name: "Andrew",
      age: 25,
      location: 'Philadelphia'
    }, (err, result) => {
      if (err) {
        console.log('Unable to insert user', err);
      } else {
        console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id)// _id
        console.log(result.ops[0]._id.getTimestamp()); // timestamp
      }
    });
    // read documents (all)
    db.collection('Tasks').find() // fetch all documents from 'Tasks' (cursor)
    db.collection('Tasks').find().toArray() // promise array
      .then((docs) => {
        console.log('Tasks');
        console.log(JSON.stringify(docs, undefined, 2));
      }, (err) => {
        console.log('Unable to fetch tasks', err);
      });
    // read document (query)
    db.collection('Tasks').find({ completed: false }).toArray()
      .then((docs) => {
        console.log('Tasks');
        console.log(JSON.stringify(docs, undefined, 2));
      }, (err) => {
        console.log('Unable to fetch tasks', err);
      });
    // read document (query id)
    db.collection('Tasks').find({
      _id = new ObjectID('57abb814c1b824944d5f508e') // arbitrary ID
    }).toArray()
      .then((docs) => {
        console.log('Tasks');
        console.log(JSON.stringify(docs, undefined, 2));
      }, (err) => {
        console.log('Unable to fetch tasks', err);
      });
    // read document (count)
    db.collection('Tasks').find().count()
      .then((count) => {
        console.log(`Tasks left: ${count}`);
      }, (err) => {
        console.log('Unable to fetch tasks', err);
      });

    // update document (params: query, update operator, return original)
    db.collection('Tasks').findOneAndUpdate({
      _id = new ObjectID('57abb814c1b824944d5f508e')
    }, {
      $set: { completed: true }
    }, {
      returnOriginal: false
    })
      .then((result) => {
        console.log(result.value);
      })
      .catch((err) => {
        console.log(`error: ${err}`);
      });
    // update document (increment)
    db.collection('Users').findOneAndUpdate({
      _id = new ObjectID('57abb814c1b824944d5f508e')
    }, {
      $inc: { age: 1 }
    }, {
      returnOriginal: false
    })
      .then((result) => {
        console.log(result.value);
      })
      .catch((err) => {
        console.log(`error: ${err}`);
      });
    // delete document (one)
    db.collection('Tasks').deleteOne({ text: '1st task' })
      .then((result) => {
        console.log(result);
      });
    // delete document (many)
    db.collection('Tasks').deleteMany({ text: '1st task' })
      .then((result) => {
        console.log(result);
      });
    // delete document (find one and delete)
    db.collection('Tasks').findOneAndDelete({
      _id = new ObjectID('57abb814c1b824944d5f508e')
    })
      .then((result) => {
        console.log(result.value);
      })
      .catch((err) => {
        console.log(`error: ${err}`);
      });

    client.close();
  }
});

// ---------------
// MONGOOSE (ORM) (NODEJS MONGODB NATIVE)
// ---------------

// SERVER/SERVER.JS

const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // configures mongoose to handle promises
mongoose.connect('mongodb://localhost:27017/App1');

// task model
const Task = mongoose.model('Task', {
  text: {
    type: String,
    required: true,
    trim: true, // removes leading/trailing whitespace
    minlength: 2
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

// user model
const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  }
});

// example: task instance
const newTask = new Task({
  text: 'Get dinner',
  completed: true,
  completedAt: 1537296515612
});
newTask.save()
  .then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
  }, (e) => {
    console.log('Unable to save task', e);
  });

// example: user instance
const newUser = new User({
  email: 'myemail@gmail.com'
});
newUser.save()
  .then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
  }, (e) => {
    console.log('Unable to save user', e);
  });

// ---------------
// MONGOOSE QUERIES
// ---------------

// SERVER/DB/MONGOOSE-QUERIES.JS
const { mongoose } = require('mongoose');
const { ObjectID } = require('mongodb');
const { Task } = require('./../models/task');
const { User } = require('./../models/user');

const taskID = '57bf38394b39d2a557e98';
// is ID valid?
if (!ObjectID.isValid(taskID)) {
  console.log('ID not valid');
}

// find (returns array of objects)
Task.find()
// find (with query) (returns array of objects) (returns empty array if !match)
Task.find({
  _id: taskID
})
  .then((tasks) => {
    console.log(`Tasks: ${tasks}`);
  });
// findOne (returns object) (returns 'null' if no match)
Task.findOne({
  _id: taskID
})
  .then((task) => {
    console.log(`Task: ${task}`)
  })
// findById (returns object) (returns 'null' if no match)
Task.findById(taskID)
  .then((task) => {
    if (!task) {
      console.log('ID not found');
    } else {
      console.log(`Task: ${task}`);
    }
  })
  .catch((e) => {
    console.log(`error: ${e}`);
  });
// remove (if empty: removes all)(else: removes documents that match conditions)
Task.remove({}) // Task.remove({_id: taskID})
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    console.log(`error: ${e}`);
  });
// findByIdAndRemove (returns object)
Task.findByIdAndRemove(taskID)
  .then((doc) => {
    console.log(`task: ${doc}`);
  })
  .catch((e) => {
    console.log(`error: ${e}`);
  });
// findOneAndRemove (returns object)
Task.findOneAndRemove({ _id: taskID })
  .then((doc) => {
    console.log(`task: ${doc}`);
  })
  .catch((e) => {
    console.log(`error: ${e}`);
  });


