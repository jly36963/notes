// ---
// Javascript
// ---

// ---
// Variables
// ---

const basicVariables = () => {
  // variable names can only contain A-z, 0-9, _, $, cannot start with number.
  // scope: global, function, block

  // var: can be reassigned, can be re-initialized, no block scope
  var name1 = "john doe";

  // let: can be reassigned, can't be re-initialized, yes block scope
  let name2 = "john doe";

  // const: can't be reassigned, can't be re-intialized, yes block scope
  const name3 = "john doe";
}

// ---
// Data types
// ---

const basicDataTypes = () => {
  // primitive
  const greeting = "Kakashi Hatake"; // string
  const age = 27; // number
  const isAwesome = true; // boolean
  const currentJutsu = null; // null
  const middleName = undefined; // undefined
  const sym = Symbol("Kakashi"); // symbol

  // reference
  const numbers = [1, 2, 3, 4, 5]; // array
  const kakashi = { id: 1, name: "Kakashi" }; // object literal
  const now = new Date(); // date

  // reflection
  const t = typeof 5
}

// ---
// Operators
// ---

const basicOperators = () => {
  // comparison
  const identical = 5 === 5
  const notIdentical = 5 !== 6
  const lt = 5 < 6
  const gt = 6 > 5
  const lte = 5 <= 6
  const gte = 5 >= 6

  // arithmetic
  const sum = 1 + 2
  const diff = 1 - 2
  const product = 1 * 2
  const quotient = 1 / 2
  const remainder = 1 % 2
  const power = 2 ** 3

  // increment
  1++
  3--

  // assignment
  let a = 1
  a += 3
  a -= 2
  a *= 4
  a /= 2
  a %= 2

  // logical
  true && 3 // and
  true || 3 // or
  !true // not
  true ? 'true case' : 'false case' // ternary
  true ?? 3 // nullish coalesce
}

// ---
// Math
// ---

const basicMath = () => {
  Math.PI;
  Math.E;
  Math.round(3.5);
  Math.ceil(3.5);
  Math.floor(3.5);
  Math.sqrt(3.5);
  Math.abs(3.5);
  Math.pow(2, 4);
  Math.min(1, 2, 3, 4, 5);
  Math.max(1, 2, 3, 4, 5);
  Math.random() * 3; // random float between 0 and 3
  Math.floor(Math.random() * 21); // random float 0-21, floored to int 0-20
}

// ---
// Strings
// ---

const basicStrings = () => {
  str1.concat(str2); // concatenate 2 strings.
  str4 = str1.concat(str2, str3); // concatenate 3 strings.
  str3 = str1 + " " + str2; // concatenates strings (with space between).
  str1 += str2; // concatenates str2 to the end of str1. (mutates str1)
  str1.replace("something", "something else"); // replace first instance
  str1.replace(/something/g, "something else"); // global replace.
  obj1.toString(); // return object as string
  str1.trim(); // removes whitespace from both ends of a string.
}

// ---
// Arrays
// ---

