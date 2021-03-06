// ------------
// ml
// ------------

// install
  // npm i --save ml
  
// install (separately)
  // npm i --save ml-pca

// docs
  // https://github.com/mljs/ml
  // https://www.npmjs.com/package/ml

// ------------
// load data
// ------------

// imports
const { DataFrame } = require('dataframe-js');
const path = require('path');

// helper functions
const mapValues = (df, obj) => {
  let dfNew = df.slice();
  Object.keys(obj).forEach(k => {
    dfNew = dfNew.replace(k, obj[k])
  })
  return dfNew;
}

const trainTestSplit = ({ df, inputCols, outputCols, testSize }) => {
  // df -- dataframe, inputCols -- array, outputCols -- array, testSize -- float
  if (testSize > 1 || testSize < 0) throw new Error('testSize must be equal to or between 0 and 1')
  if (!Array.isArray(inputCols) || inputCols.length < 1) throw new Error('inputCols must be an array of length >= 1.')
  if (!Array.isArray(outputCols) || outputCols.length !== 1) throw new Error('outputCols must be an array of length 1.')
  const trainSize = 1 - testSize;
  const [train, test] = df.bisect(trainSize);
  const X_train = train.select(...inputCols);
  const y_train = train.select(...outputCols);
  const X_test = test.select(...inputCols);
  const y_test = test.select(...outputCols)
  const result = { X_train, y_train, X_test, y_test };
  return result;
}

const flatten = (arr) => [].concat.apply([], arr);

// entry point
(async () => {
  try {
    // csv
    const csvFilePath = path.join(__dirname, 'iris.csv')
    const header = true;
    let df = await DataFrame.fromCSV(csvFilePath, header);
    df = df.castAll([Number, Number, Number, Number, String])
    const inputCols = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width']
    const outputCols = ['species']
    // convert values to classes (int)
    df = mapValues(df, {
      'Iris-setosa': 0,
      'Iris-versicolor': 1,
      'Iris-virginica': 2
    })
    // train test split
    const { X_train, y_train, X_test, y_test } = trainTestSplit({
      df: df,
      inputCols,
      outputCols,
      testSize: .25
    });

    const X = df.select(...inputCols).slice()

    // *** DO STUFF HERE ***

  } catch (err) {
    console.log(err);
  }

})()

// ------------
// simple linear regression
// ------------

// install -- npm i --save ml-regression-simple-linear
// docs -- https://github.com/mljs/regression-simple-linear

const SimpleLinearRegression = require('ml-regression-simple-linear');

const data = {
  x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  y: [2.1, 3.9, 5.7, 8.3, 10.0, 12.3, 13.8, 16.0, 18.5, 20.0]
}
const regression = new SimpleLinearRegression(data.x, data.y);

console.log('regression.slope', regression.slope)
console.log('regression.intercept', regression.intercept)
console.log('regression.coefficients', regression.coefficients)
console.log('regression.predict(3)', regression.predict(3))
console.log('regression.computeX(4.0)', regression.computeX(4.0))
console.log('regression.score(data.x, data.y)', regression.score(data.x, data.y))

// export to json
const jsonLR = regression.toJSON();
const loadedLR = SimpleLinearRegression.load(jsonLR)
console.log('loadedLR.predict(5)', loadedLR.predict(5))

// ------------
// polynomial regression
// ------------

// install -- npm i --save ml-regression-polynomial
// docs -- https://github.com/mljs/regression-polynomial
const PolynomialRegression = require('ml-regression-polynomial');

const data = {
  x: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
  y: [25.2, 16.3, 9.1, 4.2, 1.0, 0.1, 1.2, 4.3, 9.5, 16.3, 25.3],
  degree: 5 // maximum degree of polynomial
}
const regression = new PolynomialRegression(data.x, data.y, data.degree);

console.log('regression.coefficients', regression.coefficients) // sorted by degree, asc
console.log('regression.predict(3)', regression.predict(3))
console.log('regression.score(data.x, data.y)', regression.score(data.x, data.y))
console.log('regression.toString(3)', regression.toString(3)) // human readable version

// export to json
const jsonPR = regression.toJSON();
const loadedPR = PolynomialRegression.load(jsonPR)
console.log('loadedPR.predict(5)', loadedPR.predict(5))

// ------------
// multivariate linear regression
// ------------

// *** CHANGE TO CONTINUOUS OUTPUT VARIABLE ***

// install -- npm i --save ml-regression-multivariate-linear
// docs -- https://github.com/mljs/regression-multivariate-linear

const MLR = require('ml-regression-multivariate-linear');

const mlr = new MLR(X_train.toArray(), y_train.toArray());

console.log('mlr.predict(X_test.toArray()[0])', mlr.predict(X_test.toArray()[0]))
// console.log('mlr.score(X_test.toArray(), y_test.toArray())', mlr.score(X_test.toArray(), y_test.toArray()))

