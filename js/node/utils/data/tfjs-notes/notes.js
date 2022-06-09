// ---
// tensorflow (tfjs)
// ---

// install (front-end)
// npm i --save @tensorflow/tfjs
// install (back-end)
// npm i --save @tensorflow/tfjs-node
// npm i --save @tensorflow/tfjs-node-gpu

// docs (tfjs)
// https://js.tensorflow.org/api/2.0.0/

// docs (dataframe-js)
// https://gmousse.gitbooks.io/dataframe-js/

// python tensorflow examples
// https://github.com/jly36963/jupyter/blob/master/py--tf(2)/tensorflow-basics(v2).ipynb

const { DataFrame } = require('dataframe-js');
const tf = require('@tensorflow/tfjs-node');
const math = require('mathjs');
const path = require('path');
const fs = require('fs');

// ---
// tensors
// ---

const basicTensors = () => {
  // tf.print
  tf.tensor([1, 2, 3, 4]) // class
  tf.tensor([1, 2, 3, 4]).print() // print data

  // tensors (params: values, shape?, dtype?))
  tf.tensor([1, 2, 3, 4]); // 1d tensor
  tf.tensor([[1, 2], [3, 4]]); // 2d tensor
  tf.tensor([1, 2, 3, 4, 5, 6, 7, 8], [2, 4]) // specify shape (2 rows, 4 columns)
  // tensor with dimensions specified (up to 6d)
  tf.tensor1d([1, 2, 3, 4])
  tf.tensor2d([[1, 2], [3, 4]])
  tf.tensor3d([[[1, 2], [3, 4]]])
  // scalar (value, dtype?)
  tf.scalar(3.14)
  // fill (shape, value)
  tf.fill([4, 4], 0) // 4 x 4 tensor of zeros
  // linspace (params: start, stop, num)
  tf.linspace(1, 10, 10) // evenly spaced
  // ones (params: shape, dtype?)
  tf.ones([2, 2]) // 2 x 2 tensor of ones
  // range (params: start, stop, step?, dtype?)
  tf.range(0, 9, 2) // count from start to (before) stop by step
  // zeros (params: shape, dtype?)
  tf.zeros([2, 2]) // 2x2 tensor of zeros
}

// ---
// sequential (model)
// ---

const basicSequentialModel = () => {
  // create model
  let model

  // create sequential model (v1)
  model = tf.sequential({
    layers: [
      tf.layers.dense({ units: 8, inputShape: [4] }), // input layer
      tf.layers.activation({ activation: 'relu' }), // activation function
      tf.layers.dropout({ rate: 0.2 }), // dropout layer
      tf.layers.dense({ units: 8 }), // hidden layer
      tf.layers.activation({ activation: 'relu' }), // activation function
      tf.layers.dropout({ rate: 0.2 }), // dropout layer
      tf.layers.dense({ units: 8 }), // output layer
      tf.layers.activation({ activation: 'softmax' }), // final activation function
    ]
  });
  console.log(model.summary());
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

  // create sequential model (v2)
  model = tf.sequential();
  model.add(tf.layers.dense({ units: 8, inputShape: [4] })); // input layer
  model.add(tf.layers.activation({ activation: 'relu' })); // activation function
  model.add(tf.layers.dropout({ rate: 0.2 })) // dropout layer
  model.add(tf.layers.dense({ units: 8 })); // hidden layer
  model.add(tf.layers.activation({ activation: 'relu' })); // activation function
  model.add(tf.layers.dropout({ rate: 0.2 })) // dropout layer
  model.add(tf.layers.dense({ units: 8 })); // output layer
  model.add(tf.layers.activation({ activation: 'softmax' })); // final activation function
  console.log(model.summary());
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

  // train-test split
  const X_train = null;
  const y_train = null;
  const X_test = null;
  const y_test = null;
  // train model
  await model.fit(X_train, y_train)
  // evaluate
  await model.evaluate(X_test, y_test);
  // predict
  model.predict(X_test[0], y_test[0])
}

// ---
// helper functions
// ---

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

const getStatsForScaler = (df, featureColumns) => {
  const featureStats = {};
  featureColumns.forEach(c => {
    const values = flatten(df.select(c).toArray()); // get column values
    const std = math.std(values); // get std
    const mean = math.mean(values); // get mean
    featureStats[c] = { std, mean }; // save stats needed to scale future data 
  })
  return featureStats;
}

