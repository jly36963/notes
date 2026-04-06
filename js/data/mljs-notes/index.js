const { mapValues, zipObject, flatten } = require('lodash')
const pl = require('nodejs-polars')
const SimpleLinearRegression = require('ml-regression-simple-linear');
const PolynomialRegression = require('ml-regression-polynomial');
const MLR = require('ml-regression-multivariate-linear');
const ConfusionMatrix = require('ml-confusion-matrix');
const KNN = require('ml-knn');
const { GaussianNB, MultinomialNB } = require('ml-naivebayes');
const { PCA } = require('ml-pca');
const { agnes } = require('ml-hclust');
const { kmeans } = require('ml-kmeans');
const { printSectionTitle, round, trainTestSplit, getRmse, mapArray } = require('./utils')


const basicLinearRegression = () => {
  // f(x) = 2x
  const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const y = [2.1, 3.9, 5.7, 8.3, 10.0, 12.3, 13.8, 16.0, 18.5, 20.0]
  const lr = new SimpleLinearRegression(x, y);

  const slope = round(lr.slope, 2)
  console.log('slope:', slope)

  const intercept = round(lr.intercept, 2)
  console.log('intercept:', intercept)

  const coefficients = lr.coefficients.map(n => round(n, 2)) // sorted by degree, asc
  console.log('coefficients:', coefficients)

  const prediction = round(lr.predict(3), 2)
  console.log('predict(3): ', prediction)

  const computedX = round(lr.computeX(4.0), 2)
  console.log('computeX(4.0):', computedX)

  const score = mapValues(lr.score(x, y), v => round(v, 2))
  console.log('regression.score(x, y):', score)

  // Export/import
  const jsonLR = lr.toJSON();
  const loadedLR = SimpleLinearRegression.load(jsonLR)

  const predictionFromLoaded = round(loadedLR.predict(5), 2)
  console.log('predict(5):', predictionFromLoaded)
}

const basicPolynomialRegression = () => {
  // f(x) = x^3
  const x = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
  const y = [-125.2, -64.3, -27.1, -8.2, -1.0, 0.0, 1.2, 8.3, 27.5, 64.3, 125.3]
  const degree = 3 // maximum degree of polynomial
  const pr = new PolynomialRegression(x, y, degree);

  const coefficients = pr.coefficients.map(n => round(n, 2)) // sorted by degree, asc
  console.log('coefficients:', coefficients)

  const prediction = round(pr.predict(3), 2)
  console.log('predict(3):', prediction)

  const score = mapValues(pr.score(x, y), v => round(v, 2))
  console.log('score(x, y):', score)

  const humanReadable = pr.toString(3) // human readable version (precision)
  console.log('toString(3):', humanReadable)

  // Export/import
  const jsonPR = pr.toJSON();
  const loadedPR = PolynomialRegression.load(jsonPR)

  const predictionFromLoaded = round(loadedPR.predict(5), 2)
  console.log('predict(5):', predictionFromLoaded)
}

const basicMultivariateLinearRegression = () => {
  const df = pl.readCSV('./data/usa-housing.csv')
  const columns = df.columns
  const inputCols = columns.filter(c => !['Price', 'Address'].includes(c))
  const outputCols = ['Price']

  // Split
  const { X_train, y_train, X_test, y_test } = trainTestSplit(df, inputCols, outputCols, .6)

  // Train
  const mlr = new MLR(X_train, y_train)

  // Test
  const predictions = X_test.map(inputs => mlr.predict(inputs))

  console.log('predicted:', flatten(predictions).slice(0, 5).map(n => round(n, 2)))
  console.log('actual', flatten(y_test).slice(0, 5).map(n => round(n, 2)))

  const rmse = getRmse(flatten(predictions), flatten(y_test))
  console.log('rmse:', round(rmse, 2))

  // Export/import
  const jsonMLR = mlr.toJSON();
  const loadedMLR = MLR.load(jsonMLR)

  const first = X_test[0].map(n => round(n, 1))
  const predicted = {
    ...zipObject(inputCols, first),
    'Price (expected)': round(loadedMLR.predict(first)[0], 1),
    'Price (actual)': round(y_test[0][0], 1)
  }
  console.log('prediction from loaded model', predicted)
}

