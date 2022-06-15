import Koa from 'koa';

const auth = (ctx: Koa.Context, next: Koa.Next) => {
  const { token } = ctx.headers;
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: 'Improper auth' };
  } else {
    next();
  }
};

export default auth;