const standardScaler = (df, featureStats) => {
  let newDF = df.slice();
  Object.keys(featureStats).forEach(c => {
    const { mean, std } = featureStats[c];
    newDF = newDF.withColumn(c, row => (row.get(c) - mean) / std); // scaled data = (value - mean) / std
  })
  return newDF;
}

// ---
// iris example (no scaler)
// ---

const basicIrisExample = async () => {
  try {

    // --------
    // data
    // --------

    const csvFilePath = path.join(__dirname, 'iris.csv')
    const header = true;
    let df = await DataFrame.fromCSV(csvFilePath, header);
    df = df.castAll([Number, Number, Number, Number, String])
    // convert values to classes (int)
    df = mapValues(df, {
      'Iris-setosa': 0,
      'Iris-versicolor': 1,
      'Iris-virginica': 2
    })
    // train test split
    const { X_train, y_train, X_test, y_test } = trainTestSplit({
      df: df,
      inputCols: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
      outputCols: ['species'],
      testSize: .25
    });

    // determine dimensions
    const numOfInputs = X_train
      .listColumns()
      .length; // num of columns
    const numOfOutputs = y_train
      .distinct('species')
      .toDict()
      .species
      .length; // unique output classes

    // create tensors from dataframes
    const tensors = {
      X_train: tf.tensor(X_train.toArray()),
      y_train: tf.oneHot(flatten(y_train.toArray()), numOfOutputs),
      X_test: tf.tensor(X_test.toArray()),
      y_test: tf.oneHot(flatten(y_test.toArray()), numOfOutputs),
    }

    // --------
    // create model
    // --------

    const modelsDirPath = path.join(__dirname, 'models') // models folder
    const irisModelDirPath = path.join(modelsDirPath, 'iris') // iris model folder
    const irisModelFilePath = path.join(irisModelDirPath, 'model.json') // iris model file
    const tfModelSaveScheme = `file://${irisModelDirPath}`; // scheme used by
    const tfModelLoadScheme = `file://${irisModelFilePath}`; // scheme used by

    if (!fs.existsSync(irisModelDirPath)) {
      fs.mkdirSync(irisModelDirPath, { recursive: true }); // make 'models' dir if DNE
    }

    let model; // try to import model or create new one
    let modelAlreadyTrained; // is the model already trained, or a new one
    const shouldModelContinueTraining = true; // if loading a model, should training continue
    const epochs = 200; // how many epochs to train

    try {
      // attempt to load model
      model = await tf.loadLayersModel(tfModelLoadScheme);
      console.log('USING SAVED MODEL')
      modelAlreadyTrained = true;
    } catch {
      modelAlreadyTrained = false;
    }

    console.log('modelAlreadyTrained', modelAlreadyTrained)

    if (!modelAlreadyTrained) {
      console.log('CREATING NEW MODEL')
      // set up new model
      model = tf.sequential({
        layers: [
          tf.layers.dense({ units: 8, inputShape: [numOfInputs] }), // input layer
          tf.layers.activation({ activation: 'relu' }), // activation function
          tf.layers.dropout({ rate: 0.2 }), // dropout layer
          tf.layers.dense({ units: 8 }), // hidden layer
          tf.layers.activation({ activation: 'relu' }), // activation function
          tf.layers.dropout({ rate: 0.2 }), // dropout layer
          tf.layers.dense({ units: numOfOutputs }), // output layer (units === number of classes)
          tf.layers.activation({ activation: 'softmax' }), // final activation function
        ]
      });
    }

    // get summary
    console.log(model.summary());
    // compile model
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

    // --------
    // train
    // --------

    if (!modelAlreadyTrained) {
      // train model (INITIAL)
      console.log('INITIAL TRAINING OF MODEL')
      for (let i = 0; i < epochs; i++) {
        await model.fit(tensors.X_train, tensors.y_train)
      }
    }
    if (modelAlreadyTrained && shouldModelContinueTraining && epochs) {
      // train model (CONTINUATION)
      console.log('CONTINUING TRAINING OF MODEL')
      for (let i = 0; i < epochs; i++) {
        await model.fit(tensors.X_train, tensors.y_train)
      }
    }

    // --------
    // test
    // --------

    // evaluate
    const result = model.evaluate(tensors.X_test, tensors.y_test);
    result.print();
    // predict
    model.predict(tf.tensor([[5.1, 3.8, 1.5, 0.3]])).print() // [1, 0, 0]

    // --------
    // save
    // --------

    await model.save(tfModelSaveScheme)
  } catch (err) {
    console.log(err.message);
  }

  // TODO
  // optimizers and step
  // confusion matrix

}

