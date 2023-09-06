import axios from 'axios'
import { pick } from 'lodash-es'

const processResponse = (response) => pick(response, ['status', 'data'])

const main = async () => {
  // Get
  const getResult = await axios.get("https://jsonplaceholder.typicode.com/users/1").then(processResponse)
  
  // Get (params)
  const getWithParamsResult = await axios.get(
    "https://jsonplaceholder.typicode.com/users",
    { params: { limit: 5, offset: 10 }}
  ).then(processResponse)

  // Get (headers)
  const getWithHeadersResult = await axios.get(
    "https://jsonplaceholder.typicode.com/users/1", { 
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Token": "55DF6FCF66DB349E42272C11CD49F701EEF64FD7F842DA431C4CD252211AFD66"
      }
    }
  ).then(processResponse)

  // Post
  const postResult = await axios.post(
    "https://jsonplaceholder.typicode.com/users", 
    { 'name': 'Hiruzen Sarutobi' }
  ).then(processResponse)

  // Config example
  const configResult = await axios({
    method: 'POST',
    url: "https://jsonplaceholder.typicode.com/users",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Token": "55DF6FCF66DB349E42272C11CD49F701EEF64FD7F842DA431C4CD252211AFD66"
    },
    data: { 'name': 'Hiruzen Sarutobi' },
  }).then(processResponse)

  // Results
  console.log({
    getResult,
    getWithParamsResult,
    getWithHeadersResult,
    postResult,
    configResult,
  })
}

main()