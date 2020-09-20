// ---------------
// NODE.JS (web apps)
// ---------------

// ---------------
// EXPRESS (intro)
// ---------------

// SERVER.JS

const express = require('express');
const hbs = require('hbs');
// express app instance
let app = express();
// use handlebars template engine (html instead of hbs files)
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
// add static folder (static html files)
// app.use(express.static(path.join(__dirname, '/public')));

// urls
app.get('/', (req, res) => {
  // html response
  res.send('<h1>Hello World!</h1>');
});
app.get('/andrew', (req, res) => {
  // json response
  res.send({
    name: 'Andrew',
    likes: [
      'Biking',
      'Cities'
    ]
  });
});
app.get('/about', (req, res) => {
  res.render('about.html');
});
app.listen(3000, () => {
  console.log('Server is up on port 3000');
}); // port, function (when server starts)

// VIEWS/ABOUT.HTML
`
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>About</title>
    <!-- BOOTSTRAP -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <!-- GOOGLE FONTS -->
    <!-- to use in css: 'font-family: 'Open Sans', sans-serif;' -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <!-- FONT AWESOME -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
  </head>
  <body>
    <h1>About Page</h1>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  </body>
</html>
`

// ---------------
// EXPRESS (passing variables)
// ---------------

// SERVER.JS

const express = require('express');
const hbs = require('hbs');
// express app instance
let app = express();
// use handlebars template engine (html instead of hbs files)
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

// urls
app.get('/', (req, res) => {
  // html response (template, {var_object})
  res.render('home.html', {
    pageTitle: 'Home Page',
    currentYear: new Date().getFullYear()
  });
});
app.listen(3000, () => {
  console.log('Server is up on port 3000');
}); // port, function (when server starts)

// VIEWS/HOME.HTML
`
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Home</title>
    <!-- BOOTSTRAP -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <!-- GOOGLE FONTS -->
    <!-- to use in css: 'font-family: 'Open Sans', sans-serif;' -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <!-- FONT AWESOME -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
  </head>
  <body>
    <h1>{{ pageTitle }}</h1>

    <footer>
      <p>Copyright {{ currentYear }}</p>
    </footer>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  </body>
</html>
`

// ---------------
// EXPRESS (template partials)
// ---------------

// SERVER.JS

const path = require('path');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
// express app instance
let app = express();
// enable partial templates
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set('view engine', 'hbs');

// register middleware
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `date: ${now}; method: ${req.method}; url: ${req.url};`
  console.log(`log`);
  fs.appendFile('server.log', `${log} \n`);
  next();
}); // logs info about http requests

// maintenance mode
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// helpers
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
}); // syntax {{ getCurrentYear }}
hbs.registerHelper('screamIt' (text) => {
  return text.toUpperCase()
}); // syntax {{ screamIt someString }}

// routes
app.get('/', (req, res) => {
  // html response (template, {var_object})
  res.render('home.hbs', {
    pageTitle: 'Home Page'
  });
});
app.listen(3000, () => {
  console.log('Server is up on port 3000');
}); // port, function (when server starts)

// VIEWS/HOME.HBS
`
<!DOCTYPE html>
<html lang="en" dir="ltr">
  {{> head }}
  <body>
    <h1>{{ pageTitle }}</h1>
    {{> footer }}
    {{> bs_scripts }}
  </body>
</html>
`
// VIEWS/MAINTENANCE.HBS
`
<!DOCTYPE html>
<html lang="en" dir="ltr">
  {{> head }}
  <body>
    <h1>We'll be right back!</h1>
    <p>This site is currently being updated.</p>
    {{> bs_scripts }}
    </body>
</html>
`
// VIEWS/PARTIALS/HEAD.HBS
`
<head>
  <meta charset="utf-8">
  <title>Home</title>
  <!-- BOOTSTRAP -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <!-- GOOGLE FONTS -->
  <!-- to use in css: 'font-family: 'Open Sans', sans-serif;' -->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
  <!-- FONT AWESOME -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
</head>
`
// VIEWS/PARTIALS/FOOTER.HBS
`
<footer>
  <p>Copyright {{ getCurrentYear }}</p>
</footer>
`
// VIEWS/PARTIALS/BS_SCRIPTS.HBS
`
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
`

// ---------------
// MONGODB
// ---------------

// SQL & noSQL
// table -- collection
// row -- document
// column -- field


// ---------------
// CRUD (mongodb) (nodejs)
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
const {MongoClient, ObjectID} = require('mongodb');
let obj = new ObjectID();
console.log(obj);


// andrew mead's way
const {MongoClient, ObjectID} = require('mongodb'); // destructuring
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
    db.collection('Tasks').find({completed: false}).toArray()
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
      $set: {completed: true}
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
      $inc: {age: 1}
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
    db.collection('Tasks').deleteOne({text: '1st task'})
    .then((result) => {
      console.log(result);
    });
    // delete document (many)
    db.collection('Tasks').deleteMany({text: '1st task'})
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
const {mongoose} = require('mongoose');
const {ObjectID} = require('mongodb');
const {Task} = require('./../models/task');
const {User} = require('./../models/user');

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
Task.findOneAndRemove({_id: taskID})
.then((doc) => {
  console.log(`task: ${doc}`);
})
.catch((e) => {
  console.log(`error: ${e}`);
});

// ---------------
// CRYPTO-JS (SHA256)
// ---------------
const {SHA256} = require('crypto-js'); // hashing function

// token
const data = {
  id: 4
};
const token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'fakesalt').toString()
};

// altered token (without salt)
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

// compare token to resultHash (will catch if token is altered without salt)
const resultHash = SHA256(JSON.stringify(token.data) + 'fakesalt').toString();
if (resultHash === token.hash) {
  console.log('Data is authentic');
} else {
  console.log('Data has been altered/compromised');
}

// ---------------
// JWT (HASHING AND VERIFYING TOKENS)
// ---------------

const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

const token = jwt.sign(data, '123abc') // params: obj, secret(salt?)
const vdata = jwt.verify(token, '123abc'); // params: token, secret(salt?)
console.log(`verified data: ${vdata}`); // prints data or throws error (altered)

// ---------------
// PASSWORDS (HASHING AND SALTING)
// ---------------

const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// password entered
const password = '123abc!'
// get hashed value
bcrypt.genSalt(10, (err, salt) => { // 10 rounds salt
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});
// store hashed value
const hashedPassword = 'fake_hashed_password';
// compare password with hashedPassword
bcrypt.compare(password, hashedPassword).then((res) => {
  console.log(res); // true if match, false if not.
});


// ---------------
//
// ---------------




// ---------------
//
// ---------------





// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------





// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------





// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------





// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------





// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------





// ---------------
//
// ---------------




// ---------------
//
// ---------------














END
