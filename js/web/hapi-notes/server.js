// ------------
// hapi api example
// ------------

// library imports
const Hapi = require('@hapi/hapi');

// server initialization function
const init = async () => {
  // initialize server
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
  });
  // register plugins
  await server.register([
    // inert (static file server)
    { plugin: require('@hapi/inert'), options: {} },
    // api routes
    { plugin: require('./api/routes'), options: {} },
    // static file server route
    { plugin: require('./api/static'), options: {} },
    // not found
    { plugin: require('./api/not-found'), options: {} },
    // pino logger
    { plugin: require('hapi-pino'), options: { prettyPrint: true } },
  ]);

  // start server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};
// error handle
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
// initialize server
init();
