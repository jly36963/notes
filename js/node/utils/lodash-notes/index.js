// ---
// lodash
// ---

// docs
// https://lodash.com/docs/

const {
  chunk,
  compact,
  concat,
  difference,
  find,
  findIndex,
  flattenDeep,
  each,
  intersection,
  join,
  nth,
  pull,
  pullAll,
  pullAllWith,
  matches,
  reduce,
  reverse,
  slice,
  sortedUniq,
  sortedUniqBy,
  times,
  union,
  uniq,
  uniqBy,
  without,
  xor,
  assign,
  cloneDeep,
  get,
  has,
  keys,
  pick,
  set,
  unset,
  camelCase,
  capitalize,
  deburr,
  endsWith,
  escape,
  kebabCase,
  lowerCase,
  pad,
  parseInt,
  replace,
  snakeCase,
  split,
  startCase,
  startsWith,
  template,
  toLower,
  toUpper,
  trim,
  upperCase,
  upperFirst,
  debounce,
} = require("lodash");

// ---
// array
// ---

// MUTATES
// pull, pullAll, pullAllWith

chunk([1, 2, 3, 4], 2); // [[1,2],[3,4]] // split into groups of specified max size
compact([1, 2, null, 4, null, 6]); // [1,2,4,6] // remove falsey values
concat([1, 2], [3, 4]); // [1,2,3,4] // concatenate
difference([1, 2, 3, 4], [1, 3]); // [2,4] // remove elements from source array
find(
  [{ name: "Kakashi" }, { name: "Yamato" }], // array to search
  { name: "Kakashi" }, // criteria to search by (properties, conditions, etc)
  // returns the first matching element
);
findIndex(
  [{ name: "Kakashi" }, { name: "Yamato" }], // array to search
  { name: "Kakashi" }, // criteria to search by (properties, conditions, etc)
  // returns the index of first matching element
);
flattenDeep([1, 2], [3, 4]); // flatten multidimensional array to single level (recursively)
each(
  [1, 2, 3], // array to iterate over
  (n, i, numbers) => console.log(n), // iterating function (current element, index, whole array)
);
intersection([2, 1], [2, 3]); // [2] // common elements
join([1, 2, 3, 4], ", "); // '1, 2, 3, 4' // return array as string with provided delimiter
nth([1, 2, 3, 4], -1); // 4 // return nth element (negative behaves like python's negative indices)
pull([1, 2, 3, 4], 2, 3); // [1,4] // remove specified elements // *** MUTATES ***
pullAll([1, 2, 3, 4], [2, 3]); // [1,4] // remove specified elements // *** MUTATES ***
pullAllWith(
  [
    { firstName: "Kakashi", lastName: "Hatake" },
    { firstName: "Tenzo", lastName: "Yamato" },
  ], // array
  { firstName: "Tenzo" }, // values
  matches, // comparator
  // removes elements that meet condition
);
reduce(
  [1, 2, 3, 4, 5], // array to reduce
  (result, n) => result + n, // reducing function
  0, // starting value for result (choose the form of the result object)
);
reverse([1, 2, 3]); // [3,2,1] // reverses order of array
slice([1, 2, 3, 4, 5], 1, 4); // [2,3,4] // grab slice of array
sortedUniq([1, 1, 2, 3, 3, 3, 5, 8, 8]); // return sorted array with distinct values
sortedUniqBy(
  [{ id: 1 }, { id: 2 }, { id: 2 }, { id: 3 }], // array
  (x) => x.id, // func to sort and find unique by
);
times(5, () => Math.round(Math.random() * 100)); // create array of 5 random numbers
union([2], [1, 2]); // [2, 1] // unique elements
uniq([2, 1, 2]); // [2, 1] // unique elements
uniqBy(
  [{ id: 1 }, { id: 2 }, { id: 2 }, { id: 3 }], // array
  (x) => x.id, // func to find unique by
);
without([1, 2, 3, 4], 2, 3); // [1,4] // removes values
xor([1, 2, 3], [3, 4, 5]); // [1,2,4,5] // elements in either but not both

// ---
// object
// ---

// MUTATES
// set, unset

assign(
  { firstName: "Kakashi" }, // source object
  { lastname: "Hatake" }, // properties to add/overwrite
);
cloneDeep({ firstName: "Kakashi" }); // return a new deep copy of object (new address in memory))
get(
  { firstName: "Kakashi" }, // object to search
  "firstName", // key to get value for
);
has(
  { name: "Kakashi" }, // object to search
  "name", // key, path, array of keys // 'name', 'name.first', ['firstName', 'lastname']
);
keys({ firstName: "Itachi", lastName: "Uchiha" }); // returns keys
pick(
  { firstName: "Itachi", lastName: "Uchiha" }, // object
  ["firstName"], // keys to keep
);
set(
  { firstName: "Kakashi" }, // object
  "lastname", // key to set // can be a path. ie -- "posts[0].comments[3]"
  "Hatake", // value to set
);
unset(
  { firstName: "Itachi", lastName: "Uchiha" }, // object
  "lastName", // key or path to remove
);

// ---
// string
// ---

camelCase("foo_bar"); // 'fooBar'
capitalize("HELLO"); // 'Hello' // first to upper, rest to lower
deburr("déjà vu"); // 'deja vu' // remove combining diacritical marks
endsWith("Itachi", "i"); // true
escape("<div></div>"); // &lt;div&gt;&lt;/div&gt; // chars --> HTML entities // undo with 'unescape'
kebabCase("Kakashi Hatake"); // kakashi-hatake
lowerCase("fooBar"); // fohttps://lodash.com/docs/o bar // convert camel, kebab, etc to lower case
pad("Kakashi", 10); // ' Kakashi  ' // pad with character (default ' '). also padStart/padEnd
parseInt("08"); // 8
replace("Hey there, Kakashi!", "Kakashi", "Kaka sensei"); // 'Hey there, Kaka sensei!'
snakeCase("fooBar"); // foo_bar
split("1,2,3,4,5", ","); // [1,2,3,4,5] // split by delimiter (default ' ')
startCase("fooBar"); // 'Foo Bar'
startsWith("Yamato", "Y"); // true
// template("Hello <%= person =%>")({ person: "Kakashi" }); // 'Hello Kakashi"
toLower("HELLO-THERE"); // 'hello-there'
toUpper("hello-there"); // 'HELLO-THERE'
trim("  Hiruzen  "); // "Hiruzen" // also trimEnd/trimStart
upperCase("Iruka"); // "IRUKA"
upperFirst("iruka"); // "Iruka" // first to uppercase

// ---
// collection
// ---

// TODO

// ---
// function
// ---

debounce(() => console.log("Hi"), 500); // wait 500ms between each invoking

// ---
// math / number
// ---

// TODO

// ---
// seq
// ---

// TODO
