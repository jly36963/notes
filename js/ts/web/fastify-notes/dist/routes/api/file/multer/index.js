'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const auth_1 = __importDefault(require('../../../../middleware/auth'));
const fastify_multer_1 = __importDefault(require('fastify-multer'));
const upload = fastify_multer_1.default();
const routes = async (app, options) => {
  app.register(fastify_multer_1.default.contentParser);
  app.post(
    '/single',
    { preHandler: [auth_1.default, upload.single('file')] },
    async (request, reply) => {
      try {
        const { originalname: filename } = request.file;
        return reply.status(200).send({ filename });
      } catch (err) {
        console.log(err);
        return reply.status(500).send({});
      }
    },
  );
  app.post(
    '/array',
    { preHandler: [auth_1.default, upload.array('files')] },
    async (request, reply) => {
      try {
        const { files } = request;
        const filenames = [];
        for (const file of files) {
          filenames.push(file.originalname);
        }
        return reply.status(200).send({ filenames });
      } catch (err) {
        console.log(err);
        return reply.status(500).send({});
      }
    },
  );
};
exports.default = routes;
//# sourceMappingURL=index.js.map
