'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const router_1 = __importDefault(require('@koa/router'));
const auth_1 = __importDefault(require('../../middleware/auth'));
const router = new router_1.default({ prefix: '/api' });
const multer_1 = __importDefault(require('@koa/multer'));
const koaUpload = multer_1.default();
const koa_connect_1 = __importDefault(require('koa-connect'));
const multer_2 = __importDefault(require('multer'));
const upload = multer_2.default();
router.get('/', (ctx) => {
  ctx.status = 200;
  ctx.body = {};
});
router.get('/hello', auth_1.default, (ctx) => {
  ctx.status = 200;
  ctx.body = { message: 'Hello world!' };
});
router.post('/greet', auth_1.default, (ctx) => {
  try {
    console.log(ctx.request.body);
    const { name } = ctx.request.body;
    const greeting = `Hello there, ${name}!`;
    ctx.status = 200;
    ctx.body = { greeting };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: 'Error while processing request' };
  }
});
router.get('/user/:id', (ctx) => {
  const { id } = ctx.params;
  try {
    const user = { id, firstName: 'Kakashi', lastName: 'Hatake' };
    ctx.status = 200;
    ctx.body = { user };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: 'Error while fetching user' };
  }
});
router.post('/user/create', (ctx) => {
  try {
    const { firstName, lastName } = ctx.request.body;
    const user = { id: 1, firstName, lastName };
    ctx.status = 200;
    ctx.body = { user };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: 'Error while processing request' };
  }
});
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
router.post(
  '/file/single-express',
  koa_connect_1.default(upload.single('file')),
  (ctx) => {
    try {
      const { file } = ctx.req;
      const filename = file.originalname;
      ctx.status = 200;
      ctx.body = { filename };
    } catch (err) {
      console.log(err);
      ctx.status = 500;
      ctx.body = { message: 'Error while processing file.' };
    }
  },
);
router.post('/file/single', koaUpload.single('file'), (ctx) => {
  try {
    const { file } = ctx;
    const filename = file.originalname;
    ctx.status = 200;
    ctx.body = { filename };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: 'Error while processing file.' };
  }
});
router.post(
  '/file/fields',
  koaUpload.fields([{ name: 'files', maxCount: 5 }]),
  (ctx) => {
    try {
      const { files } = ctx;
      const filenames = [];
      for (const field in files) {
        files[field].forEach((file) => filenames.push(file.originalname));
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
exports.default = router;
//# sourceMappingURL=index.js.map
