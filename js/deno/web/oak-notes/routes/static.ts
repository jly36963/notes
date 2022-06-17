import { oak } from "../deps.ts";

const root = Deno.cwd() + "/static/";

const router = new oak.Router({ prefix: "/static" });

/** Basic get handler that returns files */
router.get("/:path", async (c) => {
  const path = c.params?.path;
  await c.send({ path, root });
});

export default router;
