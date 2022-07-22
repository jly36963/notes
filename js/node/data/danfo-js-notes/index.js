const dfd = require('danfojs-node')
const { chunk, zipObject } = require('lodash')
const { printSectionTitle, range, round } = require("./utils");

const basicSeries = () => {
  let s, data

  // No index
  data = range(5)
  s = new dfd.Series(data)
  s.print()

  // With index
  data = range(5)
  s = new dfd.Series(data, { index: ['a', 'b', 'c', 'd', 'e'] })
  s.print()

  console.log('index')
  console.log(s.index)
  console.log('values')
  console.log(s.values)
  console.log('dtype')
  console.log(s.dtype)
  console.log('size')
  console.log(s.size)
}

const basicDfCreation = async () => {
  let df, data

  // From rows
  data = [
    { a: 1, b: 2, c: 3, d: 4, e: 5 },
    { a: 6, b: 7, c: 8, d: 9, e: 10 },
    { a: 11, b: 12, c: 13, d: 14, e: 15 },
    { a: 16, b: 17, c: 18, d: 19, e: 20 },
    { a: 21, b: 22, c: 23, d: 24, e: 25 },
  ]
  df = new dfd.DataFrame(data)
  console.log('df from Array<Rowlike>')
  df.ctypes.print()
  df.print()

  // From cols
  data = {
    a: [1, 6, 11, 16, 21],
    b: [2, 7, 12, 17, 22],
    c: [3, 8, 13, 18, 23],
    d: [4, 9, 14, 19, 24],
    e: [5, 10, 15, 20, 25],
  }
  df = new dfd.DataFrame(data)
  console.log('df from Dict<Columnlike>')
  df.ctypes.print()
  df.print()

  // From csv
  df = await dfd.readCSV('./data/iris.csv')
  console.log('df from csv')
  df.ctypes.print()
  df.head(5).print()
}

const basicDfDetails = () => {
  const data = chunk(range(25).map(n => n + 1), 5)
  const df = new dfd.DataFrame(data, { columns: ['a', 'b', 'c', 'd', 'e'] })

  console.log("ctypes")
  console.log(zipObject(df.ctypes.index, df.ctypes.values))
  console.log('index')
  console.log(df.index)
  console.log('columns')
  console.log(df.columns)
  console.log('shape')
  console.log(df.shape)
  console.log('size')
  console.log(df.size)
  console.log('axis')
  console.log(df.axis)
  console.log('axis')
  console.log(df.axis)
}

const basicDfEject = () => {
  const data = chunk(range(25).map(n => n + 1), 5)
  const df = new dfd.DataFrame(data, { columns: ['a', 'b', 'c', 'd', 'e'] })

  const output = dfd.toJSON(df)
  console.log('df to Array<object>')
  console.log(output)
}

const basicDfExport = async () => {
  // TODO: dfd.toJSON, dfd.toCSV
}

const basicDfSelection = async () => {
  const df = await dfd.readCSV('./data/iris.csv')

  // Select column
  console.log('column')
  df.column('species').head(5).print()

  // Select columns
  console.log('select columns')
  df.loc({ columns: ['sepal_length', 'sepal_width'] }).head(5).print()

  // Select rows
  console.log('select rows')
  df.loc({ rows: [0, 1] }).print()

  // Select slice of rows
  console.log('select slice of rows')
  df.loc({ rows: [`0:3`] }).print() // If alpha, do `"a":"b"`

  // Select cols/rows
  console.log('select cols/rows')
  df.loc({ columns: ['sepal_length', 'sepal_width'], rows: [0, 1] }).print()

  // Select rows using boolean mask
  console.log('select using boolean mask')
  df.loc({ rows: df['species'].eq('Versicolor') }).head(5).print()

  // Select rows (query)
  console.log('query using boolean mask')
  df.query(df['species'].eq('Virginica')).head().print()

  // Select (iloc)
  console.log('select cols/rows (iloc)')
  df.iloc({ columns: [0, 1], rows: [0, 1] }).print()

  // Select slice (iloc)
  console.log('select col/row slices (iloc)')
  df.iloc({ columns: ["0:3"], rows: ["0:3"] }).print()

  // Select cell (at)
  console.log('select cell (at)')
  console.log(df.at(3, "species"))

  // Select cell (iat)
  console.log('select cell (iat)')
  console.log(df.iat(3, 4))
}

