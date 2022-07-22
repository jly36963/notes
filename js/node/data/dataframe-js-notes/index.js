const { DataFrame, Row } = require("dataframe-js");
const { printSectionTitle, range } = require("./utils");
const { chunk } = require("lodash");
const path = require("path");
const { mkdirSync, readFileSync, rmSync, rmdirSync } = require("fs");


const basicRow = () => {
  let row;
  row = new Row([0, 1, 2, 3, 4]); // No columns
  row = new Row({ a: 0, b: 1, c: 2, d: 3, e: 4 })
  row = new Row(
    [0, 1, 2, 3, 4],
    ["a", "b", "c", "d", "e"], // With columns (has index)
  );

  // Eject
  row.toDict(); // { ...indices }
  row.toArray(); // [ ...values ]

  // About
  row.size(); // length

  // Access
  row.has("a"); // test for column (index)
  row.select("a", "b"); // return a row with selected columns (indices)
  row.get("a"); // get value

  // Modify
  row.set("a", 0); // set value at specified column (index)
};

const basicDfCreation = () => {
  const data = chunk(range(25).map((n) => n + 1), 5); // 1 ... 25
  const columns = ["a", "b", "c", "d", "e"];
  const df = new DataFrame(data, columns);

  df.show();
};

const basicDfFromCsv = async () => {
  const fp = path.join(__dirname, "data", "iris.csv"); // Absolute path

  // fromText, fromDSV, fromPSV, fromTSV, fromCSV, fromJSON
  const df = await DataFrame.fromCSV(fp);

  df.head(5).show();
};

const basicDfEject = () => {
  const df = new DataFrame(
    chunk(range(25).map((n) => n + 1), 5),
    ["a", "b", "c", "d", "e"],
  );

  console.log("collection");
  console.log(df.toCollection());

  console.log("array");
  console.log(df.toArray());

  console.log("dict");
  console.log(df.toDict());

  console.log("array (single col)");
  console.log(df.toArray("a"));
};

const basicDfExport = () => {
  const df = new DataFrame(
    chunk(range(25).map((n) => n + 1), 5),
    ["a", "b", "c", "d", "e"],
  );

  // To string

  console.log("text");
  console.log(df.toText());

  console.log("dsv");
  console.log(df.toDSV());

  console.log("csv");
  console.log(df.toCSV());

  console.log("TSV");
  console.log(df.toTSV());

  console.log("PSV");
  console.log(df.toPSV());

  console.log("json");
  console.log(df.toJSON());

  // To file

  const tempDir = "temp";
  mkdirSync(tempDir);
  const fp = path.join(__dirname, tempDir, "output.csv");

  df.toCSV(true, fp); // toText, toDSV, toTSV, toPSV, toJSON
  const contents = readFileSync(fp, "utf-8").toString();

  console.log("file contents (csv)");
  console.log(contents);

  rmSync(fp);
  rmdirSync(tempDir);
};

const basicDfDetails = async () => {
  const fp = path.join(__dirname, "data", "iris.csv");
  const df = await DataFrame.fromCSV(fp);

  // Details
  console.log("dimensions (r,c)");
  console.log(df.dim());
  console.log("count");
  console.log(df.count());
  console.log("distinct/unique (species col)");
  console.log(df.distinct("species").toArray("species"));
  console.log("columns");
  console.log(df.listColumns());
};

const basicDfSelection = async () => {
  const fp = path.join(__dirname, "data", "iris.csv");
  const df = await DataFrame.fromCSV(fp);

  console.log("head");
  df.head(3).show(); // Default: 10
  console.log("tail");
  df.tail(3).show(); // Default: 5

  console.log("select");
  df.select("sepal_length", "sepal_width").head(3).show();
  console.log("find");
  console.log(df.find((row) => row.get("species") === "Setosa").toDict());
  console.log("slice");
  df.slice(2, 5).show();
  console.log("getRow");
  console.log(df.getRow(0).toDict());
};

