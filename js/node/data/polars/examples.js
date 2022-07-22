import { readFileSync } from 'fs'
import pl from 'nodejs-polars'

// ts docs: https://github.com/pola-rs/polars/blob/master/nodejs-polars/polars/dataframe.ts

const NINJAS_RECORDS = [
  { id: 'fa6c4c93-fb64-4cd7-8b21-0e5e0f717fd6', firstName: 'Kakashi', lastName: 'Hatake', age: 27 },
  { id: '2c6c74c3-b9d6-4d49-a113-4f1a8164abe3', firstName: 'Tenzo', lastName: 'Yamato', age: 26 },
  { id: '2e9093d5-f466-40bb-be14-993276f0a497', firstName: 'Iruka', lastName: 'Umino', age: 25 },
  { id: '71547b9d-f28e-4511-b767-860bc37f148f', firstName: 'Itachi', lastName: 'Uchiha', age: 21 },
]

export const basicConstructor = () => {
  console.log('basic constructor example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  console.log(df.head())
}

export const basicCSV = () => {
  console.log('basic csv example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  // Write to csv
  const fp = './data/ninjas.csv'
  df.toCSV(fp)
  // Read from csv
  const df2 = pl.readCSV(fp)
  console.log(df2.head())
}

export const basicJSON = () => {
  console.log('basic json example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  // Write to json
  const fp = './data/ninjas.json'
  df.toJSON(fp, { orient: 'row' })
  // Read from json
  const df2 = pl.DataFrame(JSON.parse(readFileSync(fp)))
  console.log(df2.head())

  /*
  // pl.readJSON is not working
  const df2 = pl.readJSON(fp)
  */
}

export const basicDataFrameConcat = () => {
  console.log('basic concat example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  // Concat
  console.log('Concat: ', pl.concat([df, df]))
}

export const basicDataFrameAttributes = () => {
  console.log('basic dataframe attributes example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  // Get attributes
  console.log("shape: ", df.shape)
  console.log("height: ", df.height)
  console.log("width: ", df.width)
  console.log("columns: ", df.columns)
  console.log("dtypes: ", df.dtypes)
  console.log("schema: ", df.schema())
}

export const basicDataFrameConversion = () => {
  console.log('basic dataframe conversion example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  // Convert
  console.log("json: ", df.toJSON({ orient: 'row' }))
  console.log("csv: ", df.toCSV())
  console.log("Array<object>: ", df.toObject())
}

const getRowAsObj = (df, index) => {
  const values = df.row(index)
  const cols = df.columns
  return cols.reduce((obj, c, i) => ({ ...obj, [c]: values[i] }), {})
}

export const basicDataFrameIndexing = () => {
  console.log('basic dataframe indexing example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  // Index
  console.log('row (array of scalar values): ', df.row(0))
  console.log('row (obj): ', getRowAsObj(df, 0))
  console.log('slice of rows: ', df.slice(1, 2))
  console.log('rows using predicate: ', df.filter(pl.col('age').gt(23)))
  console.log('column as series: ', df['firstName'])
  console.log('value: ', df['firstName'][0])
  console.log('value (v2): ', df.getColumn('firstName').get(0))
}

export const basicColumnAssignment = () => {
  console.log('basic column assignment example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  // Add new columns
  const df2 = df.withColumns([
    pl.col('age').mul(52).alias('ageToWeeks'),
    pl.col('firstName').str.toUpperCase().alias('fn'),
    pl.col('lastName').str.toLowerCase().alias('ln'),
  ])
  console.log(df2.head())
}

export const basicColumnMapping = () => {
  console.log('basic column mapping example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  // Replace a column
  df.replaceAtIdx(
    df.findIdxByName('firstName'),
    df.getColumn('firstName').str.toUpperCase().alias('firstName')
  )
  console.log(df.head())
}

export const basicDataFrameDescriptiveMethods = () => {
  console.log('basic df descriptive methods example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  // Get details
  console.log('describe: ', df.describe())
  console.log('isDuplicated: ', df.isDuplicated())
  console.log('isUnique: ', df.isUnique())
  console.log('nullCount: ', df.nullCount())
  console.log('isEmpty: ', df.isEmpty())
}

export const basicDataFrameMethods = () => {
  console.log('basic df methods example')
  // Create dataframe
  const df = pl.DataFrame(NINJAS_RECORDS)
  // Use methods
  console.log("head: ", df.head(2))
  console.log("limit: ", df.limit(2))
  console.log("tail: ", df.tail(2))
  console.log("slice: ", df.slice(1, 1))
  console.log("drop: ", df.drop('age'))
  console.log("sort: ", df.sort('age'))
  console.log("sort (multiple): ", df.sort(['age', 'firstName']))
  console.log("rename: ", df.rename({ 'firstName': 'First Name', 'lastName': 'Last Name', 'age': 'Age' }))
  console.log("sample: ", df.sample({frac: .5}))
}

export const basicColumnAggregations = () => {
  console.log('basic column aggregations example')
  // Create dataframe
  let df = pl.DataFrame(NINJAS_RECORDS)
  // Cast age to int64
  df = df.withColumns(
    pl.col('age').cast(pl.Int64)
  )
  // Aggregations
  console.log("max: ", df['age'].max())
  console.log("min: ", df['age'].min())
  console.log("mean: ", df['age'].mean())
  console.log("median: ", df['age'].median())
  console.log("mode: ", df['age'].mode())
  console.log("sum: ", df['age'].sum())
  // console.log("product: ", df['age'].product())
  // console.log("std: ", df['age'].std())
  // console.log("var: ", df['age'].var())
  console.log("quantile (50%): ", df['age'].quantile(.5))
}

export const basicSelect = () => {
  // TODO
}

export const basicGroupby = () => {
  // TODO
}
  