// ---
// iris (with standard scaler)
// ---


// entry point
const basicIrisExampleScaled = async () => {
  try {

    // --------
    // data
    // --------

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

    // standard scaler

    const X = df.select(...inputCols).slice()
    const featureStats = getStatsForScaler(X, inputCols);
    const X_train_scaled = standardScaler(X_train, featureStats)
    const X_test_scaled = standardScaler(X_test, featureStats)

    // determine dimensions
    const numOfInputs = X_train
      .listColumns()
      .length; // num of columns
    const numOfOutputs = y_train
      .distinct('species')
      .toDict()
      .species
      .length; // unique output classes

    // create tensors from dataframes
    const tensors = {
      X_train: tf.tensor(X_train_scaled.toArray()),
      y_train: tf.oneHot(flatten(y_train.toArray()), numOfOutputs),
      X_test: tf.tensor(X_test_scaled.toArray()),
      y_test: tf.oneHot(flatten(y_test.toArray()), numOfOutputs),
    }

    // --------
    // create model
    // --------

    const modelsDirPath = path.join(__dirname, 'models') // models folder
    const irisModelDirPath = path.join(modelsDirPath, 'iris') // iris model folder
    const irisModelFilePath = path.join(irisModelDirPath, 'model.json') // iris model file
    const tfModelSaveScheme = `file://${irisModelDirPath}`; // scheme used by
    const tfModelLoadScheme = `file://${irisModelFilePath}`; // scheme used by

    if (!fs.existsSync(irisModelDirPath)) {
      fs.mkdirSync(irisModelDirPath, { recursive: true }); // make 'models' dir if DNE
    }

    let model; // try to import model or create new one
    let modelAlreadyTrained; // is the model already trained, or a new one
    const shouldModelContinueTraining = true; // if loading a model, should training continue
    const epochs = 100; // how many epochs to train

    try {
      // attempt to load model
      model = await tf.loadLayersModel(tfModelLoadScheme);
      console.log('USING SAVED MODEL')
      modelAlreadyTrained = true;
    } catch {
      modelAlreadyTrained = false;
    }

    console.log('modelAlreadyTrained', modelAlreadyTrained)

    if (!modelAlreadyTrained) {
      console.log('CREATING NEW MODEL')
      // set up new model
      model = tf.sequential({
        layers: [
          tf.layers.dense({ units: 8, inputShape: [numOfInputs] }), // input layer
          tf.layers.activation({ activation: 'relu' }), // activation function
          tf.layers.dropout({ rate: 0.2 }), // dropout layer
          tf.layers.dense({ units: 8 }), // hidden layer
          tf.layers.activation({ activation: 'relu' }), // activation function
          tf.layers.dropout({ rate: 0.2 }), // dropout layer
          tf.layers.dense({ units: numOfOutputs }), // output layer (units === number of classes)
          tf.layers.activation({ activation: 'softmax' }), // final activation function
        ]
      });
    }

    // get summary
    console.log(model.summary());
    // compile model
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

    // --------
    // train
    // --------

    if (!modelAlreadyTrained) {
      // train model (INITIAL)
      console.log('INITIAL TRAINING OF MODEL')
      for (let i = 0; i < epochs; i++) {
        await model.fit(tensors.X_train, tensors.y_train)
      }
    }
    if (modelAlreadyTrained && shouldModelContinueTraining && epochs) {
      // train model (CONTINUATION)
      console.log('CONTINUING TRAINING OF MODEL')
      for (let i = 0; i < epochs; i++) {
        await model.fit(tensors.X_train, tensors.y_train)
      }
    }

    // --------
    // test
    // --------

    // evaluate
    const result = model.evaluate(tensors.X_test, tensors.y_test);
    result.print();
    // predict
    const newData = new DataFrame(
      [[5.1, 3.8, 1.5, 0.3]], // data
      inputCols // cols
    )
    const newDataScaled = standardScaler(newData, featureStats)
    model.predict(tf.tensor(newDataScaled.toArray())).print() // [1, 0, 0]

    // --------
    // save
    // --------

    await model.save(tfModelSaveScheme)
  } catch (err) {
    console.log(err);
  }

  // TODO
  // optimizers and step
  // confusion matrix
}