const basicDfMutation = () => {
  let df = new DataFrame(
    chunk(range(25).map((n) => n + 1), 5),
    ["a", "b", "c", "d", "e"],
  );

  // Push
  df = df.push([26, 27, 28, 29, 30]);
  df = df.push(new Row({ a: 31, b: 32, c: 33, d: 34, e: 35 }));

  // Cast
  df = df.cast("a", Number); // cast a column to a specified type
  df = df.castAll([Number, Number, Number, Number, Number]); // cast each column to a specified type

  // Add column
  df = df.withColumn("f", () => 2);
  df = df.withColumn("f", (row) => row.get("a") * 0);

  // Drop
  df = df.drop("f");

  // Select and reorder columns
  df = df.restructure(["a", "b", "c", "d", "e"]);

  // Rename
  df = df.renameAll(["a", "b", "c", "d", "e"]);
  df = df.rename("a", "a");

  // Sort
  df = df.sortBy("a"); // sort by column
  df = df.sortBy(["a", "b"]); // primary, secondary, etc

  // Replace
  df = df.replace(0, 0) // Whole df
  df = df.replace(1, 1, ['a', 'b']) // Specific columns

  df = df.dropDuplicates(); // Entire row is duplicate
  df = df.dropDuplicates("a", "b"); // Specific columns are duplicate

  df.show();
};

const basicDfSampling = () => {
  const df = new DataFrame(
    chunk(range(25).map((n) => n + 1), 5),
    ["a", "b", "c", "d", "e"],
  );

  // Shuffle
  const shuffled = df.shuffle(); // shuffle rows around
  console.log('shuffled')
  shuffled.show()

  // Sample
  const sample = df.sample(.5); // Random sample (percentage)
  console.log('sampled')
  sample.show()

  // Bisect
  const [df1, df2] = df.bisect(.7); // Randomly split into two (percentage)
  console.log('bisect 1')
  df1.show()
  console.log('bisect 2')
  df2.show()
}

const basicDfMissingValues = () => {
  let df = new DataFrame(
    chunk(range(25).map((n) => n + 1), 5),
    ["a", "b", "c", "d", "e"],
  );

  // missing values
  df = df.dropMissingValues(['a', 'b']); // remove rows where column value is undefined, NaN, or null
  df = df.fillMissingValues(0, ["a"]); // params: replacement value, columns to fill (undefined, NaN, null) on
}

const basicDfIteration = () => {
  const df = new DataFrame(
    chunk(range(25).map((n) => n + 1), 5),
    ["a", "b", "c", "d", "e"],
  );

  // For each row, set a value based on another column value
  const mapped = df.map((row) => row.set("f", row.get("a") * 0));
  // Filter rows based on row predicate (boolean filter)
  let filtered = df.filter((row) => row.get("a") > 10);
  filtered = df.where((row) => row.get("a") > 10);
  // Chain operations together (filter if returns boolean) (map otherwise)
  const chained = df.chain(
    (row) => row.get("a") > 3,
    (row) => row.set("f", row.get('e') ** 2),
    (row) => typeof row.get("b") === 'number',
  );
  // Reduce to single value
  const sum = df.reduce((acc, curr) => Math.max(acc, curr.get("a")), 0);
}

const basicDfGrouping = () => {
  const df = new DataFrame(
    chunk(range(25).map((n) => n + 1), 5),
    ["a", "b", "c", "d", "e"],
  );

  // groupBy
  const groupedDF = df.groupBy("a", "b");
  groupedDF.listGroups();
  groupedDF.show();
  groupedDF.aggregate((group) => group.count());

  // stat
  df.stat.max("a"); // find max in column 'a'
  df.stat.min("a"); // find min in column 'a'
  df.stat.mean("a"); // find mean in column 'a'
  df.stat.sum("a"); // sum of column 'a'
  df.stat.var("a"); // variance of column 'a'
  df.stat.sd("a"); // std of column 'a'
}

const basicDfCombine = () => {
  const df1 = new DataFrame(
    chunk(range(25).map((n) => n + 1), 5),
    ["a", "b", "c", "d", "e"],
  );
  const df2 = new DataFrame(df1)

  const concatenated = df1.union(df2);
  const joined = df1.join(df2, ['a', 'b', 'c'], "left"); // full, inner (default), outer, left, right
}


async function main() {
  printSectionTitle("basic row");
  basicRow();

  printSectionTitle("basic df creation");
  basicDfCreation();

  printSectionTitle("basic df from csv");
  await basicDfFromCsv();

  printSectionTitle("basic df eject");
  basicDfEject();

  printSectionTitle("basic df export");
  basicDfExport();

  printSectionTitle("basic df details");
  await basicDfDetails();

  printSectionTitle("basic df selection");
  await basicDfSelection();

  printSectionTitle("basic df mutation");
  basicDfMutation();

  printSectionTitle("basic df sampling");
  basicDfSampling();

  printSectionTitle("basic df missing values");
  basicDfMissingValues()

  printSectionTitle("basic df iteration");
  basicDfIteration()

  printSectionTitle("basic df grouping");
  basicDfGrouping()

  printSectionTitle("basic df combining");
  basicDfCombine()
}

main();
