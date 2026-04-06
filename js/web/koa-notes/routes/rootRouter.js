// imports
const Router = require('@koa/router');
// middleware
const send = require('koa-send');
// instantiate router
const router = new Router({ prefix: '/api' });

// ---------
// routes
// ---------

// @route -- GET /api/hello
// @desc -- return 'hello world'
// @access -- public

// logger() -- returns function to be used as logger middleware

router.get('/hello', (ctx) => {
  ctx.body = { data: 'Hello world!', error: null };
});

// @route -- POST /api/greet
// @desc -- take name and return greeting
// @access -- public

router.post('/greet', (ctx) => {
  try {
    const { user } = ctx.request.body; // pull user object from request body
    const { name } = user; // get name from user
    const greeting = `Hello there, ${name}!`; // create greeting
    ctx.body = { data: greeting, error: null };
  } catch (err) {
    ctx.body = { data: null, error: err.message };
  }
});

// @route -- GET /api/user/:id
// @desc -- take id and return associated user object (from pretend database)
// @access -- public

router.get('/user/:id', (ctx) => {
  const { id } = ctx.params; // get id from params (query string)
  try {
    const user = { id, name: 'Kakashi' }; // pretend db response
    ctx.body = { data: user, error: null }; // response body
  } catch (err) {
    ctx.body = { data: null, error: err.message };
  }
});

// @route -- GET /api/store/search
// @desc -- use query and return it
// @access -- public

router.get('/store/search', (ctx) => {
  ctx.log.info('/api/store/search has recieved a request');
  const { query } = ctx.request; // parse query
  try {
    ctx.body = { data: query, error: null }; // response body
  } catch (err) {
    ctx.body = { data: null, error: err.message };
  }
});

// @route -- GET /api/store/search
// @desc -- use query and return it
// @access -- public

router.get('/get-file', async (ctx) => {
  const fp = './package.json';
  await send(ctx, fp);
});

module.exports = router;
