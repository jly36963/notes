exports.plugin = {
  name: 'static-file-server',
  register: async (server, options) => {
    // @route -- GET /
    // @desc -- static file server
    // @access -- public

    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          redirectToSlash: true,
          index: true,
        },
      },
    });
  },
};
