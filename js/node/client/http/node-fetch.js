// ---------
// node-fetch
// ---------

// install
// npm i --save node-fetch

// top level await
// use node version >= 14.3.0 (I think)
// add to package json -> "type": "module"

// ---
// imports
// ---

import fetch from "node-fetch";

// ---
// basic usage
// ---

// errors
// errors should be handled with a try/catch block (async/await) or then/catch (promises)

// response
// headers -- response headers (Headers)
// redirected -- was it redirected? (boolean)
// status -- http status (number)
// statusText -- associated status text (ie: 200 -> OK) (string)
// ok -- res.status >= 200 && res.status < 300 (boolean)
// type --
// url --

// body (methods that take response stream, read it to completion, then do something)
// arrayBuffer() -- returns promise -> ArrayBuffer
// blob() -- returns promise -> Blob
// formData() -- returns promise -> FormData
// json() -- parse body text as json
// text() -- returns promise -> USVString (text)

const fetchJsonGet = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(res.statusText);
  const json = await response.json();
  return json;
};

// user
try {
  const fetchJsonGetResult = await fetchJsonGet(
    "https://jsonplaceholder.typicode.com/users/1"
  );
  console.log("fetchJsonGetResult", fetchJsonGetResult);
} catch (err) {
  console.log(err);
}

// ---
// with Promise.all
// ---

// uses `fetchJsonGet` from above

const urls = [1, 2, 3].map(
  (id) => `https://jsonplaceholder.typicode.com/users/${id}`
);

try {
  const users = [];
  await Promise.all(
    urls.map(async (url) => {
      const user = await fetchJsonGet(url);
      users.push(user);
    })
  );
  console.log("fetchJsonGetPromiseAllResult", users);
} catch (err) {
  console.log(err);
}

// ---
// with config (method, headers, body)
// ---

const fetchJsonPost = async (url, config) => {
  const response = await fetch(url, config);
  if (!response.ok) throw new Error(res.statusText);
  const json = await response.json();
  return json;
};

try {
  const fetchJsonPostResult = await fetchJsonPost(
    "https://jsonplaceholder.typicode.com/users",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Token: "aadc987ba98c7d6abc98b6",
      },
      body: JSON.stringify({
        name: "Hiruzen Sarutobi",
      }),
    }
  );
  console.log("fetchJsonPostResult", fetchJsonPostResult);
} catch (err) {
  console.log(err);
}
