'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const auth_1 = __importDefault(require('../../middleware/auth'));
const routes = async (app, options) => {
  app.get('/', async (request, reply) => {
    return reply.status(200).send({});
  });
  app.get(
    '/hello',
    { preHandler: [auth_1.default] },
    async (request, reply) => {
      return reply.status(200).send({ message: 'Hello world!' });
    },
  );
  app.route({
    method: 'GET',
    url: '/hello2',
    preHandler: [auth_1.default],
    handler: async (request, reply) => {
      return reply.status(200).send({ message: 'Hello world!' });
    },
  });
  app.post('/greet', { preHandler: [auth_1.default] }, (request, reply) => {
    try {
      const { name } = request.body;
      const greeting = `Hello there, ${name}!`;
      return reply.status(200).send({ message: greeting });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({});
    }
  });
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
exports.default = routes;
//# sourceMappingURL=index.js.map
