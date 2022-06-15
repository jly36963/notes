// imports
import path from 'path'; // path util
import Koa from 'koa'; // koa framework
// middleware imports
import json from 'koa-json'; // prettier json
import bodyParser from 'koa-bodyparser'; // parse request body
import logger from 'koa-pino-logger'; // logger
import serve from 'koa-static'; // serve static files
import send from 'koa-send'; // file response
// instantiate app
const app = new Koa(); // create app

// server start function
const start = async (app: any) => {
  // add middleware
  app
    .use(serve(path.join(__dirname, 'static')))
    .use(json())
    .use(bodyParser())
    .use(logger({ prettyPrint: true }));
  // api routes
  const routers: string[] = ['/api'];
  await (async () => {
    for (const route of routers) {
      console.log(`Adding router to application: "${route}"`);
      const { default: router } = await import(`./routes/${route}`);
      app.use(router.routes()).use(router.allowedMethods());
    }
  })();
  // spa route
  app.use(
    async (ctx: Koa.Context) => await send(ctx, './client/build/index.html'),
  );
  // port
  const port: string | number = process.env.PORT || 5000;
  // start server
  app.listen(
    port, // port to serve on
    () => console.log(`Server running on port ${port}`), // callback
  );
};

// server start
start(app);
