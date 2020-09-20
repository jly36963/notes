// ------------
// fastify
// ------------

// npm i --save fastify

// ------------
// basic app
// ------------

const fastify = require('fastify');
const app = fastify({ logger: true });
const port = process.env.PORT || 3000;

app.get('/', async (request, reply) => {
  return { data: 'Hello world!', error: null };
})

const start = async () => {
  try {
    await fastify.listen(port);
    fastify.log.info(`server.listening on ${app.server.address().port}`);
  } catch (err) {
    fastify.log.error(err.message);
    process.exit(1)
  }
}
start()

// ------------
// plugins (routes, middleware, etc)
// ------------

// recommended order of plugins
  // plugins (fastify)
  // plugins (custom)
  // decorators
  // hooks
  // services

// server.js

const fastify = require('fastify');
const app = fastify({ logger: true });

app.register(require('./api/index'))

(async (app) => {
  await app.listen(3000);
  app.log.info(`server listening on ${fastify.server.address().port}`);
})(app);

// /api/index.js

const routes = async (app, options) => {
  app.get('/', async (request, reply) => {
    return { data: 'Hello world!', error: null };
  })
}

module.exports = routes;


// ------------
// slugs (dynamic URLs)
// ------------

app.get('/api/users/:userId', (request, reply) => {
  // do something with slug
})


// ------------
// route prefixing
// ------------

const fastify = require('fastify');
const app = fastify({ logger: true });

app.register(require('./api/auth'), { prefix: '/auth' })

app.listen(3000);


// ------------
// middleware
// ------------

// https://www.fastify.io/docs/latest/Middleware/

// npm i --save fastify-express 
// npm i --save middie

const fastify = require('fastify');
const app = fastify({ logger: true });

(async (app) => {
  // plugins
  await app.register(require('fastify-express')); // 'middie' can be used too
  // middleware
  app.use(require('cors')())
  // routes
  app.register(require('./api/index'))
  // listen
  await app.listen(3000);
  app.log.info(`server listening on ${fastify.server.address().port}`);
})(app);


// ------------
// request / reply
// ------------

const fastify = require('fastify');
const app = fastify({ logger: true });

app.get('/', (request, reply) => {
  // request
  request.query // parsed qs
  request.body // body
  request.params // url params (slugs)
  request.headers // headers
  request.raw // raw request

  // reply
  reply.code(200) // sets status code (default 200)
  reply.status(200) // same as above
  reply.header(name, value) // set header
  reply.headers({}) // set multiple headers (key/value)
  reply.redirect(301, 'https://google.com') // redirect
  reply.send({ data: 'Hello!' }) // send response (json, text, buffer, stream, error)

  // when using async/await, don't use send.
  return { data: 'Hello world!' };
})

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
// request/response validation and hooks
// ------------

// fastify.route(options)
// https://www.fastify.io/docs/latest/Routes/

const fastify = require('fastify')({ logger: true })

fastify.route({
  method: 'GET',
  url: '/',
  schema: {
    // request needs to have a querystring with a `name` parameter
    querystring: {
      name: { type: 'string' }
    },
    // the response needs to be an object with an `hello` property of type 'string'
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  },
  // this function is executed for every request before the handler is executed
  preHandler: async (request, reply) => {
    // E.g. check authentication
  },
  handler: async (request, reply) => {
    return { hello: 'world' }
  }
})

const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

// ------------
// other features
// ------------

// printRoutes
  // https://www.fastify.io/docs/latest/Server/#printroutes

// versioning
  // https://www.fastify.io/docs/latest/Routes/#version

// hooks (do something when event occurs)
  // https://www.fastify.io/docs/latest/Hooks/

// decorators (decorate server/request/reply)
  // https://www.fastify.io/docs/latest/Decorators/