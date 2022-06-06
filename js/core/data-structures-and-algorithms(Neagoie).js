// ---
// data structures and algorithms
// ---

// common structures
// - arrays
// - stacks
// - queues
// - linked lists
// - trees
// - tries
// - graphs
// - hash tables

// algorithms
// - sorting
// - dynamic programming
// - BFS + DFS (searching)
// - recursion

// ---
// important developer skills
// ---

// good code
// - readable
// - scalable
// -- speed (time complexity)
// -- memory (space complexity)

// good code checklist
// - it works
// - proper use of data structures
// - code re-use (good organization)
// - modular
// - less than O(n^2) wherever possible.
// - low space complexity

// solving problems
// - analytical skills
// - coding skills
// - technical skills
// - communication skills

// ---
// time complexity / asymptotic analysis / space complexity
// ---

// asymptotic analysis -- mathematical framing of an algorithm's runtime performance
// big O notation -- limiting behavior of a function when the argument approaches infinity

// 4 rules
// - worst case -- plan for the worst. no blue sky thinking
// - remove constants -- as function approaches infinity, constants are negligible.
// - different terms for different inputs -- O(a + b), O(a * b), etc
// - drop non-dominants -- only use largest time compexity. O(n^2 + n) --> O(n^2)

// time
// - operations
// - comparisons
// - loops
// - outside function calls

// space
// - variables
// - data structures
// - function calls
// - allocations

// cheatsheet
// - https://www.bigocheatsheet.com/

// wiki
// - https://en.wikipedia.org/wiki/Time_complexity

// reducing complexity
// - hash maps have higher space complexity than arrays, but much better time complexity.
// - for sorted arrays, use binary search tree to reduce time complexity.

// ---
// time complexity examples
// ---

const basicTimeComplexity = () => {
  const data = [1, 2, 3, 4, 5];
  // O(1) -- constant time. as data size increases, time complexity is static..
  console.log(data[0]);
  // O(log n) -- logarithmic time (binary search)
  binarySearch(data, 2);
  // O(n * log n) -- logarithmic linear time / linearithmic time (merge sort)
  mergeSort(data);
  // O(n) -- linear time. as data size increases, time complexity increases linearly
  data.forEach((d) => console.log(d));
  // O(n^2) -- quadratic time. as data size increases, time complexity increases quadratically
  data.forEach((d1) => data.forEach((d2) => console.log(`${d1}, ${d2}`)));
  // O(2^n) -- exponential time. (powerset, fibonacci)
  powerSet(data);
  // O(n!) -- factorial time (permutations)
  getPermutations(data);
}

// ---
// interesting functions
// ---

const getPermutations = (arr) => {
  const length = arr.length;
  const result = [...arr];
  const c = new Array(length).fill(0);
  let i = 1;

  while (i < length) {
    if (c[i] < i) {
      const k = i % 2 && c[i];
      const p = arr[i];
      arr[i] = arr[k];
      arr[k] = p;
      ++c[i];
      i = 1;
      result.push([...arr]);
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
};

const binarySearch = (arr, target) => {
  let startIndex = 0;
  let endIndex = arr.length - 1;
  while (startIndex <= endIndex) {
    const middleIndex = Math.floor((startIndex + endIndex) / 2); // determine middle
    if (target === arr[middleIndex]) {
      return console.log(`arr[${middleIndex}]`) || middleIndex;
    } // found it
    if (target > arr[middleIndex]) {
      startIndex = middleIndex + 1;
    } // search right of middle
    if (target < arr[middleIndex]) {
      endIndex = middleIndex - 1;
    } // search left of middle
  }
  console.log("Target value not found in array");
};

// power set
const powerSet = (arr) => {
  const obj = {};
  // This loop is to take out all duplicate number/letter
  // variable array will have no duplicates
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i]] = true;
  } 
  const array = Object.keys(obj);
  const result = [[]];
  for (let i = 0; i < array.length; i++) {
    const len = result.length; // This line is the exit condition
    for (let x = 0; x < len; x++) {
      result.push(result[x].concat(array[i]));
    }
  }
  return result;
};

const merge = (left, right) => {
  const resultArray = []
  const leftIndex = 0
  const rightIndex = 0
  // We will concatenate values into the resultArray in order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      resultArray.push(left[leftIndex]);
      leftIndex++; // move left array cursor
    } else {
      resultArray.push(right[rightIndex]);
      rightIndex++; // move right array cursor
    }
  }
  // We need to concat here because there will be one element remaining
  // from either left OR the right
  return resultArray
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex))
};

const mergeSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  } // no sort for length 0, 1
  const middle = Math.floor(arr.length / 2); // determine middle
  // This is where we will be dividing the array into left and right
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);
  // Using recursion to combine the left and right
  return merge(mergeSort(left), mergeSort(right));
};

// ---
// space complexity examples
// ---

