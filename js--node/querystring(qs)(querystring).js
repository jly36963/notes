// querystring & qs

const qs = require('qs');
const querystring = require('querystring');

// object to stringify

const person = {
  name: 'Landon Y',
  skills: [
    'JavaScript',
    'Python',
    'Golang'
  ]
}

// -----------
// querystring
// -----------

// encode

const encodeQS = (obj) => {
  let queryString = querystring.stringify(obj);
  queryString = queryString.replace(/%20/g, "+")
  return queryString;
}

// decode

const decodeQS = (string) => {
  const obj = querystring.parse(string);
  return obj;
}

const encodedQS = encodeQS(person)
const decodedQS = decodeQS(encodedQS)

console.log('encodedQS', encodedQS)
console.log('decodedQS', decodedQS)

// -----------
// qs
// -----------

const encodeQS2 = (obj) => {
  let queryString = qs.stringify(obj);
  queryString = queryString.replace(/%20/g, "+")
  return queryString;
}

const decodeQS2 = (string) => {
  const obj = qs.parse(string);
  return obj;
}

const encodedQS2 = encodeQS2(person)
const decodedQS2 = decodeQS2(encodedQS2)

console.log('encodedQS2', encodedQS2)
console.log('decodedQS2', decodedQS2)