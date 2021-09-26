// ------------
// lodash
// ------------

// docs
// https://lodash.com/docs/

// install
`
npm i --save lodash
`;

// ------------
// array
// ------------

// MUTATES
// pull, pullAll, pullAllWith

_.chunk([1, 2, 3, 4], 2); // [[1,2],[3,4]] // split into groups of specified max size
_.compact([1, 2, null, 4, null, 6]); // [1,2,4,6] // remove falsey values
_.concat([1, 2], [3, 4]); // [1,2,3,4] // concatenate
_.difference([1, 2, 3, 4], [1, 3]); // [2,4] // remove elements from source array
_.find(
  [{ name: "Kakashi" }, { name: "Yamato" }], // array to search
  { name: "Kakashi" } // criteria to search by (properties, conditions, etc)
  // returns the first matching element
);
_.findIndex(
  [{ name: "Kakashi" }, { name: "Yamato" }], // array to search
  { name: "Kakashi" } // criteria to search by (properties, conditions, etc)
  // returns the index of first matching element
);
_.flattenDeep([1, 2], [3, 4]); // flatten multidimensional array to single level (recursively)
_.each(
  [1, 2, 3], // array to iterate over
  (n, i, numbers) => console.log(n) // iterating function (current element, index, whole array)
);
_.intersection([2, 1], [2, 3]); // [2] // common elements
_.join([1, 2, 3, 4], ", "); // '1, 2, 3, 4' // return array as string with provided delimiter
_.nth([1, 2, 3, 4], -1); // 4 // return nth element (negative behaves like python's negative indices)
_.pull([1, 2, 3, 4], 2, 3); // [1,4] // remove specified elements // *** MUTATES ***
_.pullAll([1, 2, 3, 4], [2, 3]); // [1,4] // remove specified elements
_.pullAllWith(
  [
    { firstName: "Kakashi", lastName: "Hatake" },
    { firstName: "Tenzo", lastName: "Yamato" },
  ], // array
  { firstName: "Tenzo" }, // values
  _.matches // comparator
  // removes elements that meet condition
);
_.reduce(
  [1, 2, 3, 4, 5], // array to reduce
  (result, n) => result + n, // reducing function
  0 // starting value for result (choose the form of the result object)
);
_.reverse([1, 2, 3]); // [3,2,1] // reverses order of array
_.slice([1, 2, 3, 4, 5], 1, 4); // [2,3,4] // grab slice of array
_.sortedUniq([1, 1, 2, 3, 3, 3, 5, 8, 8]); // return sorted array with distinct values
_.sortedUniqBy(
  [{ id: 1 }, { id: 2 }, { id: 2 }, { id: 3 }], // array
  (x) => x.id // func to sort and find unique by
);
_.times(5, () => Math.round(Math.random() * 100)); // create array of 5 random numbers
_.union([2], [1, 2]); // [2, 1] // unique elements
_.uniq([2, 1, 2]); // [2, 1] // unique elements
_.uniqBy(
  [{ id: 1 }, { id: 2 }, { id: 2 }, { id: 3 }], // array
  (x) => x.id // func to find unique by
);
_.without([1, 2, 3, 4], 2, 3); // [1,4] // removes values
_.xor([1, 2, 3], [3, 4, 5]); // [1,2,4,5] // elements in either but not both

// ------------
// object
// ------------

// MUTATES
// set, unset

_.assign(
  { firstName: "Kakashi" }, // source object
  { lastname: "Hatake" } // properties to add/overwrite
);
_.cloneDeep({ firstName: "Kakashi" }); // return a new deep copy of object (new address in memory))
_.get(
  { firstName: "Kakashi" }, // object to search
  "firstName" // key to get value for
);
_.has(
  { name: "Kakashi" }, // object to search
  "name" // key, path, array of keys // 'name', 'name.first', ['firstName', 'lastname']
);
_.keys({ firstName: "Itachi", lastName: "Uchiha" }); // returns keys
_.pick(
  { firstName: "Itachi", lastName: "Uchiha" }, // object
  ["firstName"] // keys to keep
);
_.set(
  { firstName: "Kakashi" }, // object
  "lastname", // key to set // can be a path. ie -- "posts[0].comments[3]"
  "Hatake" // value to set
);
_.unset(
  { firstName: "Itachi", lastName: "Uchiha" }, // object
  "lastName" // key or path to remove
);

// ------------
// string
// ------------

_.camelCase("foo_bar"); // 'fooBar'
_.capitalize("HELLO"); // 'Hello' // first to upper, rest to lower
_.deburr("déjà vu"); // 'deja vu' // remove combining diacritical marks
_.endsWith("Itachi", "i"); // true
_.escape("<div></div>"); // &lt;div&gt;&lt;/div&gt; // chars --> HTML entities // undo with 'unescape'
_.kebabCase("Kakashi Hatake"); // kakashi-hatake
_.lowerCase("fooBar"); // fohttps://lodash.com/docs/o bar // convert camel, kebab, etc to lower case
_.pad("Kakashi", 10); // ' Kakashi  ' // pad with character (default ' '). also padStart/padEnd
_.parseInt("08"); // 8
_.replace("Hey there, Kakashi!", "Kakashi", "Kaka sensei"); // 'Hey there, Kaka sensei!'
_.snakeCase("fooBar"); // foo_bar
_.split("1,2,3,4,5", ","); // [1,2,3,4,5] // split by delimiter (default ' ')
_.startCase("fooBar"); // 'Foo Bar'
_.startsWith("Yamato", "Y"); // true
_.template("Hello <%= person =%>")({ person: "Kakashi" }); // 'Hello Kakashi"
_.toLower("HELLO-THERE"); // 'hello-there'
_.toUpper("hello-there"); // 'HELLO-THERE'
_.trim("  Hiruzen  "); // "Hiruzen" // also trimEnd/trimStart
_.upperCase("Iruka"); // "IRUKA"
_.upperFirst("iruka"); // "Iruka" // first to uppercase

// ------------
// collection
// ------------

// ------------
// function
// ------------

_.debounce(() => console.log("Hi"), 500); // wait 500ms between each invoking

// ------------
// math / number
// ------------

// ------------
// seq
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------
