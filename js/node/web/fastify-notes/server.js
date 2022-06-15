const fastify = require('fastify');
const app = fastify({ logger: true });

(async (app) => {
  // plugins
  // await app.register(require('middie'));

  // middleware (if using 'middie')
  // app.use(require('cors')())

  // routes
  app.register(require('./routes/api/index'), { prefix: '/api' });

  // listen
  try {
    await app.listen(3000);
    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err.message);
    process.exit(1);
  }
})(app);
