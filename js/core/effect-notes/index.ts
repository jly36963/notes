import { Console, Duration, Effect } from "effect";
import { range } from "lodash-es";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { match, P } from "ts-pattern";

// ---
// Main
// ---

async function main() {
  const scenarios = [
    { title: "simpleLog", effect: simpleLog },
    { title: "simpleComprehension", effect: simpleComprehension },
    { title: "sleep", effect: sleep },
    { title: "parallelMap", effect: parallelMap },
    { title: "simpleTask", effect: simpleTask },
    { title: "simpleBlockingAsync", effect: simpleBlockingAsync },
    { title: "simpleHttpGet", effect: simpleHttpGet },
    { title: "simpleHttpPost", effect: simpleHttpPost },
  ];
  for (const { title, effect } of scenarios) {
    printSectionTitle(title);
    await Effect.runPromise(effect);
  }
}

// ---
// Utils
// ---

function printSectionTitle(title: string) {
  console.log(`\n${title.toUpperCase()}\n`);
}

// ---
// Examples
// ---

const simpleLog = Effect.gen(function* () {
  yield* Console.log("Hello, World!");
});

const simpleComprehension = Effect.gen(function* () {
  const a = 2;
  const b = 3;
  const result = yield* Effect.succeed(a * b);
  yield* Console.log(`result ${result}`);
});

const sleep = Effect.gen(function* () {
  yield* Console.log("Hello");
  yield* Effect.sleep(Duration.millis(10));
  yield* Console.log("World!");
});

const square = (n: number) => Effect.succeed(n ** 2).pipe(Effect.delay(Duration.millis(10)));

const parallelMap = Effect.gen(function* () {
  const nums = range(1, 10);
  const results = yield* Effect.forEach(nums, square, { concurrency: 4 });
  yield* Console.log(`results: ${results}`);
});

const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  match<[number, number]>([a, b])
    .with([P._, 0], () => Effect.fail(new Error("division by zero")))
    .with([P.number, P.number], ([a, b]) => Effect.succeed(a / b))
    .exhaustive();

const simpleTask = Effect.gen(function* () {
  const n1 = 1.0;
  const n2 = 2.0;
  const n3 = 0.0;
  const res1 = yield* divide(n1, n2);
  const res2 = yield* divide(n3, n1);
  const res3 = yield* divide(n1, n3).pipe((r) => Effect.orElse(r, () => Effect.succeed(0.0)));
  const results = yield* Effect.succeed([
    `n1: ${n1}`,
    `n2: ${n2}`,
    `n3: ${n3}`,
    `res1: ${res1}`,
    `res2: ${res2}`,
    `res3: ${res3}`,
  ]);
  yield* Effect.forEach(results, (r) => Console.log(r));
});

const readFile = (p: string) => Effect.tryPromise(() => fs.readFile(p, { encoding: "utf-8" }));
const writeFile = (p: string, contents: string) =>
  Effect.tryPromise(() => fs.writeFile(p, contents, { encoding: "utf-8" }));
const copyFile = (src: string, dst: string) => Effect.tryPromise(() => fs.copyFile(src, dst));
const moveFile = (src: string, dst: string) => Effect.tryPromise(() => fs.rename(src, dst));
const deleteFile = (p: string) => Effect.tryPromise(() => fs.unlink(p));
const removeDirectory = (p: string) => Effect.tryPromise(() => fs.rmdir(p));

const simpleBlockingAsync = Effect.gen(function* () {
  // Directories
  const dataDir = "data";
  const inputDir = path.join(dataDir, "input");
  const outputDir = path.join(dataDir, "output");

  // Files
  const filename1 = path.join(inputDir, "file1.txt");
  const filename2 = path.join(outputDir, "file2.txt");
  const filename3 = path.join(outputDir, "file3.txt");

  // Actions
  yield* Effect.tryPromise(() => fs.mkdir(inputDir, { recursive: true }));
  yield* Effect.tryPromise(() => fs.mkdir(outputDir, { recursive: true }));
  const contents1 = "Change is impossible in this fog of ignorance.";
  yield* writeFile(filename1, contents1);
  yield* copyFile(filename1, filename2);
  const contents2 = yield* readFile(filename2);
  yield* moveFile(filename2, filename3);
  const contents3 = yield* readFile(filename3);
  yield* deleteFile(filename3);
  yield* deleteFile(filename1);
  yield* removeDirectory(outputDir);
  yield* removeDirectory(inputDir);
  yield* removeDirectory(dataDir);

  // Results
  const results = [
    `dataDir: ${dataDir}`,
    `inputDir: ${inputDir}`,
    `outputDir: ${outputDir}`,
    `filename1: ${filename1}`,
    `filename2: ${filename2}`,
    `filename3: ${filename3}`,
    `contents1: ${contents1}`,
    `contents2: ${contents2}`,
    `contents3: ${contents3}`,
  ];

  yield* Effect.forEach(results, (v) => Console.log(v));
});

const raiseForStatusDebug = (res: Response) =>
  Effect.gen(function* () {
    const status = res.status;
    if (status >= 400) {
      const body = yield* Effect.tryPromise(() => res.text());
      const message = `Request failed:\nstatus: ${status}\nbody: ${body}`;
      return yield* Effect.fail(new Error(message));
    }
    return res;
  });

interface NewUser {
  id: number;
  name: string;
}
interface User {
  id: number;
  name: string;
  phone: string;
  address: Address;
}
interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}

const getUser = (id: number) =>
  Effect.gen(function* () {
    const url = `https://jsonplaceholder.typicode.com/users/${id}`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const res = yield* Effect.flatMap(
      Effect.tryPromise(() => fetch(url, { headers })),
      raiseForStatusDebug,
    );
    const user = yield* Effect.tryPromise(() => res.json());
    return user as User;
  });

const simpleHttpGet = Effect.gen(function* () {
  const user = yield* getUser(1);
  const msg = yield* Effect.try(() => `user ${JSON.stringify(user)}`);
  yield* Console.log(msg);
});

const createUser = (newUser: NewUser) =>
  Effect.gen(function* () {
    const url = "https://jsonplaceholder.typicode.com/users";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = yield* Effect.try(() => JSON.stringify(newUser));
    const res = yield* Effect.tryPromise(() => fetch(url, { method: "POST", headers, body }));
    const res1 = yield* raiseForStatusDebug(res);
    const created = yield* Effect.tryPromise(() => res1.json());
    return created as NewUser;
  });

const simpleHttpPost = Effect.gen(function* () {
  const userInput = { id: 1, name: "Hiruzen Sarutobi" };
  const user = yield* createUser(userInput);
  const msg = yield* Effect.try(() => `user ${JSON.stringify(user)}`);
  yield* Console.log(msg);
});

// ---
// Main
// ---

main();
