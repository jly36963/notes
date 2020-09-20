// ------------
// ejs template
// ------------

// imports
const Koa = require('koa'); // koa framework
const KoaRouter = require('koa-router'); // koa router
const json = require('koa-json'); // prettier json middleware
const path = require('path') // node fs module
const render = require('koa-ejs') // koa template engine

// app, router, middleware
const app = new Koa();
const router = new KoaRouter();
app.use(router.routes()).use(router.allowedMethods())
app.use(json());

// ejs template (render)
  // create './views/' directory
    // create 'layout.html'. This will wrap body components
    // create 'index.html'. This will be a body component
    // create 'about.html'. This will be a body component
  // create './views/partials/' directory
    // create '_navbar.html' partial. This can be used in a body component
render (app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false
})

// routes

router.get('/', async ctx => {
  await ctx.render('index') // html in './views/index.html'
})

router.get('/about', async ctx => {
  await ctx.render('about') // html in './views/about.html'
})

router.get('/greet', async ctx => {
  const mongodbResponse =  { 
    data: {
      firstName: 'Kakashi',
      lastName: "Hatake"
    }, 
    error: null 
  };
  if (mongodbResponse.error) {
    ctx.render(/* handle error, possibly render different template */)
  }
  const { firstName, lastName } = mongodbResponse.data;
  await ctx.render(
    'about', // html in './views/about.html'
    { firstName, lastName } // values to pass into template
  ) 
})

// port
const port = process.env.PORT || 5000;
// start server
app.listen(
  port, // port to serve on
  () => console.log(`Server running on port ${port}`) // callback
);
