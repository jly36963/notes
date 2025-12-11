// ---
// Main
// ---

async function main() {
  printSectionTitle("basic retry example");
  await basicRetryExample();
}

// ---
// Utils
// ---

function printSectionTitle(title) {
  console.log("\n" + title.toUpperCase() + "\n");
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

function randomFloat(max) {
  return Math.random() * max;
}

function getBackoff(retryCount, backoffFactor) {
  const jitter = randomFloat(1000);
  const backoff = backoffFactor * Math.pow(2, retryCount);
  return backoff + jitter;
}

const RETRY_OPTION_DEFAULTS = {
  // How many retries
  retries: 3,
  // Exponential backoff factor (ms)
  backoffFactor: 1000,
  // Failure statuses to retry on
  statusForceList: [],
  // Allowed methods to retry on (idempotent)
  allowedMethods: ["GET", "PUT", "HEAD", "DELETE", "OPTION", "TRACE"],
  // Retry on timeout error
  timeout: true,
};

/** Fetch with retry (NOTE: will run at least once, will only retry on approved status/method) */
async function fetchWithRetry(url, options, retryOptions) {
  retryOptions = {
    ...RETRY_OPTION_DEFAULTS,
    ...(retryOptions ?? {}),
  };

  const { retries, backoffFactor, statusForceList, allowedMethods, timeout } =
    retryOptions;

  const method = options.method?.toUpperCase() ?? "GET";

  let response;
  let retryCount = 1;
  do {
    if (retryCount > 0) {
      await sleep(getBackoff(retryCount, backoffFactor));
    }
    retryCount++;
    try {
      response = await fetch(url, options);
      if (!response.ok) {
        // Exit early unless BOTH method and status are allowed
        if (
          !statusForceList.includes(response.status) ||
          !allowedMethods.includes(method)
        ) {
          return response;
        }
        // Continue to next retry
        continue;
      }
      return response;
    } catch (err) {
      if (
        retryCount < retries &&
        timeout &&
        err instanceof DOMException &&
        err?.name === "TimeoutError"
      ) {
        continue;
      } else {
        throw err;
      }
    }
  } while (retryCount < retries);
  return response;
}

/** Pretend to create user */
async function createUser(userInput) {
  const result = await fetchWithRetry(
    "https://jsonplaceholder.typicode.com/users",
    {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(userInput),
      signal: AbortSignal.timeout(10_000),
    },
    {
      retries: 3,
      allowedMethods: ["POST"],
    }
  );
  if (!result.ok) {
    const contents = await result.text();
    const message = `An error has occured (${result.status}): ${contents}`;
    throw new Error(message);
  }
  return result.json();
}

// ---
// Examples
// ---

async function basicRetryExample() {
  const userInput = {
    name: "Kakashi Hatake",
    age: 27,
  };
  await createUser(userInput);
}

// ---
// Run
// ---

main();
