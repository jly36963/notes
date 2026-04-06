// imports
const sayHello = require('../../middleware/say-hello');

// routes
const routes = async (app, options) => {
  // @route -- GET /api
  // @desc -- return 'Hello World'
  // @access -- public

  app.get('/', async (request, reply) => {
    return reply.status(200).send({ data: 'Hello world!', error: null });
  });

  // @route -- POST /api
  // @desc -- return body
  // @access -- public

  app.post('/', async (request, reply) => {
    const { body } = request;
    return reply.status(200).send({ data: body, error: null });
  });

  // @route -- GET /api/hello
  // @desc -- return 'Hello World' (with preHandler)
  // @access -- public

  // route level hooks
  // https://www.fastify.io/docs/latest/Hooks/#route-level-hooks
  // https://github.com/fastify/fastify/issues/740#issuecomment-585822431

  app.get('/hello', { preHandler: [sayHello] }, async (request, reply) => {
    return reply.status(200).send({ data: 'Hello world!', error: null });
  });

  // @route -- GET /api/hello2
  // @desc -- return 'Hello World' (with preHandler) (full declaration)
  // @access -- public

  // syntax
  // full declaration vs shorthand declaration

  app.route({
    method: 'GET',
    url: '/hello2',
    preHandler: [sayHello],
    handler: async (request, reply) => {
      return reply.status(200).send({ data: 'Hello world!', error: null });
    },
  });

  // @route -- GET /api/search
  // @desc -- return query
  // @access -- public

  app.get('/search', async (request, reply) => {
    const { query } = request;
    return reply.status(200).send({ data: query, error: null });
  });

  // @route -- GET /api/users/:id
  // @desc -- return params
  // @access -- public

  app.get('/users/:id', async (request, reply) => {
    const { params } = request;
    return reply.status(200).send({ data: params, error: null });
  });
};

// export
module.exports = routes;
