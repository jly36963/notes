// ---
// one liners
// ---

// https://1loc.dev/

// ---
// array
// ---

// Check if every element meets condition
const allMeet = (arr, condition) => arr.every((item) => condition(item));
allMeet([1, 2, 3, 4, 5], (x) => x < 10);

// Check if an array contains a value matching some criterias
const contains = (arr, condition) => arr.some((v) => condition(v));
contains([1, 2, 3, 4, 5], (x) => x < 10);

// Check if an object is an array
const isArray = (obj) => Array.isArray(obj);

// clone array
const clone = (arr) => [...arr]; // shallow
const clone = (arr) => JSON.parse(JSON.stringify(arr)); // deep (might use a lot of memory)

// compare arrays for equality
const isEqual = (a, b) =>
  a.length === b.length && a.every((v, i) => v === b[i]); // shallow
const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b); // deep (may cause memory issues)

// create a range of numbers (array)
const range = (min, max) =>
  [...Array(max - min + 1).keys()].map((i) => i + min);

// max & min of array
const max = (arr) => Math.max(...arr);
const min = (arr) => Math.min(...arr);

// flatten array
const flat = (arr) =>
  arr.reduce((a, b) => (Array.isArray(b) ? [...a, ...flat(b)] : [...a, b]), []);

// get random item from array
const randomItem = (arr) => arr[(Math.random() * arr.length) | 0];

// sum
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

// mean
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

// intersection of two arrays
const getIntersection = (a, b) => [...new Set(a)].filter((v) => b.includes(v));

// unique values in array
const unique = (arr) => [...new Set(arr)];

// union of many arrays
const union = (...arr) => [...new Set(arr.flat())];

// merge arrays
const merge = (a, b) => [...a, ...b]; // keep duplicates
const merge = (a, b) => [...new Set([...a, ...b])]; // remove duplicates

// partition array by condition
const partition = (arr, condition) =>
  arr.reduce((acc, i) => (acc[condition(i) ? 0 : 1].push(i), acc), [[], []]);
partition([1, 2, 3, 4, 5], (n) => n % 2);

// ---
// numbers
// ---

// sum of arguments
const sum = (...args) => args.reduce((a, b) => a + b);

// mean of arguments
const mean = (...args) => args.reduce((a, b) => a + b) / args.length;

// product of arguments
const product = (...args) => args.reduce((a, b) => a * b);

// clamp number between two values (force within bounds)
const clamp = (val, min = 0, max = 1) => Math.max(min, Math.min(max, val));

// gcd
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

// random float in given range
const randomFloat = (min, max) => Math.random() * (max - min) + min;

// random integer in a given range
const randomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ---
// objects
// ---

// check if plain object
const isPlainObject = (v) =>
  !!v &&
  typeof v === "object" &&
  (v.__proto__ === null || v.__proto__ === Object.prototype);

// check if object is empty
const isEmpty = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

// copy object
const clone = (obj) => ({ ...obj }); // shallow
const clone = (obj) => JSON.parse(JSON.stringify(obj)); // deep (might use a lot of memory)

// ---
// string
// ---

// check string
const isNumeric = (str) => !/[^0-9]/.test(str); // only digits
const containsWhitespace = (str) => (str) => /\s/.test(str); // contains whitespace
const isLowerCase = (str) => str === str.toLowerCase(); // only lowercase
const isUpperCase = (str) => str === str.toUpperCase(); // only uppercase
const slugify = (string) =>
  string
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, ""); // slug || kebab case

// get file extension
const ext = (fileName) => fileName.split(".").pop(); // only one '.' allowed

// get filename of given url
const fileName = (url) => url.substring(url.lastIndexOf("/") + 1);

// remove spaces from string
const removeSpaces = (str) => str.replace(/\s/g, "");

// repeat string
const repeat = (str, numberOfTimes) => str.repeat(numberOfTimes);

// replace multiple spaces with one space
const replaceOnlySpaces = (str) => str.replace(/  +/g, " "); // spaces only
const replaceSpaces = (str) => str.replace(/\s\s+/g, " "); // spaces, tabs, newlines

// reverse string
const reverse = (str) => [...str].reverse().join("");

// uppercase first letter of any word
const uppercaseWords = (str) =>
  str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
