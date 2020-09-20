// ------------
// mathjs
// ------------

// install
  // npm i --save mathjs

// docs
  // https://www.npmjs.com/package/mathjs
  // https://mathjs.org/docs/index.html


// ------------
// basics
// ------------

const math = require('mathjs');

// ------------
// chaining
// ------------

math.chain(3)
  .add(4)
  .subtract(2)
  .done() // 5

// ------------
// classes
// ------------

// https://mathjs.org/docs/reference/classes.html

// ------------
// functions
// ------------

const a = 3;
const b = 4;
const c = 5;

const numbers = [1,2,3,4,5]

// arithmetic
math.add(a,b); // add
math.cube(a); // cube
math.cbrt(8); // cube root
math.divide(a, b); // divide
math.exp(8) // exponent (e ** x)
math.log(a) // ln
math.log(a, 2) // log base 2
math.mod(a, b) // modulus (remainder)
math.multiply(a, b) // multiply
math.pow(a, b) // a ** b
math.sqrt(a) // square root
math.subtract(a, b) // subtract

// abs
math.abs(a); // absolute value

// round
math.floor(a) // round in negative direction
math.round(a) // round to nearest int
math.ceil(a); // round in positive direction
math.fix(a) // round towards zero

// factors & multiples
math.gcd(a, b) // greatest common denominator
math.lcm(a, b) // least common multiple

// stats
math.max(numbers);
math.min(numbers);
math.quantileSeq([1,2,3,4,5], .5) // value at quantile

math.mean(numbers);
math.median(numbers);
math.mode(numbers)
math.std(numbers);
math.variance(numbers);
math.sum(numbers);

// probability
math.combinations(7, 5) // number of ways picking 'k' unordered outcomes from 'n' possibilities
math.combinationsWithRep(7,5) // combinations with replacement
math.factorial(a);
math.permutations(n) // number of possible ordered combinations
math.pickRandom(numbers) // random selection from array
math.randomInt(0, 11) // random int (min <= x < max)

// linalg
  // https://mathjs.org/docs/reference/functions.html#matrix-functions

// trig
  // sin, cos, tan
  // sec, csc, cot
  // asin, acos, atan (...)
  // sinh, cosh, tanh (...)
math.sin(math.pi / 2);

// check
math.isInteger(a)
math.isNaN(a)
math.isNegative(a)
math.isPositive(a)
math.isPrime(a)
math.isZero(a)


// ------------
// constants
// ------------

math.e // euler's number
math.Infinity // infinity
math.NaN // NaN
math.phi // golden ratio
math.pi // pi

// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



