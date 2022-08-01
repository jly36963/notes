import pl from 'nodejs-polars'
import { chunk, zipObject } from 'lodash-es'
import { printSectionTitle, range, round } from "./utils/index.js"

// repo: https://github.com/pola-rs/polars/tree/master/nodejs-polars
// docs: https://pola-rs.github.io/polars/nodejs-polars/html/index.html

// series: https://github.com/pola-rs/polars/blob/master/nodejs-polars/polars/series/series.ts
// df: https://github.com/pola-rs/polars/blob/master/nodejs-polars/polars/dataframe.ts

const basicSeries = () => {
  const data = range(5)
  const s = pl.Series('s1', data) //  { index: ['a', 'b', 'c', 'd', 'e'] }
  console.log(s)

  // TODO: head, tail, isIn, filter, get, slice, cast, rename, sort, unique, name
  // TODO: toArray, toJSON, values
  // TODO: isNull, isNotNull, dropNulls, fillNull, nullCount
  // TODO: len, min, max, mean, median, mode, quantile, sum
}

const NINJAS_RECORDS = [
  { id: 'fa6c4c93-fb64-4cd7-8b21-0e5e0f717fd6', firstName: 'Kakashi', lastName: 'Hatake', age: 27 },
  { id: '2c6c74c3-b9d6-4d49-a113-4f1a8164abe3', firstName: 'Tenzo', lastName: 'Yamato', age: 26 },
  { id: '2e9093d5-f466-40bb-be14-993276f0a497', firstName: 'Iruka', lastName: 'Umino', age: 25 },
  { id: '71547b9d-f28e-4511-b767-860bc37f148f', firstName: 'Itachi', lastName: 'Uchiha', age: 21 },
]

const basicDfCreation = () => {
  let data, df

  // From Array<RowLike>
  data = [
    { a: 1, b: 2, c: 3, d: 4, e: 5 },
    { a: 6, b: 7, c: 8, d: 9, e: 10 },
    { a: 11, b: 12, c: 13, d: 14, e: 15 },
    { a: 16, b: 17, c: 18, d: 19, e: 20 },
    { a: 21, b: 22, c: 23, d: 24, e: 25 },
  ]
  df = pl.DataFrame(data)
  console.log('df from Array<Rowlike>')
  console.log(df.head())

  // From Dict<str,Columnlike>
  data = {
    a: [1, 6, 11, 16, 21],
    b: [2, 7, 12, 17, 22],
    c: [3, 8, 13, 18, 23],
    d: [4, 9, 14, 19, 24],
    e: [5, 10, 15, 20, 25],
  }
  df = pl.DataFrame(data)
  console.log('df from Dict<ColumnLike>')
  console.log(df.head())

  // From Array<Array<number>>
  data = chunk(range(25).map(n => n + 1), 5)
  df = pl.DataFrame(data, { columns: ['a', 'b', 'c', 'd', 'e'], orient: 'row' })
  console.log('df from Array<Array<number>>')
  console.log(df.head())
}

const basicDfDetails = () => {
  const df = pl.readCSV('./data/iris.csv')

  console.log("columns: ", df.columns)
  console.log("dtypes: ", df.dtypes)
  console.log("height: ", df.height)
  console.log("shape: ", df.shape)
  console.log("width: ", df.width)
  console.log("schema: ", df.schema)
  console.log("describe: ", df.describe())
}

const basicDfExport = () => {
  let df
  df = pl.DataFrame(
    chunk(range(25).map(n => n + 1), 5),
    { columns: ['a', 'b', 'c', 'd', 'e'], orient: 'row' }
  )

  // CSV
  const csv = df.writeCSV().toString('utf-8')
  console.log(csv)

  df = pl.readCSV(csv)
  console.log(df.head())

  // JSON
  const json = df.writeJSON({ format: 'json' }).toString('utf-8')
  console.log(json)

  df = pl.DataFrame(JSON.parse(json))
  console.log(df.head())

  // Array<object>
  const records = df.toRecords()
  console.log(records)

  df = pl.DataFrame(records)
  console.log(df.head())
}

