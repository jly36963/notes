# Hapi

A simple hapi app with several middlewares and example of basic usage.

## Setup

- `npm i`

## Startup (dev)

- `npm run dev`

## Startup (prod)

- `npm start`

## middlewares

- joi -- validation
- inert -- static file serving
- boom -- error handling
- pino -- logging
- bell -- authentication

## validation (joi)

This is an arbitrary example where params, query, and payload are getting validated. Normally that doesn't happen.

```js
// imports
const Joi = require('@hapi/joi');

// validation
const paramsSchema = Joi.object({
  id: Joi.string().guid(),
});

const querySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const payloadSchema = Joi.object({
  firstName: Joi.string().min(2).max(30),
  lastName: Joi.string().min(2).max(30),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  repeat_password: Joi.ref('password'),
  access_token: [Joi.string(), Joi.number()],
  birth_year: Joi.number().integer().min(1900).max(2013),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
})
  .with('username', 'birth_year')
  .xor('password', 'access_token')
  .with('password', 'repeat_password')
  .required();

// route
module.exports = (server) => {
  server.route({
    method: 'POST',
    path: '/api/create-user',
    handler: (request, h) => {
      const body = request.payload;
      console.log(body);
      return { data: body, error: null };
    },
    options: {
      validate: {
        // headers: true, // no validation
        // params: paramsSchema, // validate params
        // query: querySchema, // validate query
        payload: payloadSchema, // validate payload
      },
    },
  });
};
```

## Static file server (inert)

```js
// imports
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
// server initialize function
const init = async () => {
  // register middleware
  await server.register(Inert);
  // route
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true,
      },
    },
  });
  // start server
  await server.start();
  // log port
  console.log('Server running at:', server.info.uri);
};
// initialize
init();
```

## Dynamically load routes by filename

```js
// library imports
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

// server initialization function
const init = async () => {
  // initialize server
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
  });
  // register plugins
  await server.register(Inert);
  // routes
  const routeFilePaths = [
    // GET /api/ (none)
    '/api/',
    // POST /api/greet (payload: { name })
    '/api/greet',
    // GET /api/home (redirect to '/')
    '/api/home',
    // GET /api/store/search (query: { k })
    '/api/store/search',
    // GET /api/user/{id} (params: { id })
    '/api/user/',
    // GET / (static file server, uses files in '/public')
    '/',
    // * * (return 404 error)
    '/not-found',
  ];
  routeFilePaths.forEach((routeFilePath) => {
    console.log(`adding route ${routeFilePath}`);
    const addRouteToServer = require(`./routes${routeFilePath}`);
    addRouteToServer(server); // uses server param to run function that adds route.
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
```

### Example of "addRouteToServer"

```js
module.exports = (server) => {
  server.route({
    method: 'GET', // http method (can be a single method, array of methods, or '*')
    path: '/api/', // path (allows for parameters) ('/users/${userId}') ('/users/${userId?}')
    handler: (request, h) => {
      return { data: 'Hello World!', error: null };
    },
  });
};
```

## Integrating routes using plugins

```js
// library imports
const Hapi = require('@hapi/hapi');

// server initialization function
const init = async () => {
  // initialize server
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
  });
  // register plugins
  await server.register([
    // inert (static file server)
    { plugin: require('@hapi/inert'), options: {} },
    // routes
    { plugin: require('./api/routes'), options: {} },
    // static file server route
    { plugin: require('./api/static'), options: {} },
    // not found
    { plugin: require('./api/not-found'), options: {} },
    // pino logger
    { plugin: require('hapi-pino'), options: { prettyPrint: true } },
  ]);

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
```
