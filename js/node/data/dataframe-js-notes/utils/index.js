const printSectionTitle = (s) => console.log("\n" + s.toUpperCase() + "\n")

const range = (a, b, c) => {
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
  result = []
  for (let i = start; i < stop; i += step) {
    result.push(i)
  }
  return result
}

module.exports = {
  printSectionTitle,
  range
}