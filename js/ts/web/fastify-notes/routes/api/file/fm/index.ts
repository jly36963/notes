// imports
import auth from '../../../../middleware/auth';
// fastify-multipart
import fm from 'fastify-multipart';

const routes = async (app, options) => {
  // register plugins
  app.register(fm);

  // @route -- POST /api/file/fm/single
  // @desc -- get file (fm)
  // @access -- protected

  app.post('/single', { preHandler: [auth] }, async (request, reply) => {
    try {
      const { filename } = await request.file(); // file (stream), fieldname, filename, fields (non-file fields)
      return reply.status(200).send({ filename });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({});
    }
  });
};

export default routes;

// fastify-multipart
// https://github.com/fastify/fastify-multipart
// https://github.com/fastify/fastify-multipart/blob/master/examples/example.js
