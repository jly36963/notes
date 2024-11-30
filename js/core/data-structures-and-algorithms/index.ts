import md5 from "md5";

// ---
// Time complexity examples
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
	// biome-ignore lint/complexity/noForEach: Example
	data.forEach((d) => console.log(d));
	// O(n^2) -- quadratic time. as data size increases, time complexity increases quadratically
	// biome-ignore lint/complexity/noForEach: Example
	data.forEach((d1) => data.forEach((d2) => console.log(`${d1}, ${d2}`)));
	// O(2^n) -- exponential time. (powerset, fibonacci)
	powerSet(data);
	// O(n!) -- factorial time (permutations)
	getPermutations(data);
};

// ---
// Interesting functions
// ---

function getPermutations<T>(arr: Array<T>) {
	const length = arr.length;
	const result = [arr];
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
}

function binarySearch<T>(arr: Array<T>, target: T): number | null {
	let startIndex = 0;
	let endIndex = arr.length - 1;
	while (startIndex <= endIndex) {
		const middleIndex = Math.floor((startIndex + endIndex) / 2); // determine middle
		if (target === arr[middleIndex]) {
			// found it
			return middleIndex;
		}
		if (target > arr[middleIndex]) {
			// search right of middle
			startIndex = middleIndex + 1;
		}
		if (target < arr[middleIndex]) {
			// search left of middle
			endIndex = middleIndex - 1;
		}
	}
	return null;
}

// power set
function powerSet<T>(arr: Array<T>): Array<Array<T>> {
	const array = [...new Set(arr)];
	const result: Array<Array<T>> = [[]];
	for (let i = 0; i < array.length; i++) {
		const len = result.length; // This line is the exit condition
		for (let x = 0; x < len; x++) {
			const value = array[i];
			result.push(result[x].concat(value));
		}
	}
	return result;
}

function merge<T>(left: Array<T>, right: Array<T>) {
	const resultArray = [];
	let leftIndex = 0;
	let rightIndex = 0;
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
		.concat(right.slice(rightIndex));
}

function mergeSort<T>(arr: Array<T>): Array<T> {
	if (arr.length <= 1) {
		return arr;
	} // no sort for length 0, 1
	const middle = Math.floor(arr.length / 2); // determine middle
	// This is where we will be dividing the array into left and right
	const left = arr.slice(0, middle);
	const right = arr.slice(middle);
	// Using recursion to combine the left and right
	return merge(mergeSort(left), mergeSort(right));
}

// ---
// Space complexity examples
// ---

// O(1) -- constant
// O(log n) -- logarithmic
// O(n * log n) -- logarithmic linear / linearithmic
// O(n) -- linear
// O(n^2) -- quadratic
// O(2^n) -- exponential
// O(n!) -- factorial

// ---
// Time + space complexity
// ---

// using nested for loops to check each item
// - time -- O(a * b)
// - space -- 0(1)
// using map
// - time -- O(a + b)
// - space -- O(n)

function intersection<T>(arr1: Array<T>, arr2: Array<T>) {
	const commonItems: Array<T> = [];
	// biome-ignore lint/complexity/noForEach: Example
	arr1.forEach((element1) => {
		// biome-ignore lint/complexity/noForEach: Example
		arr2.forEach((element2) => {
			if (element1 === element2) commonItems.push(element1);
		});
	});
	return commonItems;
}

// ---
// Data structures
// ---

// arrays
// - pros: fast lookups, fast push/pop, ordered
// - cons: slow inserts, slow deletes, fixed size (if static)

// hash tables
// - pros: fast insert / lookup / delete / search
// - cons: higher memory usage

// ---
// Data structures (array)
// ---

// push -- add element to end
// pop -- remove last element and return it
// shift -- remove first element (and shift others forward)
// unshift -- add to beginning (and shift others back)
// indexOf -- find index of element that matches argument
// slice -- grab elements and return new copy. (no args -- all, one arg -- left bound, two args -- bounds)
// splice -- remove an item (or items) at specified index (args: index, how many to remove, items to add)

type NumberDict<T> = {
	[key: number]: T;
};

class MyArray<T> {
	length: number;
	data: NumberDict<T>;
	// constructor
	constructor() {
		this.length = 0;
		this.data = {};
	}

	get(index: number): T {
		return this.data[index];
	}
	push(item: T): number {
		this.data[this.length] = item;
		this.length++;
		return this.length;
	}
	pop(): T {
		const lastItem = this.data[this.length - 1];
		delete this.data[this.length - 1];
		this.length--;
		return lastItem;
	}
	shift(): void {
		this.#delete(1);
	}
	unshift(item: T): void {
		this.#unshiftItems(0); // shift all items right
		this.data[0] = item; // set data[0] to new item
	}

	#delete(index: number): T {
		const item = this.data[index];
		this.#shiftItems(index);
		return item;
	}
	#shiftItems(index: number): void {
		for (let i = index; i < this.length - 1; i++) {
			this.data[i] = this.data[i + 1]; // copy items left
		}
		delete this.data[this.length - 1]; // delete last item (cleanup)
		this.length--; // decrement length
	}
	#unshiftItems(index: number): void {
		for (let i = this.length - 1; i >= index; i--) {
			this.data[i + 1] = this.data[i]; // copy items right
		}
		delete this.data[index];
		this.length++;
	}
}

