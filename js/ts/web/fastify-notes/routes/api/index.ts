// imports
import auth from '../../middleware/auth';

const routes = async (app, options) => {
  // ---------
  // routes
  // ---------

  // @route -- GET /api
  // @desc -- return 200 OK
  // @access -- public

  app.get('/', async (request, reply) => {
    return reply.status(200).send({});
  });

  // @route -- GET /api/hello
  // @desc -- return 'Hello World' (with preHandler) (shorthand declaration)
  // @access -- protected

  app.get('/hello', { preHandler: [auth] }, async (request, reply) => {
    return reply.status(200).send({ message: 'Hello world!' });
  });

  // @route -- GET /api/hello2
  // @desc -- return 'Hello World' (with preHandler) (full declaration)
  // @access -- protected

  app.route({
    method: 'GET',
    url: '/hello2',
    preHandler: [auth],
    handler: async (request, reply) => {
      return reply.status(200).send({ message: 'Hello world!' });
    },
  });

  // @route -- POST /api/greet
  // @desc -- take name (body) and return greeting
  // @access -- protected

  app.post('/greet', { preHandler: [auth] }, (request, reply) => {
    try {
      const { name } = request.body;
      const greeting = `Hello there, ${name}!`; // create greeting
      return reply.status(200).send({ message: greeting });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({});
    }
  });

  // @route -- GET /api/search
  // @desc -- return query
  // @access -- public

  app.get('/search', async (request, reply) => {
    try {
      const { query } = request;
      return reply.status(200).send({ query });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({});
    }
  });
};

export default routes;