const basicArrays = () => {
  // create array
  const arr1 = [1, 2, 3, 4, 5]; // new Array(1, 2, 3, 4, 5)
  const arr2 = [6, 7, 8, 9, 10]

  // indexing
  const val = num[3];

  // array destructuring
  const [first] = arr1 // 1
  const [, second] = arr1 // 2
  const [, , ...rest] = arr1 // [3,4,5]

  // spread
  const shallowCopy = [...arr1]
  const shallowWithAdditional = [...arr1, 6]

  // properties
  arr1.length

  // Array
  Array.isArray(arr1)
  Array.prototype.push.apply(arr1, [6, 7, 8])

  // methods
  arr1.concat(arr2); // return joined arrays

  arr1.filter((x) => x > 4); // return array with elements that match condition
  arr1.find((x) => x > 4); // return first element that matches condition (or undefined)
  arr1.forEach((x) => console.log(x)); // for each element, do something
  arr1.forEach((x, i) => console.log(`${i}: ${x}`)); // forEach using index
  arr1.map((x) => x * 2); // return a copy of an array with each element transformed
  arr1.every((x) => x > 3); // return true if all elements meet condition
  arr1.some((x) => x > 3) // return true if any elements meet condition
  arr1.includes(5) // returns true if element is contained in array
  arr1.indexOf(4); // returns index value of the specified element (or -1)
  arr1.join(", "); // joins elements of array into a string with a delimiter.

  arr1.pop(); // removes last element of an array, returns that element. (mutates)
  arr1.shift(); // removes first element of an array, returns new that element. (mutates)
  arr1.push(10); // adds new element to the end of an array, returns new length.
  arr1.unshift(1); // adds new elements to the beginning of an array, returns new length.
  arr1.sort(); // sorts elements of an array. (mutates in-place)
  arr1.sort((a, b) => a - b); // sort using comparison function (sort by negative/positive output)
  arr1.reverse(); // reverse order of array.
  arr1.splice(1, 0, 0); // insert new element before index 1, delete none. return array of deleted elements

  arr1.slice(2); // returns arr1[2:]
  arr1.slice(2, 4); // returns arr1[2:4]
  arr1.slice(-3); // returns arr1[-3:]
  arr1.slice(-1000, 1000); // returns arr1[:] (if indices provided are outside of index range)
}

// ---
// Objects
// ---

const basicObjects = () => {
  // create object literal
  const kakashi = {
    firstName: "Kakashi",
    lastName: "Hatake",
    age: 27,
    greet: () => `Hello! My name is ${this.firstName}!`,
  };

  // Access
  const firstName = kakashi.firstName
  const { lastName } = kakashi // object destructuring

  // spread
  const shallowCopy = { ...kakashi }
  const shallowWithAdditional = { ...kakashi, state: 'Konoha' }
  const shallowWithUpdate = { ...kakashi, firstName: 'Kaka', lastName: 'Sensei' }

  // Methods
  const keys = Object.keys(kakashi)
  const values = Object.values(kakashi)
  const entries = Object.entries(kakashi)
  const isSameReference = Object.is(kakashi, kakashi)
  // Avoid polyfill funny business
  const hasProperty = Object.prototype.hasOwnProperty.call(kakashi, firstName)

  // looping
  for (const [k,v] of Object.entries(kakashi)) {
    console.log(`${k}: ${v}`)
  }
  for (const k in kakashi) {
    console.log(`${k}: ${kakashi[k]}`)
  }
}

// ---
// Template literals
// ---

const basicInterpolation = () => {
  // template literals (template strings) (es6)
  // use backticks, not quotes, for template literals.
  // variables, expressions, ternary operators, and functions can be used inside the brackets.
  const name = "Kakashi";
  const greeting = `Hello! My name is ${name}!`;
}

// ---
// Conditionals, logic, and loops
// ---

// conditional statements

const basicIfElse = () => {
  let a = 5
  if (Number.isNaN(a)) {
    throw new Error('Must be a number')
  } else if (a < 0) {
    throw new Error('Must not be negative')
  } else if (a > 100) {
    throw new Error('Must be lte 100')
  } else if (!Number.isInteger(a)) {
    a = Math.round(a)
    console.log(`Rounding number to ${a}`)
  }

  const output = String.prototype.repeat.call('hi', a)
  console.log(output)
}

const basicIfElse2 = () => {
  let a = 5
  if (Number.isNaN(a)) {
    throw new Error('Must be a number')
  }

  const squared = a ** 2
  console.log(`${a} squared is ${squared}`)
}

// ---
// Switch
// ---

const basicSwitch = () => {
  const colors = {
    red: 'red',
    yellow: 'yellow',
    blue: 'blue',
  }

  const color = 'red'
  let fruit

  switch (color) {
    case colors.red:
      fruit = 'strawberries'
      break;
    case colors.yellow:
      fruit = 'pineapple'
      break;
    case colors.blue:
      fruit = 'blueberries'
      break;
    default:
      throw new Error(`Color ${color} is not supported`)
  }

  console.log(`I like ${fruit}`)
}

