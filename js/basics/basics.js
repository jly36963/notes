// ---
// JAVASCRIPT
// ---

// ---
// variables
// ---

// variable names can only contain A-z, 0-9, _, $, cannot start with number.

// var
// - can be reassigned.
// - can be re-initialized
// - no block scope
var name = "john doe";
// let
// - can be reassigned
// - can't be re-initialized
// - yes block scope
let name = "john doe";
// const
// - can't be reassigned.
// - can't be re-intialized
// - yes block scope
const name = "john doe";

// ---
// scope
// ---

// global variable
// function variable
// block variable

// ---
// data types
// ---

// PRIMITIVE
// string
const name = "John Doe";
// number
const age = 25;
// boolean
const hasKids = true;
// null
const car = null;
// undefined
let birthDate;
// symbol
const sym = Symbol();

// REFERENCE
// array
const numbers = [1, 2, 3, 4, 5];
// object literal
let landon = { name: "Landon", city: "Albuquerque", age: 25 };
// date
`const today = new Date();``const birthday = new Date('May 19 1992');`;

// To find data type, use `console.log(typeof variableName);`

// ---
// comparison operators
// ---

/*

=== // identical to
!== // not identical to
<  // less than
> // greater than
<= // less than or equal to
>= // greater than or equal to

*/

// ---
// arithmetic operators
// ---

/* 

+ // add
- // subtract
* // multiply
/ // divide (5/2 returns 2.5)
% // modulus (remainder)
++ // increment
-- // decrement

*/

// ---
// Math object
// ---

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

// ---
// assignment operators
// ---

/* 

=
+=
-=
*=
/=
%=

*/

// ---
// logical operators -- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators#Logical_AND_()
// ---

if (x < 10 && y > 1) {
  // do something
} // and
if (x === 5 || y === 5) {
  // do something
} // or
if (!(x === y)) {
  // do something
} // not

// ---
// number methods
// ---

const x = "5";
const n = 2;
// string -> float (if needed), round to 'n' decimal places, return as string
Number.parseFloat(x).toFixed(2);

// ---
// string methods
// ---

str1.concat(str2); // concatenate 2 strings.
str4 = str1.concat(str2, str3); // concatenate 3 strings.
str3 = str1 + " " + str2; // concatenates strings (with space between).
str1 += str2; // concatenates str2 to the end of str1. (mutates str1)
str1.replace("something", "something else"); // replace first instance
str1.replace(/something/g, "something else"); // global replace.
obj1.toString(); // return object as string
str1.trim(); // removes whitespace from both ends of a string.

// ---
// arrays
// ---

// create array
const num = [1, 2, 3, 4, 5];
const num2 = new Array(1, 2, 3, 4, 5);
const mix = [22, "Hello", true, undefined, null, { a: 1, b: 1 }, new Date()];

// get single value
let val = num[3];
// change single value
num[3] = 100;

// ---
// array properties
// ---

// length -- sets/returns the number of elements in an array.
// constructor-- returns function that created the Array object's prototype.
// prototype -- allows for the addition of properties/methods to an Array object.

// ---
// array methods
// ---

// concat
arr1.concat(arr2); // joins 2+ arrays, returns copy of joined array.
// iterative
arr1.filter((x) => x > 4); // creates new array with each element that passes a test.
arr1.find((x) => x > 4); // return first element that matches condition. (undefined if none)
arr1.forEach((x) => console.log(x)); // calls a function for each array element.
arr1.forEach((x, i) => console.log(`${i}: ${x}`)); // forEach using index
arr1.map((x) => `<div>${x}</div>`); // return a copy of an array with each element transformed
arr1.every((x) => x > 3); // return true if all elements meet condition
arr1
  .some((x) => x > 3) // return true if any elements meet condition
  [
    // search
    ("a", "b", "c")
  ].includes("a") // checks if an array contains specified element.
  [("a", "b", "c")].indexOf("a"); // returns index value of the specified element.
// join
arr1.join(", "); // joins elements of array into a string.
// change (mutate)
const last = arr1.pop(); // removes last element of an array, returns that element. (mutates)
const secondToLast = arr1.shift(); // removes first element of an array, returns new array.
arr1.push("new element"); // adds new element to the end of an array, returns new length.
arr1.unshift("new element"); // adds new elements to the beginning of an array, returns new length.
arr1.sort(); // sorts elements of an array. (mutates)
arr1.sort((a, b) => a - b); // sort using comparison function (sort by negative/positive output)
arr1.reverse(); // reverse order of array.
arr1.splice(1, 0, "new element"); // insert new element before index 1, delete none. return array of deleted elements
// change (non-mutate)
arr1.slice(2); // returns arr1[2:]
arr1.slice(2, 4); // returns arr1[2:4]
arr1.slice(-3); // returns arr1[-3:]
arr1.slice(-1000, 1000); // returns arr1[:] (if indices provided are outside of index range)

// ---
// recursion + memoization
// ---

