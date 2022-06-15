// nodejs imports
import fs from 'fs';
import path from 'path';
// package imports
import fastify from 'fastify';
import pino from 'pino';

// instantiate app
const app = fastify({
  logger: pino({ prettyPrint: true }),
});

const start = async (app: any) => {
  // api routes
  const routers: Array<string> = [
    '/api',
    '/api/user',
    '/api/file/fm',
    '/api/file/multer',
  ];
  await (async () => {
    for (const route of routers) {
      console.log(`Adding router plugin to application: "${route}"`);
      const { default: router } = await import(`./routes/${route}`);
      app.register(router, { prefix: route });
    }
  })();

  // spa route
  app.get('*', (request, response) => {
    const fp: string = path.join(__dirname, './client/build/index.html');
    const stream: fs.ReadStream = fs.createReadStream(fp);
    response.type('text/html').send(stream);
  });

  // listen
  try {
    const port: string | number = process.env.PORT || 5000;
    await app.listen(port);
    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err.message);
    process.exit(1);
  }
};

start(app);

// typescript support
// https://github.com/fastify/fastify/blob/master/docs/TypeScript.md

// plugins
// await app.register(require('middie'));

// global middleware (if using 'middie')
// app.use(require('cors')())

// route level hooks
// https://www.fastify.io/docs/latest/Hooks/#route-level-hooks
// https://github.com/fastify/fastify/issues/740#issuecomment-585822431