// ---
// Looping
// ---

// for loop

const basicForLoop = () => {
  for (const i = 1; i <= 10; i++) {
    console.log(i)
  }
}

// while

const basicWhile = () => {
  let i = 1;
  while (i <= 10) {
    console.log(i)
    i++;
  }
}

// break (exit loop)

const basicBreak = () => {
  let value
  while (true) {
    value = Math.ceil(Math.random() * 10)
    console.log(value)
    if (value === 10) {
      break
    }
  }
}

// continue (skip to next iteration of loop)

const basiContinue = () => {
  for (var i = 1; i <= 10; i++) {
    if (i % 2 != 0) {
      continue
    }
    console.log(i)
  }
}

// do ... while (will always run at least once, even if condition isn't met.)

let i = 0;
do {
  console.log(i)
  i++;
} while (i < 10);


// for ... in ... loop

const basicForIn = () => {
  const ninjaMap = {
    '72f8a7bf-1f91-4ad9-b926-b312711ca495': 'Kakashi',
    '844f0a9c-ca31-42f5-a19a-dbb9f8b36962': 'Iruka',
    '1ba74f14-a665-4b44-b08d-6a0252501c02': 'Yamato'
  };

  for (const id in ninjaMap) {
    console.log(`${id} : ${ninjaMap[id]}`);
  }
}

// for ... of ... loop

const basicForOf = () => {
  const numbers = [1, 2, 3, 4, 5]

  for (const n in numbers) {
    console.log(n)
  }
}

// ---
// Functions
// ---

// function

function sayHello() {
  console.log('hello')
}

// params/args

function multiply(a, b) {
  return a * b
}

// defaults

function doSomething(verbose = false) {
  if (verbose) {
    console.log('Verbose')
  }
}

// rest

const sum = (...args) => {
  return args.reduce((accumulator, x) => accumulator + x);
};

// arrow

const add = (a, b) => {
  const sum = a + b;
  return sum;
};

const subtract = (a, b) => a - b;

// function expression

const square = function (x = 0) {
  const output = x * x;
  return output;
};

// ---
// Object with methods
// ---

const greetings = {
  hi: () => {
    console.log("Hi!");
  },
  hello: () => {
    console.log("Hello!");
  },
  helloPerson: (person) => {
    console.log(`Hello ${person}!`);
  },
};

greetings.helloPerson("Kakashi");

// IIFE (immediately invokable function expressions)

const basicIIFE = () => {
  const counter = (() => {
    // private value
    let count = 0;
    // public methods
    return {
      increment: (n = 1) => {
        count = count + n;
      },
      decrement: (n = 1) => {
        count = count - n;
      },
      getCount: () => {
        return count;
      },
      resetCount: () => {
        count = 0;
      },
    };
  })();

  console.log(counter.getCount());
  counter.increment(3);
  console.log(counter.getCount());
  counter.decrement(1);
  console.log(counter.getCount());
  counter.resetCount();
  console.log(counter.getCount());
}

// curry

const basicCurry = () => {
  const add = (a) => (b) => {
    return a + b;
  };

  // curried
  const sum = add(5)(3);
  console.log(sum);

  // partially applied
  const addThree = add(3);
  const sum2 = addThree(6);
  console.log(sum2);
}

// compose

const basicCompose = () => {
  const square = (n) => n ** 2;
  const double = (n) => 2 * n;
  const pipe = (f, g) => (a) => g(f(a));
  const squareDouble = pipe(square, double);
  const result = squareDouble(3);
  console.log(result); // double(square(3)) = 18
}

// recursion

const factorial = (n) => {
  if (n < 0) {
    throw new Error('Cannot get factorial of negative number')
  }
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
};

