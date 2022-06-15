// imports
import Router from '@koa/router';
// middleware
import auth from '../../middleware/auth';
// instantiate router
const router = new Router({ prefix: '/api' });
// file middleware
import koaMulter from '@koa/multer';
const koaUpload = koaMulter();
// file middleware (express)
import c2k from 'koa-connect';
import multer from 'multer';
const upload = multer();

// ---------
// routes
// ---------

// @route -- GET /api
// @desc -- return 200 OK
// @access -- public

router.get('/', (ctx) => {
  ctx.status = 200;
  ctx.body = {};
});

// @route -- GET /api/hello
// @desc -- return 'hello world'
// @access -- protected

router.get('/hello', auth, (ctx) => {
  ctx.status = 200;
  ctx.body = { message: 'Hello world!' };
});

// @route -- POST /api/greet
// @desc -- take name (body) and return greeting
// @access -- protected

router.post('/greet', auth, (ctx) => {
  try {
    const { name } = ctx.request.body;
    const greeting = `Hello there, ${name}!`; // create greeting
    ctx.status = 200;
    ctx.body = { greeting };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: 'Error while processing request' };
  }
});

// @route -- GET /api/user/:id
// @desc -- get user from id (params)
// @access -- public

router.get('/user/:id', (ctx) => {
  const { id } = ctx.params;
  try {
    // *** db fetch logic here ***
    const user = { id, firstName: 'Kakashi', lastName: 'Hatake' }; // pretend db response
    ctx.status = 200;
    ctx.body = { user };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: 'Error while fetching user' };
  }
});

// @route -- POST /api/user/create
// @desc -- create user and return db response
// @access -- public

interface NewUser {
  firstName: string;
  lastName: string;
}

router.post('/user/create', (ctx) => {
  try {
    const { firstName, lastName }: NewUser = ctx.request.body;
    // *** db insert logic here ***
    const user = { id: 1, firstName, lastName }; // pretend db response
    ctx.status = 200;
    ctx.body = { user };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: 'Error while processing request' };
  }
});

// @route -- GET /api/store/search
// @desc -- use query and return it
// @access -- public

router.get('/store/search', (ctx) => {
  const { query } = ctx;
  try {
    ctx.status = 200;
    ctx.body = { query };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: 'Error while processing request' };
  }
});

// @route -- GET /api/file/single-express
// @desc -- get file (koa-connect + multer) (express style middleware)
// @access -- public

router.post('/file/single-express', c2k(upload.single('file')), (ctx) => {
  try {
    const { file }: any = ctx.req;
    const filename: string = file.originalname;
    ctx.status = 200;
    ctx.body = { filename };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: 'Error while processing file.' };
  }
});

// @route -- GET /api/file/single
// @desc -- get file (@koa/multer)
// @access -- public

router.post('/file/single', koaUpload.single('file'), (ctx) => {
  try {
    const { file }: any = ctx;
    const filename: string = file.originalname;
    ctx.status = 200;
    ctx.body = { filename };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: 'Error while processing file.' };
  }
});

// @route -- GET /api/file/fields
// @desc -- get files (@koa/multer)
// @access -- public

router.post(
  '/file/fields',
  koaUpload.fields([{ name: 'files', maxCount: 5 }]),
  (ctx) => {
    try {
      const { files }: any = ctx;
      const filenames: Array<string> = [];
      for (const field in files) {
        files[field].forEach((file: koaMulter.File) =>
          filenames.push(file.originalname),
        ); // fieldname, originalname, buffer
      }
      ctx.status = 200;
      ctx.body = { filenames };
    } catch (err) {
      console.log(err);
      ctx.status = 500;
      ctx.body = { message: 'Error while processing file.' };
    }
  },
);

export default router;