// function -- memoize a callback
const memoize = (callback) => {
  let memo = {};
  return (...args) => {
    // used cached result
    if (memo[args]) {
      return memo[args];
    } else {
      // calculate result, store in cache
      memo[args] = callback(args);
      return memo[args];
    }
  };
};
// function -- find factorial (recursive)
const factorial = (n) => {
  if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
};
// memoize the recursive factorial function
const memoizedFactorial = memoize(factorial);
// run memoized function
console.log(`1000! is ${memoizedFactorial(1000)}`);

// ---
// objects
// ---

// create object literal
const kakashi = {
  firstName: "Kakashi",
  lastName: "Hatake",
  age: 27,
  state: "Konoha",
  hobbies: ["sports", "teaching", "survivor"],
  greet: () => `Hello! My name is ${this.firstName}!`,
};

// access value from object literal
let val;
val = kakashi.lastName;
val = kakashi.greet();

// iterate through objects (one object in this case)
const people = [kakashi];
for (let i = 0; i < people.length; i++) {
  console.log(people[i].name);
}

// ---
// template literals
// ---

// with template literals (template strings) (es6)
// - use backticks, not quotes, for template literals.
// - variables, expressions, ternary operators, and functions can be used inside the brackets.

const name = "Kakashi";
const greeting = `Hello! My name is ${name}!`;

// ---
// conditionals, logic, and loops
// ---

// conditional statements

if (condition) {
  // run this code
} else if (condition) {
  // run this code
} else if (condition) {
  // run this code
} else {
  // run this code if nothing else worked
}

// undefined?

let id;
if (typeof id !== "undefined") {
  console.log(`The ID is ${id}`);
} else {
  console.log("No ID");
}

// nesting if...else statements

if (condition) {
  if (condition) {
    // run code 1a
  } else if (condition) {
    // run code 1b
  }
} else if (condition) {
  if (condition) {
    // run code 2a
  } else if (condition) {
    // run code 2b
  }
}

// ---
// logical operators
// ---

// `&&` conditions chained together must all be true.
// `||` at least one of the conditions chained together must be true.
// `(!(condition))` negates condition

if (condition1 && condition2) {
  // run this code
} else if (condition1 && condition3) {
  // run this code
}

if (condition1 || condition2 || condition3) {
  // run this code
}

if (!condition) {
  // run this code
}

// ---
// switch
// ---

switch (expression) {
  case "value1":
    // run this code
    break;
  case "value2":
    // run this code
    break;
  case "value3":
  // run this code
  default:
  // run this code if no cases match
}

// ---
// ternary operator
// ---

// (condition) ? if true : if false

var x = 5;
var response = x === 0 ? "x is 0!" : "x is not 0!";
console.log(response);

// ---
// for loop
// ---

var info = "I can count from 1 to 10! ";
for (var i = 1; i <= 10; i++) {
  info += i.toString();
  if (i < 10) {
    info += ", ";
  } else if (i === 10) {
    info += ".";
  }
}
console.log(info);

// break (exit loop)

for (var i = 0; i < 10; i++) {
  // run code
  if (condition) {
    break;
  } else {
    // more code
  }
}

// continue (skip to next iteration of loop)

for (var i = 1; i <= 100; i++) {
  // run code
  if (!condition) {
    continue;
  }
}

// ---
// while loop
// ---

let i = 1;
while (i < 100) {
  // run code
  i++;
}

// do ... while (will always run at least once, even if condition isn't met.)

let i = 0;
do {
  // run code
  i++;
} while (i < 100);

// ---
// forEach (array looping)
// ---

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
numbers.forEach((num) => {
  console.log(num);
});

// map (passes all elements from one array into a function and creates a new array)

const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Sara" },
  { id: 3, name: "Karen" },
  { id: 4, name: "Steve" },
];

const ids = users.map((user) => console.log(`name: ${user.name}`));

// for ... in ... loops (mostly used for objects)

const user = {
  firstName: "John",
  lastName: "Doe",
  age: 40,
};

for (let x in user) {
  console.log(`${x} : ${user[x]}`);
}

// ---
// functions
// ---

// normal function syntax

function myFunction(a) {
  const phrase = `Argument passed in: ${a}`;
  return phrase;
}

const didItWork = myFunction("hello!");
console.log(didItWork);

// ---
// function parameters, arguments, defaults
// ---

function greet(firstName = "John", lastName = "Doe") {
  const first = firstName;
  const last = lastName;
  const greeting = `Hello ${first} ${last}!`;
  return greeting;
}

console.log(greet("Landon", "Yarrington"));

// ---
// arrow functions
// ---

const add = (a, b) => {
  const sum = a + b;
  return sum;
};

const subtract = (a, b) => a - b; // concise syntax

console.log(add(4, 5));
console.log(subtract(5, 4));

// ---
// function expression (using anonymous functions)
// ---

const square = function (x = 0) {
  const output = x * x;
  return output;
};

console.log(square());

