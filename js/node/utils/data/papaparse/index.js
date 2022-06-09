// ---
// papaparse
// ---

// https://www.papaparse.com/docs

const papa = require('papaparse');
const fs = require('fs');

const main = async () => {
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
}

main()