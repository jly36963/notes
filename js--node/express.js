// ------------
// express
// ------------

// install
`
npm i --save express
`

// ------------
// hello world
// ------------

// imports
const express = require('express');
const app = express();
// json middleware
app.use(express.json());
// route
app.get('/', (req, res) => res.json({ data: 'Hello World!', error: null }));
// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// ------------
// methods
// ------------

// imports
const express = require('express');
const app = express();

// routes
app.get('/', (req, res) => {
  return res.send('Hello World!')
})
app.post('/', (req, res) => {
  return res.send('Got a POST request')
})
app.put('/user', (req, res) => {
  return res.send('Got a PUT request at /user')
})
app.delete('/user', (req, res) => {
  return res.send('Got a DELETE request at /user')
})

// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// ------------
// static 
// ------------

// imports
const path = require('path');
const express = require('express');
const app = express();

// static (unstable)
  // ./public/img/kitten.jpg --> localhost:5000/img/kitten.jpg
  // serve static assets from a folder (
    // this is relative to the current working directory
    // use below option instead
app.use(express.static('public'))

// static (stable)
  // uses absolute path, won't change based on CWD
app.use(express.static(path.join(__dirname, 'public')))

// specify mount path
  // ./public/img/kitten.jpg --> localhost:5000/static/img/kitten.jpg
app.use('/static', express.static(path.join(__dirname, 'public')))

// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// ------------
// error
// ------------

// imports
const express = require('express');
const app = express();
// route
app.get('/', (req, res) => {
  try {
    const user = { name: "Kakashi" } // pretend db data
    return res.json({ data: user, error: null })
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message })
  }
})
// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// ------------
// send html
// ------------

// ???

// imports
const express = require('express');
const app = express();
// route
app.get('/', (req, res) => {
  res.sendFile() 
})
// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// ------------
// params
// ------------

// imports
const express = require('express');
const app = express();
// route
app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  console.log(id)
  const user = { id, name: "Kakashi" } // pretend db data
  return res.json({ data: user, error: null });
})
// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// ------------
// query
// ------------

// imports
const express = require('express');
const app = express();
// route
app.get('/store/search', (req, res) => {
  const query = req.query;
  console.log(query);
  return res.json({ data: query, error: null });
})
// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// ------------
// body
// ------------

// imports
const express = require('express');
const app = express();
// middleware
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded()); // parse URL-encoded bodies
// route
app.post('/users/create', (req, res) => {
  const { user } = req.body;
  console.log(user);
  return res.json({ data: user, error: null });
})
// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))


// ------------
// middleware
// ------------

// imports
const express = require('express');
const app = express();
// json middleware
app.use(express.json());
// route middleware
  // if auth, go to next middleware (or route handler)
  // if !auth, send 401 error
const auth = (req, res, next) => {
  const { authState } = req.body;
  if (!authState) return res.status(401).json({ data: null, error: 'Improper Auth' });
  next();
}
// route (endpoint, middleware, handler)
app.get(
  '/',
  auth,
  (req, res) => {
    try {
      const hello = 'Hello world!'
      return res.json({ data: hello, error: null })
    } catch (err) {
      return res.status(500).json({ data: null, error: err.message })
    }
  }
);
// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// ------------
// download
// ------------

// not sure what the difference between res.attachment() and res.download() is.

// imports
const express = require('express');
const app = express();
// json middleware
app.use(express.json());
// route
app.get(
  '/files/s3/:id',
  (req, res) => {
    const { id } = req.params;
    const fileData = { id, fn: 'file.txt', location: 'some-s3-location.com/bucket-name/file.txt'} // pretend db data
    return res.download(
      filedata.location, // file to send (location)
      fn // name of file
    );
  }
)
// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// ------------
// redirect
// ------------

// imports
const express = require('express');
const app = express();
// json middleware
app.use(express.json());
// route
app.get('/', (req, res) => {
  return res.redirect('/home');
})
app.get('/home', (req, res) => {
  return res.json({ data: 'Hello there!', error: null })
})
// server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// ------------
// render
// ------------

// used to render views (templates)

// ------------
// send
// ------------

// send http response

// ------------
// sendFile
// ------------

// send file from path
  // res.sendFile(path [, options] [,fn])
  // if root not specified in options, absolute path must be used.

// ------------
// sendStatus
// ------------

// send status and string representation of status as response
res.sendStatus(200) // res.status(200).send('OK')

// ------------
// router
// ------------

// https://expressjs.com/en/5x/api.html#router

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