// O(1) -- constant
// O(log n) -- logarithmic
// O(n * log n) -- logarithmic linear / linearithmic
// O(n) -- linear
// O(n^2) -- quadratic
// O(2^n) -- exponential
// O(n!) -- factorial

// ---
// time + space complexity
// ---

// using nested for loops to check each item
// - time -- O(a * b)
// - space -- 0(1)
// using map
// - time -- O(a + b)
// - space -- O(n)

const getCommonElements = (arr1 = [], arr2 = []) => {
  const commonItems = [];
  arr1.forEach((element1) =>
    arr2.forEach((element2) => {
      if (element1 === element2) commonItems.push(element1);
    })
  );
  return commonItems;
};

const getCommonObjects = (arr1 = [], arr2 = []) => {
  const commonItems = [];
  const map = {};
  // convert arr1 to map
  arr1.forEach((item) => {
    map[item.id] = item;
  });
  // check if each item in arr2 exists in the map
  arr2.forEach((item) => {
    if (map[item.id]) commonItems.push(item);
  });
  return commonItems;
};

// ---
// data structures
// ---

// arrays
// - pros: fast lookups, fast push/pop, ordered
// - cons: slow inserts, slow deletes, fixed size (if static)

// hash tables
// - pros: fast insert / lookup / delete / search
// - cons: higher memory usage

// ---
// data structures (array)
// ---

// push -- add element to end
// pop -- remove last element and return it
// shift -- remove first element (and shift others forward)
// unshift -- add to beginning (and shift others back)
// indexOf -- find index of element that matches argument
// slice -- grab elements and return new copy. (no args -- all, one arg -- left bound, two args -- bounds)
// splice -- remove an item (or items) at specified index (args: index, how many to remove, items to add)

class MyArray {
  // constructor
  constructor() {
    this.length = 0;
    this.data = {};
  }

  // methods
  get(index) {
    return this.data[index];
  }
  push(item) {
    this.data[this.length] = item;
    this.length++;
    return this.length;
  }
  pop() {
    const lastItem = this.data[this.length - 1];
    delete this.data[this.length - 1];
    this.length--;
    return lastItem;
  }
  shift() {
    this.delete(1);
  }
  unshift(item) {
    this.unshiftItems(0); // shift all items right
    this.data[0] = item; // set data[0] to new item
  }

  // helper methods
  delete(index) {
    const item = this.data[index];
    this.shiftItems(index);
    return item;
  }
  shiftItems(index) {
    for (let i = index; i < this.length - 1; i++) {
      this.data[i] = this.data[i + 1]; // copy items left
    }
    delete this.data[this.length - 1]; // delete last item (cleanup)
    this.length--; // decrement length
  }
  unshiftItems(index) {
    for (let i = this.length - 1; i >= index; i--) {
      this.data[i + 1] = this.data[i]; // copy items right
    }
    this.data[index] = null; // set element at index to null (cleanup)
    this.length++;
  }
}

// ---
// strings and arrays
// ---

// strings are character arrays

const reverse = (str) => {
  if (typeof str !== "string")
    throw new Error("Input provided was not a string");
  arr = str.split("");
  const arrReverse = [];
  arr.forEach((char) => arrReverse.unshift(char));
  const result = arrReverse.join("");
  return result;
};

const reverse2 = (str) => [...str].reverse().join("");

// ---
// data structures (hash tables)
// ---

// hash table
// hash function
// - uses key to determine indexes. indexes are used to find records (stored as k/v pairs)
// - hash function hashes the key into a bucket (memory address). record is stored in that bucket.
// - hashing is a one way function. (example: hello --> 5d41402abc4b2a76b9719d911017c592)
// collisions
// - hash function generates the same index for more than one key.
// - multiple records getting stored at the same memory location.
// - causes overflow entries
// - affects performance -- memory address now has multiple records.
// collision resolution
// - many different methods
// - separate chaining with linked lists (popular method)

// IMPORTANT -- this example won't overwrite a key that has already been defined (during 'set')

// import
const md5 = require("md5");
// hash table class
class HashTable {
  constructor(size) {
    this.data = new Array(size);
  }
  // hash function
  _hash(key) {
    return md5(key);
  }
  // set key/value
  set(key, value) {
    const address = this._hash(key); // use hash function to determine address
    if (!this.data[address]) {
      this.data[address] = []; // create empty array at address
    }
    this.data[address].push([key, value]); // add key/value array at address
  }
  // get value for key
  get(key) {
    const address = this._hash(key); // get address
    const currentBucket = this.data[address];
    // return value of matching address/key or return undefined
    if (currentBucket.length) {
      for (let i = 0; i < currentBucket.length; i++) {
        if (currentBucket[i] === key) return currentBucket[i][1];
      }
    }
    return undefined;
  }
  // return keys
  keys() {
    const keysArray = [];
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]) {
        this.data[i].forEach((x) => keysArray.push(x[0])); // push each key to keysArray
      }
    }
    return keysArray;
  }
}

