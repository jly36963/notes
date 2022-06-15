// imports
import auth from '../../../../middleware/auth';
import multer from 'fastify-multer';
const upload = multer();

const routes = async (app, options) => {
  // register plugins
  app.register(multer.contentParser);

  // @route -- POST /api/file/multer/single
  // @desc -- get file (multer)
  // @access -- protected

  app.post(
    '/single',
    { preHandler: [auth, upload.single('file')] },
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

  // @route -- POST /api/file/multer/single
  // @desc -- get multiple files (multer)
  // @access -- protected

  app.post(
    '/array',
    { preHandler: [auth, upload.array('files')] },
    async (request, reply) => {
      try {
        const { files } = request;
        const filenames: Array<string> = [];
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

export default routes;

// fastify-multipart
// https://github.com/fastify/fastify-multipart
// https://github.com/fastify/fastify-multipart/blob/master/examples/example.js
