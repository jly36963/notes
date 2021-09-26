// ---
// advanced javascript
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
// arrow func
// ---

// regular
function add(a, b) {
  return a + b;
}

// arrow (with statements)
const add = (a, b) => {
  const sum = a + b;
  console.log(sum);
  return sum;
};

// arrow (return expression)
const add = (a, b) => a + b;

// ---
// advanced functions
// ---

// closure & IIFE

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

// curried functions
// function that accepts an argument and returns a function ... returns a function that uses all inputs.

const add = (a) => (b) => {
  return a + b;
};
const sum = add(5)(3);
console.log(sum);

const addThree = add(3);
const sum2 = addThree(6);
console.log(sum2);

// compose

const square = (n) => n ** 2;
const double = (n) => 2 * n;
const pipe = (f, g) => (a) => g(f(a));
const squareDouble = pipe(square, double);
const result = squareDouble(3);
console.log(result); // double(square(3)) = 18

// rest parameters

const sum = (...args) => {
  return args.reduce((accumulator, x) => accumulator + x);
};
sum(1, 2, 3);

// default parameters

const funcOnTwo = (a = 1, b = 1, func = (a, b) => a + b) => func(a, b);
funcOnTwo();
funcOnTwo(3, 4, (a, b) => a - b);

// ---
// advanced arrays
// ---

const arr1 = [1, 2, 3, 4];
// forEach
// do something for each element in the array
const arr2 = [];
arr1.forEach((x) => arr2.push(x * 2));
console.log(arr2);
// map
// return a modified version of each element
const arr3 = arr1.map((x) => x * 2);
console.log(arr3);
// filter
// return elements where condtion is true
const arr4 = arr1.filter((x) => x % 2 == 0);
console.log(arr4);
// reduce
// reduce elements to one using a function
const makeSum = (accumulator, x) => accumulator + x;
const sum = arr1.reduce(makeSum);
console.log(sum);

// ---
// advanced objects
// ---

// object equivalency

const obj1 = {};
// same values, but not same address in memory
let obj2 = {}; // obj1 === obj2 // false
// same address in memory
// they reference the same object. changing keys in one will affect both.
obj2 = obj1; // obj1 === obj2 // true
// create new object with same values (spread operator)
obj2 = { ...obj1 }; // obj1 === obj2 // false

// object looping

const obj1 = {
  a: 1,
  b: 2,
  c: 3,
};
// forEach
Object.keys(obj1).forEach((k) => {
  console.log(`k: ${k}, v: ${obj1[k]}`);
});
// for ... in (enumerate over keys of object)
for (const k in obj1) {
  console.log(`k: ${k}, v: ${obj1[k]}`);
}
// for ... of (iterate over array of entries)
for (let [k, v] of Object.entries(obj1)) {
  console.log(`k: ${k}, v: ${v}`);
}

// ---
// async
// ---

// async await

import axios from "axios";

const getData = async (url) => {
  try {
    const apiResponse = await axios.get(url);
    const { data } = apiResponse;
    return { data, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: err.message };
  }
};

const response = getData("/some/api/endpoint");
console.log(response);

// ---
// parallelism
// ---

// libuv
// web worker -- javascript program running on a different thread (not main thread)
// spawn & child_process

// ---
// classes
// ---

class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  introduce() {
    console.log(`Hello there! My name is ${this.firstName} ${this.lastName}.`);
  }
}
class Ninja extends Person {
  constructor(firstName, lastName, village) {
    super(firstName, lastName); // pass to parent constructor
    this.village = village;
  }
}
const kakashi = new Ninja("Kakashi", "Hatake", "Hidden Leaf Village");
console.log(kakashi); // representation as object
kakashi.introduce(); // use parent class method

// ---
// scope and hosting
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
// functions
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
// context vs scope
// ---

// context -- value of 'this'. determined by how a function is invoked
// scope -- visibility of variales

// ---
// this
// ---

// this -- the object that the function is a property of

const obj1 = {
  // value
  name: "Landon",
  // function using value
  greet() {
    return `Hi! I'm ${this.name}.`;
  },
  // broken -- arrow functions don't bind 'this'
  brokenGreet: () => {
    return `Hi! I'm ${this.name}.`;
  },
};

// ---
// call, apply, bind
// ---

kakashi = {
  name: "Kakashi",
  health: 50,
  maxHealth: 100,
  heal() {
    this.health = this.maxHealth;
  },
  increaseMaxHealth(x) {
    this.maxHealth += x;
  },
};
yamato = {
  name: "Yamato",
  health: 60,
  maxHealth: 80,
};
iruka = {
  name: "Iruka",
  health: 40,
  maxHealth: 70,
};

// call

kakashi.increaseMaxHealth.call(yamato, 10); // arg1: which object for 'this', ...args: arguments
kakashi.heal.call(yamato);
console.log(yamato); // 'yamato', 90, 90

// bind ( used in react class components -- https://reactjs.org/docs/handling-events.html )

const healIruka = kakashi.heal.bind(iruka);
healIruka();
console.log(iruka);

// this + arrow function

const person = {
  name: "Landon",
  say() {
    return () => console.log(this); // no 'this' bound
  },
  sayWindow() {
    return function () {
      console.log(this); // 'this' is bound to window
    };
  },
};
person.say()(); // person
person.sayWindow()(); // window

// ---
// cloning objects
// ---

const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = Object.assign({}, obj1); // assign (shallow)
const obj3 = { ...obj1 }; // spread operator (shallow)
const obj4 = JSON.parse(JSON.stringify(obj1)); // JSON (deep) (might cause performance issues)

// ---
// prototypal inheritance
// ---

// __proto__ -- object used in lookup chain to resolve methods
// __proto__ -- pointer up the chain to prototype: {...}
// *** DEPRECATED ***
const jonin = {
  name: "Kakashi",
  fireballJutsu: function () {
    return "fireball";
  },
};
const chunin = {
  name: "Iruka",
};
chunin.__proto__ = jonin;
chunin.fireballJutsu();

// ---
//
// ---
