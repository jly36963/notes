import { oak } from "../deps.ts";

const addLogger = (app: oak.Application): void => {
  app.use(async (c, n) => {
    const start = Date.now();
    await n();
    const diff = Date.now() - start;
    console.log(
      `${c.request.method} | ${c.request.url.pathname} | ${c.response.status} | ${diff} ms`,
    );
  });
};

export default addLogger;
