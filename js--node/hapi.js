// ------------
// hapi
// ------------

// install
`
npm i --save @hapi/hapi
`

// ------------
// hello world
// ------------

// imports
const Hapi = require('@hapi/hapi');
// server initialization function
const init = async () => {
  // initialize server
  const server = Hapi.server({
    port: 5000,
    host: 'localhost'
  });
  // routes
  server.route({
    method: 'GET', // http method (can be a single method, array of methods, or '*')
    path: '/', // path (allows for parameters) ('/users/${userId}') ('/users/${userId?}')
    handler: (request, h) => {
      return 'Hello World!'; // handler must return a value or promise, or throw an error
    }
  });
  // start server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};
// error handle
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
// initialize server
init();


// ------------
// request lifecycle
// ------------

// extension points
  // onRequest -- after request received, before route lookup
  // onPreAuth
  // onCredentials
  // onPostAuth
  // onPreHandler
  // onPostHandler
  // onPreResponse

// imports
const Hapi = require('@hapi/hapi');
// server initialization function
const init = async () => {
  // initialize server
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });
  // routes
  server.route({
    method: 'GET', // http method (can be a single method, array of methods, or '*')
    path: '/', // path (allows for parameters) ('/users/${userId}') ('/users/${userId?}')
    handler: (request, h) => {
      // handler must return a value or promise, or throw an error
      return { data: 'Hello World!', error: null };
    }
  });
  // extension point
  server.ext('onRequest', (request, h) => {
    console.log('onRequest function executing')
    return h.continue; // continue request lifecycle
  });
  // start server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};
// error handle
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
// initialize server
init();


// ------------
// plugins (like middleware)
// ------------


// ------------
// auth (passport -> @hapi/bell)
// ------------


// ------------
// validation (express-validator -> joi)
// ------------


// ------------
// views (templates, partials, etc)
// ------------

// h.view 
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, h) {
    return h.view('index', { 
      title: 'Homepage', 
      message: 'Welcome' 
    });
  }
});

// view handler
server.route({
  method: 'GET',
  path: '/',
  handler: {
    view: {
      template: 'index',
      context: {
        title: 'Homepage',
        message: 'Welcome'
      }
    }
  }
});

// ------------
// serve files
// ------------

// server
const server = new Hapi.Server({
  port: 3000,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'public')
    }
  }
});
// register 'inert' plugin
await server.register(require('@hapi/inert'));
// h.file
server.route({
  method: 'GET',
  path: '/image',
  handler: function (request, h) {
    h.file('image.jpg');
  }
});
// file handler
server.route({
  method: 'GET',
  path: '/image',
  handler: {
    file: 'image.jpg'
  }
});

// ------------
// static folder
// ------------


// ------------
// error handling (boom)
// ------------

// docs
  // https://hapi.dev/module/boom/

// @hapi/boom returns JSON errors
`
{
    "statusCode": 404,
    "error": "Not Found",
    "message": "Not Found"
}
`
// 404 error
Boom.notFound('Page not found');


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