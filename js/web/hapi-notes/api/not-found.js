exports.plugin = {
  name: 'not-found',
  register: async (server, options) => {
    // @route -- GET /{any*}
    // @desc -- return 404 error
    // @access -- public

    server.route({
      method: '*',
      path: '/{any*}',
      handler: (request, h) => {
        return {
          statusCode: 404,
          error: 'Not Found',
          message: 'Not Found',
        };
      },
    });
  },
};