// ---
// IIFE (immediately invokable function expressions)
// ---

const model = (() => {
  const number = 0;
  return {
    increaseNumber: () => {
      number = number + 1;
    },
  };
})();

// ---
// object with methods
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

// ---
// ES6 OBJECT DESTRUCTURING
// ---

const person = {
  name: "Kakashi",
  age: 26,
  location: {
    state: "Konoha",
  },
};

const { name, age } = person; // const name = person.name; const age = person.age;
const { state } = person.location;
const { name: firstName, age } = person; // const firstName = person.name;
const { name = "Anonymous", age } = person; // default value

// ---
// ES6 ARRAY DESTRUCTURING
// ---

const address = [
  "1299 S Juniper Street",
  "Philadelhia",
  "Pennsylvania",
  "19147",
];
console.log(`You are in ${address[1]} , ${address[2]}.`);
const [street, city, state, zip] = address; // assigns by position
const [, city, state] = address; // skips [0] and [4]

// ---
// ES6 SPREAD OPERATOR (ARRAY)
// ---

const names = ["Kakashi", "Iruka", "Konohamaru"];
const names2 = [...names];
const names3 = ["Itachi", ...names, "Hiruzen"];

// ---
// ES6 SPREAD OPERATOR (OBJECT)
// ---

// babel-plugin-transform-object-rest-spread

const user = {
  name: "Kakashi",
  city: "Philadelphia",
  age: 26,
};

console.log({
  ...user,
  age: 27,
}); // overrides
console.log({
  age: 27,
  ...user,
}); // doesn't override

// ---
// error handling (try/catch/finally)
// ---

// try/catch/finally -- gracefully handle errors without stopping the script.

try {
  const apiResponse = await axios.post("/api/add-user", { user });
  const { data: user, error } = apiResponse.data;
  if (error) {
    console.log(error);
    return;
  }
  return user;
} catch (err) {
  console.log(err.message); // properties (name, message)
} finally {
  console.log("try / catch complete"); // will always execute
}

// ---
// throw error
// ---

// client

try {
  const apiResponse = await axios.post("/api/add-user", { user });
  const { data: user, error } = apiResponse.data;
  if (error) {
    console.log(error);
    return;
  }
  return user;
} catch (err) {
  console.log(err.message); // properties (name, message)
} finally {
  console.log("try / catch complete"); // will always execute
}

// backend

const { user } = req.body;
if (!user.name) throw "User is missing 'name' property";

// ---
// regular expressions (regex)
// ---

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

//

// ---
// iterators/generators (ES6)
// ---

// iterator

function nameIterator() {
  let nextIndex = 0;

  return {
    next: function () {
      return nextIndex < names.length
        ? { value: names[nextindex++], done: false }
        : { done: true };
    },
  };
}

// create an array of names
const namesArr = ["Jack", "Jill", "John"];
// Init iterator and pass in the names array
const names = nameIterator(namesArr);

console.log(names.next().value); // Jack
console.log(names.next().value); // Jill
console.log(names.next().value); // John

// generator example

function* sayNames() {
  yield "Jack";
  yield "Jill";
  yield "John";
}

const names = sayNames;

console.log(names.next().value); // Jack
console.log(names.next().value); // Jill
console.log(names.next().value); // John

// ---
// ID Generator
// ---

function* createIds() {
  let index = 1;

  while (true) {
    yield index++;
  }
}

const gen = createIds();

console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
console.log(gen.next().value); // 4
console.log(gen.next().value); // 5

// ---
// symbols
// ---

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

// ---
// destructuring (ES6)
// ---

// destructuring assignment
let a, b;
[a, b] = [100, 200];
console.log(a); // 100

// rest pattern (array)
const [a, b, ...rest] = [100, 200, 300, 400, 500]; // rest = 300, 400, 500

// rest pattern (object)
({ a, b } = { a: 100, b: 200, c: 300, d: 400, e: 500 });
({ a, b, ...rest } = { a: 100, b: 200, c: 300, d: 400, e: 500 });

// array destructuring
const people = ["John", "Beth", "Mike"];
const [person1, person2, person3] = people;
console.log(person1, person2, person3); // John Beth Mike

function getPeople() {
  return ["John", "Beth", "Mike"];
}

let person1, person2, person3;
[person1, person2, person3] = getPeople();

// object destructuring
const person = {
  name: "John Doe",
  age: 32,
  city: "Miami",
  gender: "Male",
  sayHello: function () {
    console.log("Hello");
  },
};

// Old ES5 Way
const name = person.name,
  age = person.age,
  city = person.city;

// New ES6 Way
const { name, age, city, sayHello } = person;
console.log(name, age, city);
sayHello();

// ---
// maps (es6) (kinda like object literals)
// ---

// maps are key:value pairs, can use ANY type as key or value.

// new map
const map1 = new Map();
// set keys
const key1 = "some string",
  key2 = {},
  key3 = function () {};
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

// ---
// sets
// ---

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

// ---
//
// ---
