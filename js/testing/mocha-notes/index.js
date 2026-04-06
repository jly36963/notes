import Calculator from "./lib/calculator.js";

const main = async () => {
  // Instantiate
  const c = new Calculator();
  // Use
  const addResult = c.add(1, 2);
  const subtractResult = c.subtract(1, 2);
  const multiplyResult = c.multiply(1, 2);
  const divideResult = c.divide(1, 2);
  const getSumResult = c.getSum([1, 2, 3, 4]);
  const getProductResult = c.getProduct([1, 2, 3, 4]);
  const getMeanResult = c.getMean([1, 2, 3, 4]);
  const getStdResult = c.getStd([1, 2, 3, 4]);
  const randIntResult = await c.randInt(100);
  // Log results
  console.log("addResult: ", addResult);
  console.log("subtractResult: ", subtractResult);
  console.log("multiplyResult: ", multiplyResult);
  console.log("divideResult: ", divideResult);
  console.log("getSumResult: ", getSumResult);
  console.log("getProductResult: ", getProductResult);
  console.log("getMeanResult: ", getMeanResult);
  console.log("getStdResult: ", getStdResult);
  console.log("randIntResult: ", randIntResult);
};

main();
