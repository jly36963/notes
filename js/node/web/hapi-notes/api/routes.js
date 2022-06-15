// imports
const Joi = require('@hapi/joi');

exports.plugin = {
  name: 'routes',
  register: async (server, options) => {
    console.log('Adding routes');

    // @route -- GET /api/
    // @desc -- return 'Hello World'
    // @access -- public

    server.route({
      method: 'GET', // http method (can be a single method, array of methods, or '*')
      path: '/api/', // path (allows for parameters) ('/users/${userId}') ('/users/${userId?}')
      handler: (request, h) => {
        return { data: 'Hello World!', error: null };
      },
    });

    // @route -- GET /api/home
    // @desc -- redirect to /
    // @access -- public

    server.route({
      method: 'GET',
      path: '/api/home',
      handler: (request, h) => {
        return h.redirect('/api/'); // redirect
      },
    });

    // @route -- POST /api/greet
    // @desc -- return greeting using payload
    // @access -- public

    server.route({
      method: 'POST',
      path: '/api/greet',
      handler: (request, h) => {
        const { name } = request.payload; // access request body (JSON or plain text)
        const greeting = name ? `Hello, ${name}!` : 'Hello there!';
        return { data: greeting, error: null };
      },
      options: {
        validate: {
          payload: Joi.object({
            name: Joi.string().min(2).max(30).required(),
          }),
        },
      },
    });

    // @route -- GET /api/user/
    // @desc -- return associated user based on id in params
    // @access -- public

    server.route({
      method: 'GET',
      path: '/api/user/{id}',
      handler: (request, h) => {
        const id = request.params.id;
        try {
          const user = { name: 'Kakashi', id }; // pretend db data
          return { data: user, error: null };
        } catch (err) {
          return { data: null, error: err.message };
        }
      },
      options: {
        validate: {
          params: Joi.object({
            id: Joi.string().required(), // Joi.string().guid()
          }),
        },
      },
    });

    // @route -- GET /api/store/search
    // @desc -- return query object
    // @access -- public

    server.route({
      method: 'GET',
      path: '/api/store/search',
      handler: (request, h) => {
        const query = request.query; // query params
        return { data: query, error: null };
      },
      options: {
        validate: {
          query: Joi.object({
            k: Joi.string().required(),
          }),
        },
      },
    });

    console.log('Routes added');
  },
};
