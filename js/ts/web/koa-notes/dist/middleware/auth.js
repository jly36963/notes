'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const auth = (ctx, next) => {
  const { token } = ctx.headers;
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: 'Improper auth' };
  } else {
    next();
  }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map
