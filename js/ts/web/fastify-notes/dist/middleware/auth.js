'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const auth = (request, reply, done) => {
  const { token } = request.headers;
  if (!token) {
    return reply.status(401).send({});
  } else {
    done();
  }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map