// export to json
const jsonMLR = mlr.toJSON();
const loadedMLR = MLR.load(jsonMLR)
console.log('loadedMLR.predict(X_test.toArray()[0])', loadedMLR.predict(X_test.toArray()[0]))

// ------------
// robust polynomial regression (supervised)
// ------------

// *** NOT WORKING WELL, UNEXPECTED BEHAVIOR ***

// install -- npm i --save ml-regression-robust-polynomial
// docs -- https://github.com/mljs/regression-robust-polynomial

const RobustPolynomialRegression = require('ml-regression-robust-polynomial');

const data = {
  x: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
  y: [25.2, 16.3, 9.1, 4.2, 1.0, 0.1, 1.2, 4.3, 9.5, 16.3, 25.3],
  degree: 2 // degree of polynomial
}

const rpr = new RobustPolynomialRegression(data.x, data.y, data.degree);
rpr.predict(3);
console.log('rpr.predict(3)', rpr.predict(3))
console.log('rpr.score(data.x, data.y)', rpr.score(data.x, data.y))

// export to json
const jsonRPR = rpr.toJSON();
const loadedRPR = RobustPolynomialRegression.load(jsonRPR)
console.log('loadedRPR.predict(5)', loadedRPR.predict(5))

// ------------
// confusion matrix
// ------------

// install -- npm i --save ml-confusion-matrix
// docs -- https://github.com/mljs/confusion-matrix

const ConfusionMatrix = require('ml-confusion-matrix');

const trueLabels = [0, 1, 0, 1, 1, 0];
const predictedLabels = [1, 1, 1, 1, 0, 0];

// The order of the arguments are important !!!
const CM2 = ConfusionMatrix.fromLabels(trueLabels, predictedLabels);
console.log(CM2.getAccuracy()); // 0.5
console.log(CM2.getMatrix()); 
console.log(CM2.getTrueCount()); // correct predictions
console.log(CM2.getFalseCount()); // wrong predictions

// ------------
// knn (supervised)
// ------------

// install -- npm i --save ml-knn
// docs -- https://github.com/mljs/knn

const KNN = require('ml-knn');

const knn = new KNN(X_train.toArray(), y_train.toArray());
console.log('knn.predict(X_test.toArray())', knn.predict(X_test.toArray()));

// json (loaded model is messed up)
const jsonKNN = knn.toJSON();
const loadedKNN = KNN.load(jsonKNN)
console.log('loadedKNN.predict(X_test.toArray()[0]', loadedKNN.predict(X_test.toArray()))

// ------------
// naive bayes (supervised)
// ------------

// install -- npm install --save ml-naivebayes
// docs -- https://github.com/mljs/naive-bayes

// naive bayes
  // bernouli -- binary input data
  // multinomial -- discrete input data
  // gaussian -- normal distribution, continuous input data

const { GaussianNB, MultinomialNB } = require('ml-naivebayes');

const modelNB = new GaussianNB();
modelNB.train(X_train.toArray(), y_train.toArray());
console.log('modelNB.predict(X_test);', modelNB.predict(X_test.toArray()));

// ------------
// decision tree classifier (supervised)
// ------------

// install -- npm i --save ml-cart
// docs -- https://github.com/mljs/decision-tree-cart

// ------------
// random forest classifier (supervised)
// ------------

// install -- npm i --save ml-random-forest
// docs -- https://github.com/mljs/random-forest

// ------------
// pca (unsupervised)
// ------------

// install -- npm i --save ml-pca
// docs -- https://github.com/mljs/pca

// import
const { PCA } = require('ml-pca');
// pca
const pca = new PCA(X.toArray());
console.log(pca.getExplainedVariance()) // returns proportion of variance for each component (array)

// ------------
// hclust -- hierarchical clustering algorithm (unsupervised)
// ------------

// install -- npm i --save ml-hclust
// docs -- https://github.com/mljs/hclust

// currently, only agnes is implemented

// agnes -- agglomerative nesting 
  // continuously merge nodes with least dissimilarity)
// diana -- divisive analysis 
  // start with one cluster and recursively split higher level clusters to build dendrogram
// birch -- balanced iterative reducing and clustering using hierarchies 
  // incrementally construct a clustering feature tree (a hierarchical data structure for multiphase clustering)
// cure -- clustering using representatives

const { agnes } = require('ml-hclust');

const tree = agnes(X.toArray(), {})
const n = 3; // groups
tree.group(n) // returns cluster object { children, height, size, index, isLeaf }


// ------------
// k-means (unsupervised)
// ------------

// install -- npm i --save ml-kmeans
// docs -- https://mljs.github.io/kmeans/

// kmeans
  // KMeansResult: Cluster identifier for each data dot and centroids with the following fields: 
    // clusters -- array of indexes for the clusters
    // centroids -- array with the resulting centroids
    // iterations -- number of iterations it took to converge


const { kmeans } = require('ml-kmeans');
const n = 3; // clusters
const result = kmeans(X.toArray(), n, {}) 


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



