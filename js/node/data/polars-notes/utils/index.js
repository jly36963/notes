export const printSectionTitle = (s) => console.log("\n" + s.toUpperCase() + "\n")

export const range = (a, b, c) => {
  // Convert args to start/stop/step
  let start, stop, step
  if (a !== undefined && b !== undefined && c !== undefined) {
    start = a
    stop = b
    step = c
  } else if (a !== undefined && b !== undefined) {
    start = a
    stop = b
    step = 1
  } else if (a !== undefined) {
    start = 0
    stop = a
    step = 1
  } else {
    throw new Error('Cannot determine start/stop/step')
  }
  // Make sure that for loop will eventually end
  if ((stop - start) / step <= 0) {
    throw new Error('Args will result in infinite loop')
  }
  // Get result
  const result = []
  for (let i = start; i < stop; i += step) {
    result.push(i)
  }
  return result
}

export const round = (n, precision = 0) => {
  const x = 10 ** Math.max(precision, 0)
  return Math.round(n * x) / x
}

export function getRowAsObj(df, index) {
  const values = df.row(index)
  const cols = df.columns
  return cols.reduce((obj, c, i) => ({ ...obj, [c]: values[i] }), {})
}