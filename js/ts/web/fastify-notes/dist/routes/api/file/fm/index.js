'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const auth_1 = __importDefault(require('../../../../middleware/auth'));
const fastify_multipart_1 = __importDefault(require('fastify-multipart'));
const routes = async (app, options) => {
  app.register(fastify_multipart_1.default);
  app.post(
    '/single',
    { preHandler: [auth_1.default] },
    async (request, reply) => {
      try {
        const { filename } = await request.file();
        return reply.status(200).send({ filename });
      } catch (err) {
        console.log(err);
        return reply.status(500).send({});
      }
    },
  );
};
exports.default = routes;
//# sourceMappingURL=index.js.map
