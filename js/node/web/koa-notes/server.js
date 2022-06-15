// imports
const path = require('path');
const Koa = require('koa'); // koa framework
// middleware imports
const Router = require('@koa/router'); // router for koa
const json = require('koa-json'); // prettier json
const bodyParser = require('koa-bodyparser'); // middleware -- parse request body
const logger = require('koa-pino-logger'); // log request/response
const serve = require('koa-static'); // serve static files
// instantiate app
const app = new Koa(); // create app
// instantiate middleware
const router = new Router(); // create router
const rootRouter = require('./routes/rootRouter'); // import router from module
// use middleware
app
  .use(serve(path.join(__dirname, 'static'))) // serve static files
  .use(serve(path.join(__dirname, 'client/build'))) // serve static files
  .use(json())
  .use(bodyParser())
  .use(logger({ prettyPrint: true })) // use koa-pino-logger
  .use(router.routes())
  .use(router.allowedMethods()) // use routes from router in this file
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods()); // use routes from router in module
// port
const port = process.env.PORT || 5000;
// start server
app.listen(
  port, // port to serve on
  () => console.log(`Server running on port ${port}`), // callback
);
