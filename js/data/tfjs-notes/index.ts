import path from "node:path";
import { DataFrame } from "dataframe-js";
import ConfusionMatrix from "ml-confusion-matrix";

// ---
// Types
// ---

type Dict<T> = {
	[key: string]: T;
};

// ---
// Utils
// ---

function mapValues<T>(df: DataFrame, obj: Dict<T>): DataFrame {
	let dfNew = df.slice();
	Object.keys(obj).forEach((k) => {
		dfNew = dfNew.replace(k, obj[k]);
	});
	return dfNew;
}

const trainTestSplit = ({
	df,
	inputCols,
	outputCols,
	testSize,
}: {
	df: DataFrame;
	inputCols: Array<string>;
	outputCols: Array<string>;
	testSize: number;
}) => {
	// df -- dataframe, inputCols -- array, outputCols -- array, testSize -- float
	if (testSize > 1 || testSize < 0)
		throw new Error("testSize must be equal to or between 0 and 1");
	if (!Array.isArray(inputCols) || inputCols.length < 1)
		throw new Error("inputCols must be an array of length >= 1.");
	if (!Array.isArray(outputCols) || outputCols.length !== 1)
		throw new Error("outputCols must be an array of length 1.");
	const trainSize = 1 - testSize;
	const [train, test] = df.bisect(trainSize);
	const X_train = train.select(...inputCols);
	const y_train = train.select(...outputCols);
	const X_test = test.select(...inputCols);
	const y_test = test.select(...outputCols);
	const result = { X_train, y_train, X_test, y_test };
	return result;
};

function flatten<T>(arr: Array<Array<T>>): Array<T> {
	return Array.prototype.concat.apply([], arr);
}

// entry point
const main = async () => {
	try {
		// csv
		const csvFilePath = path.join(__dirname, "iris.csv");
		const header = true;
		let df = await DataFrame.fromCSV(csvFilePath, header);
		df = df.castAll([Number, Number, Number, Number, String]);
		const inputCols = [
			"sepal_length",
			"sepal_width",
			"petal_length",
			"petal_width",
		];
		const outputCols = ["species"];
		// convert values to classes (int)
		df = mapValues(df, {
			"Iris-setosa": 0,
			"Iris-versicolor": 1,
			"Iris-virginica": 2,
		});
		// train test split
		const { X_train, y_train, X_test, y_test } = trainTestSplit({
			df: df,
			inputCols,
			outputCols,
			testSize: 0.25,
		});

		const X = df.select(...inputCols).slice();

		// DO STUFF HERE

		const trueLabels = [0, 1, 0, 1, 1, 0];
		const predictedLabels = [1, 1, 1, 1, 0, 0];

		// The order of the arguments are important !!!
		const CM2 = ConfusionMatrix.fromLabels(trueLabels, predictedLabels);
		console.log(CM2.getAccuracy()); // 0.5
		console.log(CM2.getMatrix());
		console.log(CM2.getTrueCount()); // correct predictions
		console.log(CM2.getFalseCount()); // wrong predictions
	} catch (err) {
		console.log(err);
	}
};

main();
