

// ------------
// mathjs (expressions)
// ------------

const math = require('mathjs');

// ------------
// evaluate
// ------------

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

// ------------
// parse
// ------------

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

// ------------
// parser input syntax
// ------------

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