const useHashTable = () => {
  const people = new HashTable(50); // 50 elements
  people.set("kakashi", "Kakashi Hatake");
  people.set("yamato", "Tenzo Yamato");
  people.set("iruka", "Iruka Umino");
  people.get("kakashi"); // "Kakashi Hatake"
}

// ---
// singly linked list
// ---

// singly linked lists are made up of nodes
// - each node has two parts -- value, pointer to next value
// linked list vs array
// - linked lists have faster insertion & deletion
// - arrays have faster access

// IMPORTANT -- this example has an inefficient 'insert' method;

class LinkedList {
  constructor(value) {
    this.head = {
      value,
      next: null,
    };
    this.tail = this.head;
    this.length = 1;
  }
  append(value) {
    const newNode = {
      value,
      next: null,
    };
    this.tail.next = newNode; // update old tail
    this.tail = newNode; // set new tail
    this.length++; // increment length
  }
  prepend(value) {
    const newNode = {
      value,
      next: this.head,
    };
    this.head = newNode; // set new head
    length++; // increment length
  }
  printList() {
    const arr = [];
    let currentNode = this.head;
    for (let i = 0; i < index; i++) {
      arr.push(currentNode);
      currentNode = currentNode.next;
    }
  }
  get(index) {
    // make sure target index is in bounds
    const targetIndex = Math.min(index, this.length);
    // if index === 0
    if (index === 0) {
      return this.head.value;
    }
    // if 0 < index < this.length
    const currentNode = this.head;
    for (i = 0; i < targetIndex; i++) {
      currentNode = currentNode.next;
    }
    return currentNode.value;
  }
  rebuildFromFlatArray(flatList) {
    this.head = {
      value: flatList[0],
      next: null,
    };
    for (let i = 1; i < flatList.length; i++) {
      this.append(value);
    }
  }
  insert(index, value) {
    // if index >= length
    if (index >= this.length) {
      this.append(value);
    }
    // if index === 0
    if (index === 0) {
      this.prepend(value);
    }
    // if 0 < index < this.length
    const flatList = printList().splice(index, 0, value); // flatten data and insert new value
    this.rebuildFromFlatArray(flatList);
  }
  remove(index) {
    const targetIndex = Math.min(index, this.length);
    const flatList = printList().splice(index, 1); // flatten data and remove value at index
    this.rebuildFromFlatArray(flatList);
  }
}

const useSinglyLinkedList = () => {
  const people = new LinkedList("kakashi");
  people.append("yamato");
  people.prepend("iruka");
  people.insert(2, "hiruzen");
}

// ---
// doubly linked list
// ---

// doubly linked lists are made up of nodes
// - each node has three parts -- value, pointer to next value, pointer to previous value

// less time complexity for traversal, more space complexity

// *** better structure idea ***

class DoublyLinkedList {
  constructor(value) {
    const key = this.generateKey(); // dynamically generate key
    this.data = {}; // data will hold all elements (keys will be UUIDs)
    this.data[key] = {
      value,
      previous: null, // key for next value
      next: null,
    };
    this.head = key;
    this.tail = key;
    this.length = 1;
  }
  generateKey() {
    let result = "";
    const letters = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 8; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
  }
  append(value) {
    const key = this.generateKey(); // key for new node
    this.data[this.tail].next = key; // set 'next' property for old tail
    const newNode = {
      value,
      previous: this.tail,
      next: null,
    };
    this.data[key] = newNode; // add node to data (as a property)
    this.tail = key; // set new tail
    this.length++; // increment length
  }
  prepend(value) {
    const key = this.generateKey(); // key for new node
    this.data[this.head].previous = key; // set 'next' property for old tail
    const newNode = {
      value,
      previous: null,
      next: this.head,
    };
    this.data[key] = newNode; // add node to data (as a property)
    this.head = key; // set new tail
    this.length++; // increment length
  }
  get(index) {
    // make sure target index is in bounds
    const targetIndex = Math.min(index, this.length);
    // if index === 0
    if (index === 0) {
      return this.data[this.head].value;
    }
    // if 0 < index < this.length
    let currentNode = this.data[this.head];
    for (let i = 0; i < targetIndex; i++) {
      currentNode = this.data[currentNode.next];
    }
    return currentNode.value;
  }
  insert(index, value) {
    // new key
    // new node
    // adjust adjacent nodes
  }
  remove(index) {
    // adjust adjacent nodes
    // remove node
  }
}

const useDoublyLinkedList = () => {
  const dll = new DoublyLinkedList("kakashi");
  dll.append("yamato");
  dll.prepend("iruka");
  console.log(dll);
  console.log(dll.get(0), dll.get(1), dll.get(2));
}

// ---
// data structures (stacks and queues)
// ---

// stacks and queues are linear data structures
// you only use the ends (first, last elements)

// stacks
// - LIFO -- last in, first out
// queue
// - FIFO -- first in, first out

// ---
// trees
// ---

// hierarchical data structure
// root, parent, child, sibling, leaf

// ---
//
// ---
