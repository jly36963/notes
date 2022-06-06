// ------------
// jest
// ------------

// jest -- delightful js testing

// install
`
npm i --save jest
`

// package.json (script)
`
{
  "scripts": {
    "test": "jest"
  }
}
`
// run test
`
npm run test
`

// ------------
// example
// ------------

// sum.js

const sum = (a,b) => a + b;

// sum.test.js

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1,2)).toBe(3);
});

// ------------
// matchers (basics)
// ------------

// toBe
const a = 1 + 2;
expect(a).toBe(3); // checks for equality (use on primitives)

// toEqual
const kakashi = { name: 'Kakashi' };
expect(kakashi).toEqual({ name: 'Kakashi' }); // recursively checks fields of obj/arr for equality

// not
const b = 1 + 2;
expect(b).not.toBe(4);

// falsy
expect(null).toBeNull(); // null
expect(undefined).toBeUndefined(); // undefined
expect('').toBeFalsy(); // '', 0, null, undefined, false, NaN

// truthy
const yamato = 'Yamato'
expect(yamato).toBeDefined(); // anything but undefined
expect(yamato).toBeTruthy(); // not falsy

// ------------
// matchers (types)
// ------------

// numbers
const x = 4;
expect(x).toBeGreaterThan(3);
expect(x).toBeGreaterThanOrEqual(3.5);
expect(x).toBeLessThan(5);
expect(x).toBeLessThanOrEqual(4.5);
expect(x).toBe(4);
expect(x).toEqual(4);
expect(x).not.toBeNaN();

// strings
const iruka = 'Iruka';
expect(iruka).toMatch(/zen/); // regex

// arrays & iterables
const hokages = ['Hiruzen', 'Kakashi', 'Tsunade'];
expect(hokages).toContain('Kakashi');
expect(hokages).toHaveLength(3);

// object
const kakashi = { firstName: "Kakashi", lastName: "Hatake" };
expect(kakashi).toHaveProperty('firstName'); // object has property
expect({ ...kakashi, isAwesome: true }).toMatchObject(kakashi); // first object has all from second object

// class
const now = new Date();
expect(now).toBeInstanceOf(Date); // new Date() instanceof Date

// exceptions
const oops = () => { throw new Error('Oops') };
expect(oops).toThrow() // .toThrow(Error)


// ------------
// expect (toBeCalledWith)
// ------------

// extend

expect.extend({
  toBeWithinRange: (received, floor, celing) => {
    const pass = received >= floor && received <= ceiling;
    if (pass) { 
      return { message: () => 'message here', pass: true }
    } else {
      return { message: () => 'message here', pass: false }
    }
  }
})

expect(100).toBeWithinRange(0, 1000)

// anything
const yamato = 'Yamato';
expect(yamato).toBeCalledWith(expect.anything()); // anything but null or undefined

// constructors
const hiruzen = 'Hiruzen';
expect(hiruzen).toBeCalledWith(expect.any(String)); // match constructor

// array containing
const numbers = [1,2,3,4,5];
expect(numbers).toEqual(expect.arrayContaining([1,2,3]));

// object containing
const kakashi = { firstName: "Kakashi", lastName: "Hatake" };
expect(kakashi).toBeCalledWith(expect.objectContaining({ firstName: "Kakashi" }))

// string containing
const iruka = 'Iruka';
expect(iruka).toBeCalledWith(expect.stringMatching(/a/));


// ------------
// async
// ------------

// https://jestjs.io/docs/en/asynchronous

// ------------
// setup & teardown
// ------------

// beforeEach & afterEach -- do setup/teardown for each test
// beforeAll & afterAll -- do setup/teardown once each
// describe -- group tests together

beforeEach(() => {
  // setup
})

afterEach(() => {
  // teardown
})

const sum = (a, b) => a + b;

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

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



