//---
// mathjs
//---

// https://mathjs.org/docs/index.html

const math = require('mathjs');

//---
// Chaining
//---

const basicChain = () => {
  math.chain(3)
    .add(4)
    .subtract(2)
    .done() // 5
}

//---
// Classes
//---

// https://mathjs.org/docs/reference/classes.html

//---
// Methods
//---

const basicMethods = () => {
  const a = 3;
  const b = 4;

  const numbers = [1, 2, 3, 4, 5]

  // arithmetic
  math.add(a, b); // add
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
  math.quantileSeq([1, 2, 3, 4, 5], .5) // value at quantile

  math.mean(numbers);
  math.median(numbers);
  math.mode(numbers)
  math.std(numbers);
  math.variance(numbers);
  math.sum(numbers);

  // probability
  math.combinations(7, 5) // number of ways picking 'k' unordered outcomes from 'n' possibilities
  math.combinationsWithRep(7, 5) // combinations with replacement
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
}

//---
// Constants
//---

const basicConstants = () => {
  math.e // euler's number
  math.Infinity // infinity
  math.NaN // NaN
  math.phi // golden ratio
  math.pi // pi
}

// ---
// Evaluate
// ---

const basicEvaluate = () => {
  // evaluate
  math.evaluate('sqrt(3^2 + 4^2') // 5
  math.evaluate('2 inch to cm') // 5.08 cm
  math.evaluate('cos(45 deg)') // 0.7071067811865476

  // evaluate with scope
  const scope = { a: 3, b: 4 };
  math.evaluate('a * b', scope); // 12

  // compile
  math
    .compile('3 ^ 2')
    .evaluate()

  // compile with scope
  math
    .compile('a ^ b')
    .evaluate({ a: 3, b: 2 })
}

// ---
// Parse
// ---

const basicParse = () => {
  // parse
  const node = math.parse('sqrt(x/x+1)')
  node.toString() // returns 'sqrt((x / x) + 1)'
  node.toTex() // returns '\sqrt{ {\frac{x}{x} }+{1} }'

  // parser
  const parser = math.parser()
  // evaluate
  parser.evaluate('sqrt(3^2 + 4^2)') // 5
  // evaluate function
  parser.evaluate('f(x, y) = x^y') // f(x, y)
  parser.evaluate('f(2, 3)') // 8
  // get & set variables
  parser.evaluate('f(x, y) = x^y') // set
  parser.evaluate('x = 2')
  parser.evaluate('y = 3')
  const x = parser.get('x') // get
  const y = parser.get('y')
  const f = parser.get('f')
  const value = f(x, y) // execute
}

// ---
// parser input syntax
// ---

const basicParseSyntas = () => {
  'a = 4' // assignment
  '(2 + 3) * 4' // arithmetic operations
  'x^2' // exponents
  'pi + e' // constants
  '1.4e3' // exponential notation (1.4e3 == 1400)
  'sqrt(a); log(a); sin(a)' // predefined functions
  'A[1, 1]' // matrices are one-based
  'A[2:4, 1]' // ranges supported
  'A[2:4, 1:3]' // upper bounds included
  'f(x) = x^2 + 3' // function syntax
  '5 < x < 10 '// chain comparison operators
  'nums = { a: 3, b: 4, c: 5 }' // set object
  'nums.a + nums.b + nums.c' // use object properties
  'a = 3; b = 4; c = 5' // statement separator (;)
  '5!' // factorial
  '2 == 3; 2 < 3; 2 != 3' // comparison operators
  'a = 3; x = a > 0 ? 1 : -1' // ternary
  '5.4 kg + 33g; 2 inch to cm; 90 km/h to m/s; 12 seconds * 2' // units 
}