# koa example

A simple koa app with several middlewares and example of basic usage.

## Setup

- `npm i`

## Startup (dev)

- `npm run dev`

## Startup (prod)

- `npm start`

### koa-static

```js
// app
const Koa = require('koa');
const app = new Koa();
// static
const root = 'client/build';
const opts = {};
app.use(require('koa-static')(root, opts));
```

### koa-router

```js
// imports
const Koa = require('koa');
const Router = require('koa-router');
// app and router
const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  // ctx.router available
  ctx.body = { data: 'Hello world!', error: null };
});

app.use(router.routes()).use(router.allowedMethods()); // use routes
```

### koa-send

```js
// imports
const Koa = require('koa'); // koa framework
// middleware imports
const Router = require('@koa/router'); // router for koa
// instantiate app
const app = new Koa(); // create app
// instantiate middleware
const router = new Router(); // create router
const send = require('koa-send');

app.use(router.routes()).use(router.allowedMethods());

router.get('/get-file', async (ctx) => {
  const fp = './package.json';
  await send(ctx, fp);
});
```

### koa-bodyparser

```js
//  imports
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
 // app and router
const app = new Koa();
const router = new Router();
// middlewrae
app
  .use(router.routes()).use(router.allowedMethods()); // use router
  .use(bodyParser()); // use bodyparser

router.post('/', ctx => {
  console.log(ctx.request.body); // parsed body
  ctx.body = ctx.request.body // send request body as response body
})
```

### koa-pino-logger

```js
//  imports
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-pino-logger')
 // app and router
const app = new Koa();
const router = new Router();
// middleware
app
  .use(bodyParser()); // use bodyparser
  .use(logger({ prettyPrint: true })) // pino logger (with 'pino-pretty')
  .use(router.routes()).use(router.allowedMethods()); // use router

router.post('/', ctx => {
  console.log(ctx.request.body); // parsed body
  ctx.body = ctx.request.body // send request body as response body
})
```

### koa-sslify

```sh
# generate pem
    # do this in ./ssl/
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```

```js
// imports
const fs = require('fs');
const path = require('path');
const Koa = require('koa'); // koa framework
const https = require('https'); // https
// middleware imports
const Router = require('koa-router'); // koa router
const json = require('koa-json'); // prettier json middleware
const bodyParser = require('koa-bodyparser'); // body parser middleware
const logger = require('koa-pino-logger'); // koa-pino-logger middleware
const { default: enforceHttps } = require('koa-sslify'); // factory with default options
// instantiate app
const app = new Koa(); // create app
// instantiate middleware
const router = new Router(); // create router
const rootRouter = require('./routes/rootRouter'); // import router from module
// use middleware
app
  .use(enforceHttps({ port: 5001 })) // redirect http (5000) to https (5001)
  .use(json())
  .use(bodyParser())
  // .use(logger({ prettyPrint: true })) // use koa-pino-logger
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

// https server config
const config = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')),
};

https.createServer(config, app.callback()).listen(5001);
```

### koa-multer

```js
const Koa = require('koa');
const Router = require('@koa/router');
const multer = require('@koa/multer');

const app = new Koa();
const router = new Router();
const upload = multer(); // note you can pass `multer` options here

// add a route for uploading multiple files
router.post(
  '/upload-multiple-files',
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'boop',
      maxCount: 2,
    },
  ]),
  (ctx) => {
    console.log('ctx.request.files', ctx.request.files);
    console.log('ctx.files', ctx.files);
    console.log('ctx.request.body', ctx.request.body);
    ctx.body = 'done';
  },
);

// add a route for uploading single files
router.post('/upload-single-file', upload.single('avatar'), (ctx) => {
  console.log('ctx.request.file', ctx.request.file);
  console.log('ctx.file', ctx.file);
  console.log('ctx.request.body', ctx.request.body);
  ctx.body = 'done';
});

// add the router to our app
app.use(router.routes());
app.use(router.allowedMethods());

// start the server
app.listen(5000);
```

### koa-joi-router

```js
const koa = require('koa');
const router = require('koa-joi-router');
const Joi = router.Joi;

const public = router();

public.get('/', async (ctx) => {
  ctx.body = 'hello joi-router!';
});

public.route({
  method: 'post',
  path: '/signup',
  validate: {
    body: {
      name: Joi.string().max(100),
      email: Joi.string().lowercase().email(),
      password: Joi.string().max(100),
      _csrf: Joi.string().token(),
    },
    type: 'form',
    output: {
      200: {
        body: {
          userId: Joi.string(),
          name: Joi.string(),
        },
      },
    },
  },
  handler: async (ctx) => {
    const user = await createUser(ctx.request.body);
    ctx.status = 201;
    ctx.body = user;
  },
});

const app = new koa();
app.use(public.middleware());
app.listen(3000);
```
