const auth = (request, reply, done) => {
  const { token } = request.headers;
  if (!token) {
    return reply.status(401).send({});
  } else {
    done();
  }
};

export default auth;