const basicConfusionMatrix = () => {
  const actualLabels = [0, 1, 0, 1, 1, 0];
  const predictedLabels = [1, 1, 1, 1, 0, 0];

  // The order of the arguments are important !!!
  const CM2 = ConfusionMatrix.fromLabels(actualLabels, predictedLabels);
  console.log("actual:", actualLabels)
  console.log("predicted:", predictedLabels)
  console.log("accuracy:", CM2.getAccuracy()); // 0.5
  console.log("matrix:", CM2.getMatrix());
  console.log("true (correct) predictions:", CM2.getTrueCount()); // correct predictions
  console.log("false (wrong) predictions:", CM2.getFalseCount()); // wrong predictions
}

const basicKNN = () => {
  let df = pl.readCSV('./data/iris.csv')
  const columns = df.columns
  const inputCols = columns.filter(c => c !== 'species')
  const outputCols = ['species']

  /*
  // Convert categorical column
  const speciesMap = {
    'Setosa': 0,
    'Versicolor': 1,
    'Virginica': 2,
  }
  const mappedSpecies = mapArray(df.getColumn('species').toArray(), speciesMap)
  df = df.withColumn(pl.Series("species", mappedSpecies, pl.UInt8))
  */

  // Split
  const { X_train, y_train, X_test, y_test } = trainTestSplit(df, inputCols, outputCols, .6)

  // Train
  const knn = new KNN(X_train, y_train, { k: 3 });

  // Test
  const predictedLabels = flatten(knn.predict(X_test))
  const actualLabels = flatten(y_test)
  const CM2 = ConfusionMatrix.fromLabels(actualLabels, predictedLabels);
  console.log('knn.predict(X_test):');
  console.log("predictedLabels:", predictedLabels.slice(0, 10))
  console.log("actualLabels:", actualLabels.slice(0, 10))
  console.log("accuracy:", round(CM2.getAccuracy(), 2)); // 0.5
  console.log("matrix:", CM2.getMatrix());
  console.log("correct predictions:", CM2.getTrueCount()); // correct predictions
  console.log("wrong predictions:", CM2.getFalseCount()); // wrong predictions
}

// ---
// Naive bayes (supervised)
// ---

// naive bayes
// bernouli -- binary input data
// multinomial -- discrete input data
// gaussian -- normal distribution, continuous input data

// TODO

// ---
// Decision tree classifier (supervised)
// ---

// install -- npm i --save ml-cart
// docs -- https://github.com/mljs/decision-tree-cart

// TODO

// ---
// Random forest classifier (supervised)
// ---

// install -- npm i --save ml-random-forest
// docs -- https://github.com/mljs/random-forest

// TODO

// ---
// PCA (unsupervised)
// ---

// TODO

// ---
// hclust -- hierarchical clustering algorithm (unsupervised)
// ---

// currently, only agnes is implemented

// agnes -- agglomerative nesting 
// continuously merge nodes with least dissimilarity)
// diana -- divisive analysis 
// start with one cluster and recursively split higher level clusters to build dendrogram
// birch -- balanced iterative reducing and clustering using hierarchies 
// incrementally construct a clustering feature tree (a hierarchical data structure for multiphase clustering)
// cure -- clustering using representatives

const basicHclust = () => {
  const tree = agnes(X.toArray(), {})
  const n = 3; // groups
  tree.group(n) // returns cluster object { children, height, size, index, isLeaf }
}

// ---
// k-means (unsupervised)
// ---

// kmeans
// KMeansResult: Cluster identifier for each data dot and centroids with the following fields: 
// clusters -- array of indexes for the clusters
// centroids -- array with the resulting centroids
// iterations -- number of iterations it took to converge

// TODO

const main = async () => {
  printSectionTitle('basic linear regression')
  basicLinearRegression()

  printSectionTitle('basic polynomial regression')
  basicPolynomialRegression()

  printSectionTitle('basic multivariate linear regression')
  basicMultivariateLinearRegression()

  printSectionTitle('basic confusion matrix')
  basicConfusionMatrix()

  printSectionTitle('basic knn')
  basicKNN()
}

main()
