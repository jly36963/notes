import { isNil } from "lodash-es";
import type { Dictionary } from "../types/index.ts";

// ---
// Constants
// ---

const BASE_URL = "https://graphqlzero.almansi.me/api";
// const BASE_URL = "https://graphqlplaceholder.vercel.app/graphql"; // userById, Int!

// ---
// Graphql helper
// ---

interface GraphqlSuccess<T = unknown> {
  data: T;
  errors: null;
}
interface GraphqlError {
  errors: Array<{ message: string }>;
}
type GraphqlResult<T = unknown> = GraphqlSuccess<T> | GraphqlError;

async function runGql<T = unknown>(
  token: string,
  query: string,
  variables: Dictionary<unknown>,
): Promise<T> {
  const headers: Dictionary<string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authentication: `Bearer ${token}`,
  };
  const body = JSON.stringify({ query, variables });
  const response = await fetch(BASE_URL, { method: "POST", headers, body });
  await raiseForStatusDebug(response);
  const result: GraphqlResult<T> = await response.json();
  checkGraphqlErrors(result);
  return result.data;
}

async function raiseForStatusDebug(response: Response) {
  const status = response.status;
  if (status >= 400) {
    const text = await response.text();
    const msg = `Error during graphql fetch.\n${status}\n${text}`;
    throw new Error(msg);
  }
}

interface ErrorWithContext {
  message: string;
  errors?: Array<unknown>;
}

/** Assert that the graphql result did not contain errors */
function checkGraphqlErrors<T = unknown>(
  result: GraphqlResult<T>,
): asserts result is GraphqlSuccess<T> {
  if (!isNil(result.errors)) {
    const err: ErrorWithContext = new Error("Error while running query");
    err.errors = result.errors;
    throw err;
  }
}

// ---
// Providers
// ---

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserResponse {
  user: User;
}

const USER_QUERY = `
query ($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
`;

async function getUser(token: string, id: number): Promise<User> {
  const result = await runGql<UserResponse>(token, USER_QUERY, { id });
  return result.user;
}

// ---
// Main
// ---

async function main() {
  const token = "my-super-secret-token";
  const userId = 1;
  const user = await getUser(token, userId);
  console.log("user");
  console.log(user);
}

main();
