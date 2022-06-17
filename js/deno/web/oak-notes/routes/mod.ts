import { delay, oak } from "../deps.ts";

const router = new oak.Router({ prefix: "/api" });

/** Basic get handler */
router.get("/", (c) => {
  c.response.status = 200;
});

/** Basic post/body handler */
router.post("/greet", async (c) => {
  try {
    const body = c.request.body();
    if (body.type !== "json") {
      c.response.status = 400;
      return;
    }
    const name = (await body.value)?.name;
    if (!name) {
      c.response.status = 400;
      return;
    }
    const greeting = `Hello there, ${name}!`;
    c.response.body = greeting;
  } catch (err) {
    console.log(err);
    c.response.status = 500;
  }
});

/** Basic get with route params */
router.get("/user/:id", async (c) => {
  const id = c.params?.id;
  try {
    await delay(50);
    const user = { id, name: "Kakashi" };
    c.response.body = user;
  } catch (err) {
    console.log(err);
    c.response.status = 500;
  }
});

/** Basic get with query params */
router.get("/timeline/posts", (c) => {
  const query = oak.helpers.getQuery(c);
  try {
    c.response.body = query;
  } catch (err) {
    console.log(err);
    c.response.status = 500;
  }
});

export default router;