const basicDfSelection = () => {
  const df = pl.readCSV('./data/iris.csv')

  const row = df.row(0)
  console.log("row:", row)

  const rowObj = zipObject(df.columns, df.row(0))
  console.log('row (obj):', rowObj)

  const slice = df.slice(1, 2)
  console.log('slice:', slice)

  const column = df.getColumn('species') // df['species']
  console.log('column:', column.head())

  // TODO: select (more advanced)
  const columns = df.select('sepal_width', 'sepal_length')
  console.log('columns:', columns.head())

  const cell = df.getColumn('species').get(0)
  console.log('cell:', cell)

  // const filtered = df.filter(pl.col('species').eq("Setosa"))
  // console.log('filtered:', filtered.head())

  console.log("head: ", df.head(2))
  console.log("tail: ", df.tail(2))
}

const basicDfMath = () => {
  const df = pl.DataFrame(
    chunk(range(25).map(n => n + 1), 5),
    { columns: ['a', 'b', 'c', 'd', 'e'], orient: 'row' }
  )

  console.log('add')
  console.log(df.add(5))

  console.log('sub')
  console.log(df.sub(5))

  console.log('mul')
  console.log(df.mul(5))

  console.log('div')
  console.log(df.div(5))
}

const basicColumnAggregation = () => {
  const df = pl.readCSV('./data/iris.csv')

  console.log("max: ", df.max())
  console.log("min: ", df.min())
  console.log("mean: ", df.mean())
  console.log("median: ", df.median())
  console.log("sum: ", df.sum())
  console.log("std: ", df.std())
  console.log("var: ", df.var())
  console.log("quantile (50%): ", df.quantile(.5))
}

const basicDfMutation = () => {
  const df = pl.DataFrame(
    chunk(range(25).map(n => n + 1), 5),
    { columns: ['a', 'b', 'c', 'd', 'e'], orient: 'row' }
  )

  const dropped = df.drop('e')
  console.log("drop: ", dropped)

  const renamed = df.rename({ a: "A", b: "B", c: "C", d: "D", e: "E" })
  console.log("rename: ", renamed)

  console.log("sort:", df.sort('a'))
  console.log("sort (multiple): ", df.sort(['a', 'b']))
  console.log("sample: ", df.sample({ frac: .5 }))
}

const basicDfCombine = () => {
  const df = pl.DataFrame(
    chunk(range(25).map(n => n + 1), 5),
    { columns: ['a', 'b', 'c', 'd', 'e'], orient: 'row' }
  )

  // Concat
  console.log('concat: ', pl.concat([df, df]))

  // Join 
  console.log('join:', df.join(df, { how: 'inner', on: 'a', suffix: '_r' })) // leftOn, rightON
}

const basicColumnAssignment = () => {
  let df
  df = pl.DataFrame(NINJAS_RECORDS)

  // Replaces column if no alias (or alias matches existing column)
  // Adds column if alias is new
  df = df.withColumns([
    pl.col('age').add(1),
    pl.col('firstName').str.toUpperCase().alias('fn'),
    pl.col('lastName').str.toLowerCase().alias('ln'),
  ])

  console.log(df.head())
}

const basicDfDescriptiveMethods = () => {
  const df = pl.DataFrame(NINJAS_RECORDS)

  console.log('isDuplicated: ', df.isDuplicated())
  console.log('isUnique: ', df.isUnique())
  console.log('nullCount: ', df.nullCount())
  console.log('isEmpty: ', df.isEmpty())
}

const basicDfMissing = () => {
  // TODO: fillNull, nullCount
}

const basicDfGrouping = () => {
  const df = pl.readCSV('./data/iris.csv')

  const grouped = df.groupBy('species')
  console.log('grouped:', grouped)
  console.log('groupby max:', grouped.max())
  console.log('groupby groups:', grouped.groups())
  // groupby agg: count, first, last, max, mean, median, min, quantile, sum

  // No support for iterating through groups yet?
  // TODO: partitionBy
}

const main = () => {
  printSectionTitle('basic series')
  basicSeries()
  printSectionTitle('basic df creation')
  basicDfCreation()
  printSectionTitle('basic df export')
  basicDfExport()
  printSectionTitle('basic df details')
  basicDfDetails()
  printSectionTitle('basic df indexing')
  basicDfSelection()
  printSectionTitle('basic df math')
  basicDfMath()
  printSectionTitle('basic column aggregation')
  basicColumnAggregation()
  printSectionTitle('basic column mutation')
  basicDfMutation()
  printSectionTitle('basic column combine')
  basicDfCombine()
  printSectionTitle('basic column assignment')
  basicColumnAssignment()
  printSectionTitle('basic df descriptive methods')
  basicDfDescriptiveMethods()
  printSectionTitle('basic df missing')
  basicDfMissing()
  printSectionTitle('basic df grouping')
  basicDfGrouping()
}

main()