// ---
// Strings and arrays
// ---

// strings are character arrays

function reverse(str: string): string {
	if (typeof str !== "string")
		throw new Error("Input provided was not a string");
	const arr = str.split("");
	const arrReverse: Array<string> = [];
	// biome-ignore lint/complexity/noForEach: Example
	arr.forEach((char) => arrReverse.unshift(char));
	const result = arrReverse.join("");
	return result;
}

function reverse2(str: string): string {
	return [...str].reverse().join("");
}

// ---
// Data structures (hash tables)
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

// ---
// Singly-linked list
// ---

// singly linked lists are made up of nodes
// - each node has two parts -- value, pointer to next value
// linked list vs array
// - linked lists have faster insertion & deletion
// - arrays have faster access

// IMPORTANT -- this example has an inefficient 'insert' method;

type SingleNode<T> = { value: T; next: SingleNode<T> | null };

class LinkedList<T> {
	length: number;
	head: SingleNode<T>;
	tail: SingleNode<T>;

	constructor(value: T) {
		this.head = {
			value,
			next: null,
		};
		this.tail = this.head;
		this.length = 1;
	}
	append(value: T) {
		const newNode = {
			value,
			next: null,
		};
		this.tail.next = newNode; // update old tail
		this.tail = newNode; // set new tail
		this.length++; // increment length
	}
	prepend(value: T) {
		const newNode = {
			value,
			next: this.head,
		};
		this.head = newNode; // set new head
		this.length++; // increment length
	}
	printList() {
		const arr = [];
		let currentNode: SingleNode<T> | null = this.head;
		for (let i = 0; i < this.length; i++) {
			// biome-ignore lint/style/noNonNullAssertion: Only last node will have `null` next
			arr.push(currentNode!.value);
			// biome-ignore lint/style/noNonNullAssertion: Only last node will have `null` next
			currentNode = currentNode!.next;
		}
		return arr;
	}
	get(index: number) {
		// make sure target index is in bounds
		const targetIndex = Math.min(index, this.length);
		// if index === 0
		if (index === 0) {
			return this.head.value;
		}
		// if 0 < index < this.length
		let currentNode: SingleNode<T> | null = this.head;
		for (let i = 0; i < targetIndex; i++) {
			// biome-ignore lint/style/noNonNullAssertion: Only last node will have `null` next
			currentNode = currentNode!.next;
		}
		// biome-ignore lint/style/noNonNullAssertion: Only last node will have `null` next
		return currentNode!.value;
	}
	rebuildFromFlatArray(flatList: Array<T>) {
		this.head = {
			value: flatList[0],
			next: null,
		};
		for (let i = 1; i < flatList.length; i++) {
			this.append(flatList[i]);
		}
	}
	insert(index: number, value: T) {
		// if index >= length
		if (index >= this.length) {
			this.append(value);
		}
		// if index === 0
		if (index === 0) {
			this.prepend(value);
		}
		// if 0 < index < this.length
		const flatList = this.printList().splice(index, 0, value); // flatten data and insert new value
		this.rebuildFromFlatArray(flatList);
	}
	remove(index: number) {
		const targetIndex = Math.min(index, this.length);
		const flatList = this.printList().splice(index, 1); // flatten data and remove value at index
		this.rebuildFromFlatArray(flatList);
	}
}

const useSinglyLinkedList = () => {
	const people = new LinkedList("kakashi");
	people.append("yamato");
	people.prepend("iruka");
	people.insert(2, "hiruzen");
};

// ---
// Doubly linked list
// ---

// doubly linked lists are made up of nodes
// - each node has three parts -- value, pointer to next value, pointer to previous value

// less time complexity for traversal, more space complexity

// *** better structure idea ***

type DoubleNode<T> = {
	value: T;
	next: string | null;
	previous: string | null;
};

type Dict<T> = {
	[key: string]: T;
};

class DoublyLinkedList<T> {
	length: number;
	data: Dict<DoubleNode<T>>;
	head: string;
	tail: string;

	constructor(value: T) {
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
	append(value: T) {
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
	prepend(value: T) {
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
	get(index: number) {
		// make sure target index is in bounds
		const targetIndex = Math.min(index, this.length);
		// if index === 0
		if (index === 0) {
			return this.data[this.head].value;
		}
		// if 0 < index < this.length
		let currentNode = this.data[this.head];
		for (let i = 0; i < targetIndex; i++) {
			// biome-ignore lint/style/noNonNullAssertion: Only last node will have `null` next
			currentNode = this.data[currentNode.next!];
		}
		return currentNode.value;
	}
	insert(index: number, value: T) {
		// new key
		// new node
		// adjust adjacent nodes
	}
	remove(index: number) {
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
};

// ---
// Data structures (stacks and queues)
// ---

// stacks and queues are linear data structures
// you only use the ends (first, last elements)

// stacks
// - LIFO -- last in, first out
// queue
// - FIFO -- first in, first out

// ---
// Trees
// ---

// hierarchical data structure
// root, parent, child, sibling, leaf