const basicDfMath = () => {
  const df = new dfd.DataFrame(
    chunk(range(25).map(n => n + 1), 5),
    { columns: ['a', 'b', 'c', 'd', 'e'] }
  )

  console.log('add')
  df.add(df).print()

  console.log('sub')
  df.sub(df).print()

  console.log('mul')
  df.mul(df).print()

  console.log('div')
  df.div(df).print()

  // TODO: mod, pow, lt, gt, le, ge, ne, eq
}

const basicDfAggregation = () => {
  const df = new dfd.DataFrame(
    chunk(range(25).map(n => n + 1), 5),
    { columns: ['a', 'b', 'c', 'd', 'e'] }
  )

  // console.log('abs')
  // df.abs().print()

  // console.log('round')
  // df.round().print()

  console.log('count')
  df.count().print()

  console.log('max')
  df.max().print()

  console.log('min')
  df.min().print()

  console.log('mean')
  df.mean().print()

  console.log('median')
  df.median().print()

  console.log('mode')
  df.mode().print()

  console.log('std')
  df.std().round(2).print()

  console.log('var')
  df.var().print()

  console.log('describe')
  df.describe().round(2).print()
}

const basicDfMutation = () => {
  const df = new dfd.DataFrame(
    chunk(range(25).map(n => n + 1), 5),
    { columns: ['a', 'b', 'c', 'd', 'e'] }
  )

  // TODO: drop, rename, resetIndex, sample, setIndex, sortValues, addColumn
}

const basicDfCombine = () => {
  const df = new dfd.DataFrame(
    chunk(range(25).map(n => n + 1), 5),
    { columns: ['a', 'b', 'c', 'd', 'e'] }
  )

  // TODO: concat, merge
}

const basicDfMissing = () => {
  const df = new dfd.DataFrame(
    chunk(range(25).map(n => n + 1), 5),
    { columns: ['a', 'b', 'c', 'd', 'e'] }
  )

  // TODO: dropNa, filllNa, isNa, replace
}

const basicDfGrouping = async () => {
  const df = await dfd.readCSV('./data/iris.csv')

  const groupDf = df.groupby(['species'])

  const roundNumbers = v => typeof v === 'number' ? round(v, 2) : v

  console.log('count')
  groupDf.count().print()
  console.log('min')
  groupDf.min().print()
  console.log('max')
  groupDf.max().print()
  console.log('mean')
  groupDf.mean().applyMap(roundNumbers).print()
  console.log('std')
  groupDf.std().applyMap(roundNumbers).print()
  console.log('var')
  groupDf.var().applyMap(roundNumbers).print()
}

const basicDfGrouping2 = async () => {
  const df = await dfd.readCSV('./data/iris.csv')

  const groupKeys = df.column('species').unique().values

  const groupDf = df.groupby(['species'])

  // Iterate through groups
  groupKeys.forEach(g => {
    const group = groupDf.getGroup([g])
    console.log(`length of group ${g}: ${group.shape[0]}`)
  })
}

const basicDfMapping = () => {
  const df = new dfd.DataFrame(
    chunk(range(25).map(n => n + 1), 5),
    { columns: ['a', 'b', 'c', 'd', 'e'] }
  )

  // Applied to every element in df
  df.applyMap(n => n * 2).print()
}

const main = async () => {
  printSectionTitle('basic series')
  basicSeries()

  printSectionTitle('basic df creation')
  await basicDfCreation()

  printSectionTitle('basic df details')
  basicDfDetails()

  printSectionTitle('basic df eject')
  basicDfEject()

  printSectionTitle('basic df export')
  await basicDfExport()

  printSectionTitle('basic df selection')
  await basicDfSelection()

  printSectionTitle('basic df math')
  basicDfMath()

  printSectionTitle('basic df agg')
  basicDfAggregation()

  printSectionTitle('basic df mutation')
  basicDfMutation()

  printSectionTitle('basic df combine')
  basicDfCombine()

  printSectionTitle('basic df missing')
  basicDfMissing()

  printSectionTitle('basic df grouping')
  await basicDfGrouping()

  printSectionTitle('basic df grouping (iterate over groups)')
  await basicDfGrouping2()

  printSectionTitle('basic df mapping')
  basicDfMapping()
}

main()