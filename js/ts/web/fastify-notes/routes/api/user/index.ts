// imports
import auth from '../../../middleware/auth';

const routes = async (app, options) => {
  // @route -- GET /api/user/:id
  // @desc -- get user using id (params)
  // @access -- protected

  app.get('/:id', { preHandler: [auth] }, async (request, reply) => {
    try {
      const { id } = request.params;
      // *** db fetch logic here ***
      const user = { id, firstName: 'Kakashi', lastName: 'Hatake' }; // pretend db response
      return reply.status(200).send({ user });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({});
    }
  });

  // @route -- POST /api/user/create
  // @desc -- create user and return db response
  // @access -- public

  interface NewUser {
    firstName: string;
    lastName: string;
  }

  app.post('/create', async (request, reply) => {
    try {
      const { firstName, lastName }: NewUser = request.body;
      // *** db insert logic here ***
      const user = { id: 1, firstName, lastName }; // pretend db response
      return reply.status(200).send({ user });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({});
    }
  });
};

export default routes;
