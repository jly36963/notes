'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = __importDefault(require('path'));
const koa_1 = __importDefault(require('koa'));
const koa_json_1 = __importDefault(require('koa-json'));
const koa_bodyparser_1 = __importDefault(require('koa-bodyparser'));
const koa_pino_logger_1 = __importDefault(require('koa-pino-logger'));
const koa_static_1 = __importDefault(require('koa-static'));
const koa_send_1 = __importDefault(require('koa-send'));
const app = new koa_1.default();
const start = async (app) => {
  app
    .use(koa_static_1.default(path_1.default.join(__dirname, 'static')))
    .use(koa_json_1.default())
    .use(koa_bodyparser_1.default())
    .use(koa_pino_logger_1.default({ prettyPrint: true }));
  const routers = ['/api'];
  await (async () => {
    for (const route of routers) {
      console.log(`Adding router to application: "${route}"`);
      const { default: router } = await Promise.resolve().then(() =>
        __importStar(require(`./routes/${route}`)),
      );
      app.use(router.routes()).use(router.allowedMethods());
    }
  })();
  app.use(
    async (ctx) => await koa_send_1.default(ctx, './client/build/index.html'),
  );
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
};
start(app);
//# sourceMappingURL=server.js.map