const basicRecursion = () => {
  const result = factorial(100)
  console.log('result', result);
}

// ---
// Error handling (try/catch/finally)
// ---

// try/catch/finally -- gracefully handle errors without stopping the script.

const basicErrorHandling = () => {
  const a = false
  const b = a ? [] : null

  try {
    console.log('Trying something that might fail')
    result = b.length // null has no property length
    console.log('Error above will prevent this line from executing')
  } catch (err) {
    console.log('Only executes if error was thrown')
    console.log(err)
  } finally {
    console.log('Always excuted')
  }
}

// ---
// Regular expressions (regex)
// ---

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

//

// ---
// Iterators/generators (ES6)
// ---

// iterator

const nameIterator = () => {
  let nextIndex = 0;

  return {
    next: function () {
      return nextIndex < names.length
        ? { value: names[nextindex++], done: false }
        : { done: true };
    },
  };
}

const basicIterator = () => {
  const namesArr = ["Jack", "Jill", "John"];
  const names = nameIterator(namesArr);

  console.log(names.next().value); // Jack
  console.log(names.next().value); // Jill
  console.log(names.next().value); // John
}

// generator example

function* sayNames() {
  yield "Jack";
  yield "Jill";
  yield "John";
}

const basicGenerator = () => {
  for (const name of sayNames()) {
    console.log(name) // Jack // Jill // John
  }
}

// ---
// Symbols
// ---

const basicSymbols = () => {
  // for ... in ... loops and JSON.stringify ignore symbols.

  // create a symbol
  const sym1 = Symbol();
  // symbol with identifier
  const sym2 = Symbol("sym2");
  // typeof -- symbol (primitive data type)
  console.log(typeof sym2);
  // symbols can't be the same
  console.log(Symbol() === Symbol()); // false (even if identifiers are the same)
  // symbol to string
  console.log(`Hello ${String(sym1)}`);
  console.log(`Hello ${sym1.toString()}`);

  // symbols -- unique object keys

  const KEY1 = Symbol();
  const KEY2 = Symbol("sym2");

  const myObj = {};
  // when using variables as a key, use bracket notation (not dot notation);
  // dot notation treats them as new properties.
  myObj[KEY1] = "Prop1";
  myObj[KEY2] = "Prop2";

  console.log(myObj[KEY1]); // Prop1
  console.log(myObj[KEY2]); // Prop2
}

// ---
// Maps (es6) (kinda like object literals)
// ---

const basicMaps = () => {
  // maps are key:value pairs, can use ANY type as key or value.

  // new map
  const map1 = new Map();
  // set keys
  const key1 = "some string"
  const key2 = {}
  const key3 = function () { }
  // set map values by key
  map1.set(key1, "Value of key1");
  map1.set(key2, "Value of key2");
  map1.set(key3, "Value of key3");
  // Value of key1, key2, key3
  console.log(map1.get(key1), map1.get(key2), map1.get(key3));
  // number of values in map
  console.log(map1.size);

  // iterating through map

  // loop using for ... of to get keys/values
  for (let [key, value] of map1) {
    consold.log(`${key} = ${value}`);
  }
  // loop using for ... of to get keys
  for (let key of map1.keys()) {
    consold.log(key);
  }
  // loop using for ... of to get values
  for (let value of map1.values()) {
    consold.log(value);
  }
  // forEach loops
  map1.forEach(function (key, value) {
    console.log(`${key} = ${value}`);
  });

  // convert map to array

  // create an array of the key/value pairs
  const keyValArr = Array.from(map1);
  consold.log(keyValArr);
  // create an array of the values
  const valArr = Array.from(map1.values());
  consold.log(valArr);
  // create an array of the keys
  const keyArr = Array.from(map1.keys());
  consold.log(keyArr);
}

// ---
// Sets
// ---

