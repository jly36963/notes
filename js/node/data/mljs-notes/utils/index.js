const { zipObject, shuffle } = require("lodash");
const pl = require('nodejs-polars')

const printSectionTitle = (s) => console.log("\n" + s.toUpperCase() + "\n");

const round = (n, precision = 0) => {
  const x = 10 ** Math.max(precision, 0);
  return Math.round(n * x) / x;
};

const mapValues = (df, obj) => {
  let dfNew = df.slice();
  Object.keys(obj).forEach((k) => {
    dfNew = dfNew.replace(k, obj[k]);
  });
  return dfNew;
};

const _shuffleDf = (df) => {
  const rows = df.toRecords()
  const shuffled = shuffle(rows)
  return pl.DataFrame(shuffled)
}

const trainTestSplit = (df, inputCols, outputCols, trainSize) => {
  if (trainSize >= 1 || trainSize <= 0) {
    throw new Error("testSize must be between 0 and 1");
  }
  const lastIdx = df.height - 1;
  const splitIdx = Math.round((lastIdx) * trainSize);
  // const shuffled = df.sample({ frac: 1.0, seed: 100 });
  const shuffled = _shuffleDf(df)
  const train = shuffled.slice(0, splitIdx);
  const test = shuffled.slice(splitIdx, lastIdx);
  return {
    X_train: train.select(...inputCols).rows(), // Dataframe
    y_train: train.select(...outputCols).rows(), // Series
    X_test: test.select(...inputCols).rows(),
    y_test: test.select(...outputCols).rows(),
  };
};

const mapArray = (arr, m) => arr.map(v => Object.prototype.hasOwnProperty.call(m, v) ? m[v] : v)


// const trainTestSplit2 = ({ df, inputCols, outputCols, testSize }) => {
//   // df -- dataframe, inputCols -- array, outputCols -- array, testSize -- float
//   if (testSize > 1 || testSize < 0) throw new Error('testSize must be equal to or between 0 and 1')
//   if (!Array.isArray(inputCols) || inputCols.length < 1) throw new Error('inputCols must be an array of length >= 1.')
//   if (!Array.isArray(outputCols) || outputCols.length !== 1) throw new Error('outputCols must be an array of length 1.')
//   const trainSize = 1 - testSize;
//   const [train, test] = df.bisect(trainSize);
//   const X_train = train.select(...inputCols);
//   const y_train = train.select(...outputCols);
//   const X_test = test.select(...inputCols);
//   const y_test = test.select(...outputCols)
//   const result = { X_train, y_train, X_test, y_test };
//   return result;
// }

const getRmse = (predicted, actual) => {
  if (predicted.length !== actual.length) {
    throw new Error("Arrays predicted/actual should be equal in length");
  }
  const sumOfSquaredDiffs = Object.entries(zipObject(predicted, actual))
    .reduce((acc, [y, yHat]) => acc + Math.pow(y - yHat, 2), 0);

  console.log(sumOfSquaredDiffs)
  const rmse = Math.sqrt(sumOfSquaredDiffs / predicted.length);
  return rmse;
};

module.exports = {
  printSectionTitle,
  round,
  mapValues,
  trainTestSplit,
  getRmse,
  mapArray,
};
