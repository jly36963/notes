// ------------
// koa
// ------------

// install
`
npm i --save koa koa-router koa-bodyparser koa-json
`

// common addon modules
  // koa router -- simple routing module (koa has no built in router)
  // koa body parser -- parse incoming data
  // koa EJS templating -- template engine to display views and layout

// ------------
// hello world
// ------------

const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(5000); // http.createServer(app.callback()).listen(5000);

// ------------
// hello world (cascading middleware)
// ------------

const Koa = require('koa');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(5000); // http.createServer(app.callback()).listen(5000);

// ------------
// hello world (https)
// ------------

const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

http.createServer(app.callback()).listen(5000);
https.createServer(app.callback()).listen(5001);

// ------------
// hello world (with router) (api) (simple)
// ------------

// imports
const Koa = require('koa'); // koa framework
const KoaRouter = require('koa-router'); // koa router
const json = require('koa-json'); // prettier json middleware
const bodyParser = require('koa-bodyparser') // body parser middleware
// app, router, middleware
const app = new Koa(); // create app
const router = new KoaRouter(); // create router
app
  .use(router.routes()).use(router.allowedMethods()) // use router middleware
  .use(json()) // use json middleware
  .use(bodyParser()); // use body parser middleware
// routes
router.get('/', ctx => {
  ctx.body = { data: 'Hello world!', error: null }
})
// port
const port = process.env.PORT || 5000;
// start server
app.listen(
  port, // port to serve on
  () => console.log(`Server running on port ${port}`) // callback
);

// ------------
// context (setting)
// ------------

app.context.db = db();

app.use(async ctx => {
  console.log(ctx.db);
});

// ------------
// error handling
// ------------

app.on('error', err => {
  log.error('server error', err)
});

// ------------
// context (request / response)
// ------------

app.use(async ctx => {
  ctx; // is the Context
  ctx.request; // is a Koa Request
  ctx.response; // is a Koa Response
});

// ------------
// context API
// ------------

// ctx

ctx.req // nodejs request object
ctx.res // nodejs response object
ctx.request // koa request object
ctx.response // koa response object
ctx.state // recommended namespace (ie -- ctx.state.user = await User.find(id))
ctx.throw() // helper method to throw error

// request

ctx.request.header // get header object (can be set)
ctx.request.method // get method (can be set)
ctx.request.url // get request url (can be set)
ctx.request.origin // get origin of URL (protocol and host)
ctx.request.href // get full request URL (protocol, host, url)
ctx.request.path // request pathname (can be set)
ctx.request.querystring // raw query string ('?' removed) (can be set)
ctx.request.search // raw query string (with '?')
ctx.request.query // parsed query-string (nested parsing not supported) (can be set)
ctx.request.host // get hostname (host name + port)
ctx.request.hostname // get hostname (hostname only)
ctx.request.type // get content type (ie -- 'image/png')
ctx.request.charset // get charset (ie -- 'utf-8')
ctx.request.ip // remote address (supports X-Forwarded-For when app.proxy is true)

// response

ctx.response.header // response header
ctx.response.status // response status (default is 404, unlike Nodejs which defaults to 200)
ctx.response.status = 200; // set response status
ctx.response.body // get response body (can be set) (use string, json-stringified object/array, null, buffer, stream)
ctx.response.set(field, value) // set header field/value
ctx.response.set(fieldsObject) // set header (using object)
ctx.response.append(field, value) // append additional header field/value
ctx.response.remove(field) // remove field from header
ctx.response.type // get content type (can be set) (ie -- ctx.response.type = 'image/png')
ctx.response.attachment([fn], [options]) // set content disposition to 'attachment' & prompt download on client

// context throw error

ctx.throw(400);
ctx.throw(400, 'name required');
ctx.throw(400, 'name required', { user: user });

// `ctx.throw(400, 'name required')` is equivalent to:

const err = new Error('name required');
err.status = 400;
err.expose = true;
throw err;


// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



// ------------
// 
// ------------