const basicSets = () => {
  // sets store unique values of any type
  // duplicates are ignored

  // Add values to set (method 1)
  const set1 = new Set();
  set1.add(100);
  set1.add("A string");
  set1.add({ name: "John" });
  set1.add(true);
  console.log(set1);

  // add values to set (method 2)
  const set2 = new Set([1, true, "string"]);
  console.log(set2);

  // size of set
  console.log(set1.size);

  // test for values
  console.log(set1.has(100)); // true
  console.log(set1.has(50 + 50)); // true
  console.log(set1.has({ name: "John" })); // false (because objects aren't primitive)

  // delete from set
  set1.delete(100);

  // iterating through sets

  // for ... of
  for (let item of set1) {
    console.log(item);
  }
  // forEach loop
  set1.forEach((value) => {
    console.log(value);
  });

  // convert set to array
  const setArr = Array.from(set1);
  console.log(setArr);
}

// ---
// Classes
// ---

class Person {
  constructor({ firstName, lastName }) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  introduce() {
    console.log(`Hello there! My name is ${this.firstName} ${this.lastName}.`);
  }
}
class Ninja extends Person {
  constructor({ firstName, lastName, village }) {
    super({ firstName, lastName }); // pass to parent constructor
    this.village = village;
  }
}

const basicClasses = () => {
  const kakashi = new Ninja({
    firstName: "Kakashi",
    lastName: "Hatake",
    village: "Hidden Leaf Village"
  });
  console.log(kakashi); // representation as object
  kakashi.introduce(); // use parent class method
}

basicClasses()

// ---
// Advanced javascript
// ---

// javascript
// - single threaded language
// - callback loop
// - interpreted language

// code
// - interpreted: read line by line and executed. faster to stand up, slower performance.
// - compiled: converted to machine code. slower to stand up, faster performance
// - JIT: TODO

// js engine
// - ECMAScript engines: must conform to ECMA language standard.
// -- v8 engine (nodejs, chrome): fastest, compliles to machine code
// -- spidermonkey (firefox): slower, compiles to byte code (original js engine)

// v8 flow
// - parser --> AST --> interpreter --> bytecode
// - parser --> AST --> interpreter --> profiler --> compiler --> optimized code

// runtime
// - web API: native to browser, not JS. (DOM, requests (fetch), setTimeout)
// - memory heap: where memory is allocated
// - call stack: where code is in its execution
// -- LIFO mode (last in, first out)
// - event loop
// - callback queue
// - job queue: like callback queue but for promises. has higher priority.

// async
// - call stack: LIFO mode (normal operations)
// - async event initiated -- put on job/callback queue (job queue if promises are involved)
// - once call stack is clear, event loop checks for (ready) job/callback queue items
// - those job/callback queue items will be returned to call stack.

// ---
// Scope and hosting
// ---

// global scope
// - not in a function (closure)
// - accessible anywhere
// local scope
// - in a function
// - accessible only from that function
// nested scope
// - nested functions and their associated local scopes.
// block scope
// - let & const, if defined in a block, are limited to that scope
// - var does not support block scope

// lexical scope model
// - capturing free variables into lexical environments. implemented by closures

// static scope (lexical scope)
// - available data + variables where the function was defined
// - write time
// dynamic scope
// - available data + variables where the function is called.
// - run time
// - 'this' is dynamically scoped

// hoisting
// - moving declarations to the top of their environments (during compilation)
// - var -- partially hoisted
// -- declaration is hoisted, not the initialization. memory is allocated.
// -- returns undefined if used before initizlization.
// - function -- fully hoisted (doesn't work for function expressions)
// - let, const -- not hoisted

// bubbling
// - look for variable in scope

// ---
// Functions
// ---

// expression
// - defined at runtime
// declaration
// - defined at parse time

// invocation/call/execution
// - creates execution context
// - gets 'this' keyword
// - gets 'arguments' keyword. (don't use these, it slows down compiler)

// ---
// Context vs scope
// ---

// context -- value of 'this'. determined by how a function is invoked
// scope -- visibility of variales
