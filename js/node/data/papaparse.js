// ---------------
// papaparse
// ---------------

// install 
  // npm i --save papaparse

// docs
  // https://www.papaparse.com/docs

// nodejs
  // if using in node, use fs to read file (utf8 encoding)

const papa = require('papaparse');
const fs = require('fs');

(async () => {
  // read csv
  const csv = fs.readFileSync('iris.csv', 'utf8');
  // parse csv
  const parsedCsv = await papa.parse(csv, {
    delimiter: ",",
    worker: "true",
    encoding: 'utf8',
    header: "true", // true -- array of objects (header as keys), false -- multi-dimensional array
  })
  // get data
  const irisData = parsedCsv.data;
  console.log(irisData);
})()