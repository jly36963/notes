const qs = require('qs');

const main = () => {
  const person = {
    name: 'Landon Y',
    skills: [
      'JavaScript',
      'Python',
      'Golang',
      'Rust'
    ]
  }

  const encodedQS = encodeQS(person)
  const decodedQS = decodeQS(encodedQS)

  console.log({ encodedQS, decodedQS })
}

main()

function encodeQS(obj) {
  let queryString = qs.stringify(obj);
  queryString = queryString.replace(/%20/g, "+")
  return queryString;
}

function decodeQS(string) {
  const obj = qs.parse(string);
  return obj;
}