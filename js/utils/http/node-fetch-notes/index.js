import fetch from 'node-fetch'

// ---
// Notes
// ---

// Errors: check response.status, throw if status is gte 400
// Handling response: json, text, blob, formData, arrayBuffer

// ---
// Example
// ---

const main = async () => {
  // Get
  const getResult = await (await fetch("https://jsonplaceholder.typicode.com/users/1")).json()
  
  // Get (params)
  const getWithParamsResult = await (await fetch(
    `https://jsonplaceholder.typicode.com/users?${new URLSearchParams({ limit: 5, offset: 10 })}`,
  )).json()

  // Get (headers)
  const getWithHeadersResult = await (await fetch(
    "https://jsonplaceholder.typicode.com/users/1", { 
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Token": "55DF6FCF66DB349E42272C11CD49F701EEF64FD7F842DA431C4CD252211AFD66"
      }
    }
  )).json()

  // Post
  const postResult = await (await fetch(
    "https://jsonplaceholder.typicode.com/users", 
    {
      method: "POST",
      body: JSON.stringify({ 'name': 'Hiruzen Sarutobi' }),
      headers: {'Content-Type': 'application/json'},
    }
  )).json()

  // Results
  console.log({
    getResult,
    getWithParamsResult,
    getWithHeadersResult,
    postResult,
  })
}

main()