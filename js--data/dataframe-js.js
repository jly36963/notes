// ------------
// dataframe-js
// ------------

// install
  // npm i --save dataframe-js

// npm
  // https://www.npmjs.com/package/dataframe-js

// docs
  // https://gmousse.gitbooks.io/dataframe-js/

// ------------
// basics
// ------------

// import
const { DataFrame } = require('dataframe-js');
// data
const data = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25]
];
const columns = ['a', 'b', 'c', 'd', 'e'];
// df
const df = new DataFrame(data, columns);

// show
df.show() // print df

// ------------
// import
// ------------

// fn must be absolute!
const { DataFrame } = require('dataframe-js');
const path = require('path');

// params
const fn = path.join(__dirname, 'data.csv') // must be an absolute path
const sep = ',';
const header = true;

// txt
const dfText = await DataFrame.fromText(fn, sep, header);
// csv
const dfCSV = await DataFrame.fromDSV(fn, header)
// psv
const dfPSV = await DataFrame.fromPSV(fn, header);
// tsv
const dfTSV = await DataFrame.fromTSV(fn, header)
// json
const dfJSON = await DataFrame.fromJSON(fn)

// ------------
// export
// ------------

// df
const df = new DataFrame(data, columns);

// df to js objects
df.toCollection();
df.toArray();
df.toDict();

// df to file
DataFrame.toText(true, ';', '/my/absolue/path/myfile.txt');
DataFrame.toDSV(true, ';', '/my/absolue/path/myfile.txt');
DataFrame.toCSV(true, '/my/absolue/path/myfile.csv');
DataFrame.toTSV(true, '/my/absolue/path/myfile.tsv');
DataFrame.toPSV(true, '/my/absolue/path/myfile.psv');
DataFrame.toJSON(true, '/my/absolue/path/myfile.json');

// ------------
// methods
// ------------

const DataFrame, { Row } = require('dataframe-js');
// data
const data = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25]
];
const columns = ['a', 'b', 'c', 'd', 'e'];
// df
const df = new DataFrame(data, columns);

// about
df.show() // print df
df.head(5) // first rows (default: 10)
df.tail(5) // last rows (default: 5)
df.dim() //  dimensions
df.count() // count rows
df.distinct(); // distinct values in df (also 'df.unique')
df.distinct('a'); // distinct values in column 'a'
df.listColumns(); // array of column headers

// select
df.select('a', 'c'); // select columns
df.find(row => row.get('a') > 5) // return first row that meets condition
df.slice(); // grab slice of df (params: startIndex, endIndex, default: 0, df.count())
df.getRow(0); // return row by index

// add
df.push([26, 27, 28, 29, 30]) // add row

// cast
df.cast('a', Number); // cast a column to a specified type
df.castAll([Number, Number, Number, Number, Number]) // cast each column to a specified type

// modify
df.withColumn('f', () => 2); // set column using scalar 
df.withColumn('f', (row) => row.get('a') * 0); // set column using column
df.restructure(['a', 'c', 'e']) // re-order or drop columns
df.renameAll(['A', 'B', 'C', 'D', 'E']) // rename columns
df.rename('a','A'); // rename a column
df.shuffle(); // shuffle rows around
df.sample(.5); // return random sample (between 0 and 1)
df.bisect(.7); // randomly split into two. (params: value between 0 and 1) (where split takes place)
df.sortBy('a') // sort by column
df.sortBy(['a','b']) // primary, secondary, etc
df.replace(5, 55) // replace value across df
df.replace(0, 100, 'a') // replace value across column

// replace using object
const mapValues = (df, obj) => {
  let dfNew = df.slice();
  Object.keys(obj).forEach(k => {
    dfNew = dfNew.replace(k, obj[k])
  })
  return dfNew;
}

mapValues(df, {
  0: 100,
  25: 250
})

// remove
df.drop('a'); // drop a column
df.dropDuplicates('id'); // remove duplicates (provide rows to check for uniqueness)

// missing values
df.dropMissingValues('id'); // remove rows where column value is undefined, NaN, or null
df.fillMissingValues(0, ['a']) // params: replacement value, columns to fill (undefined, NaN, null) on

// iterate
df.map(row => row.set('f', row.get('a') * 0)) // set a column using another column
df.filter(row => row.get('a') > 10) // boolean filter (using values from column)
df.where(row => row.get('a') > 10) // boolean filter (alias of 'filter')
df.chain(
  // chain maps/filters together (optimize executions)
  row => row.get('column1') > 3, // filter
  row => row.set('column1', 3),  // map
  row => row.get('column2') === '5' // filter
)
df.reduce((p, n) => Math.max(p, n.get('a')), 0) // reduce column to a value (params: func(prev, next), initial value)

// groupBy
const groupedDF = df.groupBy('a','b');
groupedDF.listGroups();
groupedDF.show();
groupedDF.aggregate(group => group.count());

// stats
df.stat.max('a'); // find max in column 'a'
df.stat.min('a'); // find min in column 'a'
df.stat.mean('a'); // find mean in column 'a'
df.stat.sum('a'); // sum of column 'a'
df.stat.var('a'); // variance of column 'a'
df.stat.sd('a'); // std of column 'a'

// union
df1.union(df2); // concat two dataframes

// join
  // dfToJoin -- dataframe to join
  // columnNames -- selected columns for the join (string or array)
  // how -- full, inner, outer, left, right (default: inner)
df1.join(df2, 'id', 'inner');

// flatten
const flatten = (arr) => [].concat.apply([], arr);
const flattenAll = (arr) => arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? flattenAll(cur) : cur), [])

// ------------
// rows
// ------------

// import
const { DataFrame, Row } = require('dataframe-js');

// create
const row = new Row([0, 1, 2, 3, 4]) // no columns (indices) specified
const row = new Row(
  [0, 1, 2, 3, 4], // data
  ['a', 'b', 'c', 'd', 'e'] // columns (indices)
)

// export 
row.toDict(); // { ...indices }
row.toArray(); // [ ...values ]

// about
row.size(); // length

// access
row.has('a'); // test for column (index)
row.select('a', 'b') // return a row with selected columns (indices)
row.get('a'); // get value

// modify
row.set('a', 0) // set value at specified column (index)

