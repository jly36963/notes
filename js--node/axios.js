// ------------
// axios
// ------------

// install
`
npm i --save axios
`

// ts typings (for intellisense / autocomplete)
`
const axios = require('axios').default;
`

// ------------
// get (express example)
// ------------

// commonJS import
const axios = require('axios');
const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
  // get id from params
  const { id } = req.params;
  // set url
  const domain = process.env.IN_DOCKER ? 'service-name' : 'localhost'
  const url = `http://${domain}:8080/api/get-user/${id}`
  try {
    // make request
    const apiResponse = await axios.get(url);
    // handle response
    const { error, data: user } = apiResponse.data;
    if (error) return res.status(500).json({ data: null, error })
    return res.json({ data: user, error: null });
  } catch(err) {
    return res.status(500).json({ data: null, error: err.message })
  }
})


// ------------
// alias methods (get, post, etc)
// ------------

// methods available
  // get, post, put, patch, delete, head, options

module.exports = async () => {
  const url = 'http://some-domain:8080/api/some/endpoint/'
  const getResponse = axios.get(url);
  const postResponse = axios.post(url, { id: 3 });
  console.log(
    'getResponse',
    getResponse,
    'postResponse',
    postResponse,
  );
  return;
}

// ------------
// axios api
// ------------

module.exports = async () => {
  try {
    const apiResponse = await axios({
      method: 'post',
      url: 'http://some-domain:8080/api/some/endpoint/',
      data: {
        id: 3
      }
    })
    console.log('apiResponse keys', Object.keys(apiResponse));
    console.log('apiResponse.data', apiResponse.data);
  } catch (err) {
    console.log(err.message);
  }
}

// ------------
// stream
// ------------

module.exports = async () => {
  try {
    const apiResponse = await axios({
      method: 'get',
      url: 'http://bit.ly/2mTM3nY',
      responseType: 'stream'
    })
    // create stream
    apiResponse.data.pipe(fs.createWriteStream('picture.jpg'))
  } catch (err) {
    console.log(err.message);
  }
}

// ------------
// response schema 
// ------------

const responseSchema = {
  // `data` is the response that was provided by the server
  data: {},
  // `status` is the HTTP status code from the server response
  status: 200,
  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',
  // `headers` the HTTP headers that the server responded with
  // All header names are lower cased and can be accessed using the bracket notation.
  // Example: `response.headers['content-type']`
  headers: {},
  // `config` is the config that was provided to `axios` for the request
  config: {},
  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance in the browser
  request: {}
}

// ------------
// axios config 
// ------------

// url -- the server URL that will be used for the request
// method -- the request method to be used when making the request
// baseURL -- baseURL will be prepended to 'url' unless 'url' is absolute
  // baseURL can be set for an instance of axios
// transformRequest -- change request data before it is sent. (headers object can also be changed)
  // supported methods: 'PUT', 'POST', PATCH', 'DELETE'
  // last function in array must return string, buffer, arraybuffer, formdata, or stream
// transformResponse -- change response data before then/catch.
// headers -- custom headers to be sent
// params -- url parameters to be sent with the request. (uses plain object)
// paramsSerializer -- optional function in charge of serializing params (qs)
// data -- data to be sent as request body
  // only applicable to 'PUT', 'POST', 'PATCH'
// timeout -- ms before request times out (request will be aborted)
// withCredentials -- indicates whether or not cross-site Access-Control requests should be made using creds.
// adapter -- ???
// auth -- overwrites 'Authorization' header, supplies credentials. 
  // indicates that HTTP basic should be used.
  // for bearer tokens (and such) use 'Authorization' custom header instead.
// responseType -- indicates type of data that the server will respond with
  // options: 'arraybuffer', 'document', 'json', 'text', 'stream' (default: 'json')
// responseEncoding -- encoding to use for decoding responses
  // ignored for client-side requests and responseType: stream
// xsrfCookieName -- the name of the cookie to use as a value for xsrf token
// xsrfHeaderName -- the name of the http header that carries the xsrf token value
// onUploadProgress -- allows handling of progress events for uploads (browser only)
// onDownloadProgress -- allows handling of progress events for downloads (browser only)
// maxContentLength -- defines the max size of the http response content in bytes allowed
// maxBodyLength -- (Node only option) defines the max size of the http request content in bytes allowed
// validateStatus -- resolve/reject the promise for a given HTTP response status code
  // function that returns true or false
  // promise always resolved if 'validateStatus' is set to null or undefined
// maxRedirects -- defines the maximum number of redirects to follow in node.js.
// socketPath -- defines a UNIX socket to be used in node.js 
  // ie: 'var/run/docker.sock' sends requests to docker daemon
  // only 'socketPath' or 'proxy' can be specified (sockerPath is used if both provided)
// httpAgent / httpsAgent -- define a custom agent (node.js). allow for options like 'keepAlive'
// proxy -- define the hostname/port of the proxy server
// cancelToken -- specifies a cancel token that can be used to cancel the request
// decompress -- indicates whether or not the response body should be decompressed automatically.
  // nodejs only
  // if set to 'true', will remove the 'content-encoding' header from the (decompressed) response objects


const config = {
  url: '/user',
  method: 'get', // default
  baseURL: 'https://some-domain.com/api/',
  transformRequest: [
    (data, headers) => {
      return data; // transform and return data
    }
  ],
  transformResponse: [
    (data) => {
      return data; // transform and return data
    }
  ],
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  params: {
    ID: 12345
  },
  paramsSerializer: (params) => {
    return Qs.stringify(params, { arrayFormat: 'brackets' })
  },
  data: {
    firstName: 'Fred'
  },
  timeout: 1000, // default is `0` (no timeout)
  withCredentials: false, // default
  adapter: (config) => {
    /* ... */
  },
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },
  responseType: 'json', // default
  responseEncoding: 'utf8', // default
  xsrfCookieName: 'XSRF-TOKEN', // default
  xsrfHeaderName: 'X-XSRF-TOKEN', // default
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
  maxContentLength: 2000,
  maxBodyLength: 2000,
  validateStatus: (status) => {
    return status >= 200 && status < 300; // default
  },
  maxRedirects: 5, // default
  socketPath: null, // default
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },
  cancelToken: new CancelToken((cancel) => {
    // something
  }),
  decompress: true // default
}

// ------------
// config defaults
// ------------

// https://github.com/axios/axios#config-defaults

// ------------
// interceptors
// ------------

// https://github.com/axios/axios#interceptors

// ------------
// handling errors
// ------------

// https://github.com/axios/axios#handling-errors

// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




