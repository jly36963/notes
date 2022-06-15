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
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
const fastify_1 = __importDefault(require('fastify'));
const pino_1 = __importDefault(require('pino'));
const app = fastify_1.default({
  logger: pino_1.default({ prettyPrint: true }),
});
const start = async (app) => {
  const routers = ['/api', '/api/user', '/api/file/fm', '/api/file/multer'];
  await (async () => {
    for (const route of routers) {
      console.log(`Adding router plugin to application: "${route}"`);
      const { default: router } = await Promise.resolve().then(() =>
        __importStar(require(`./routes/${route}`)),
      );
      app.register(router, { prefix: route });
    }
  })();
  app.get('*', (request, response) => {
    const fp = path_1.default.join(__dirname, './client/build/index.html');
    const stream = fs_1.default.createReadStream(fp);
    response.type('text/html').send(stream);
  });
  try {
    const port = process.env.PORT || 5000;
    await app.listen(port);
    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err.message);
    process.exit(1);
  }
};
start(app);
//# sourceMappingURL=server.js.map
