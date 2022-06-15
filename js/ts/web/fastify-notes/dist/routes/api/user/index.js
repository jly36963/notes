'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const auth_1 = __importDefault(require('../../../middleware/auth'));
const routes = async (app, options) => {
  app.get('/:id', { preHandler: [auth_1.default] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const user = { id, firstName: 'Kakashi', lastName: 'Hatake' };
      return reply.status(200).send({ user });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({});
    }
  });
  app.post('/create', async (request, reply) => {
    try {
      const { firstName, lastName } = request.body;
      const user = { id: 1, firstName, lastName };
      return reply.status(200).send({ user });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({});
    }
  });
};
exports.default = routes;
//# sourceMappingURL=index.js.map
