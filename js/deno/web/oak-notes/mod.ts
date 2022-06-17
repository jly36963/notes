import { oak, posix } from "./deps.ts";
import addLogger from "./middleware/logger.ts";
import { getHttpsOptions } from "./tls/helpers.ts";

const main = async () => {
  // Instantiate app
  const app = new oak.Application();
  const router = new oak.Router();
  addLogger(app);
  app
    .use(router.routes())
    .use(router.allowedMethods());

  // Add routers
  const cwd = Deno.cwd();
  const routerPaths = [
    posix.join(cwd, "routes/mod.ts"),
    posix.join(cwd, "routes/static.ts"),
    // TODO: add more routers
  ];

  for (const path of routerPaths) {
    const { default: r }: { default: oak.Router } = await import(path);
    app.use(r.routes()).use(r.allowedMethods());
  }

  // Start app
  const port = parseInt(Deno.env.get("PORT") ?? "5000");

  app.addEventListener("listen", ({ hostname, port }) => {
    console.log(`Starting server at ${hostname}:${port}`);
  });

  await app.listen({
    port,
    ...getHttpsOptions(false),
  });
};

main();
