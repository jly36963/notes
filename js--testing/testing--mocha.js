// ---------
// mocha
// ---------

// command line usage
// https://mochajs.org/#command-line-usage

// ---
// installs
// ---

// npm i --save mocha
// npm i --save should expect chai

// ---
// warning
// ---

// if async test, function param to 'it' should be async

// don't use arrow functions if using 'this'
// examples -- this.retries, this.slow, this.timeout

// ---
// imports
// ---

// mocha can use many different tools for testing.
// if it throws an error on test failure, it works.

const assert = require("assert");
const should = require("should");
const expect = require("expect");
const { expect: chaiExpect } = require("chai");

// ---
// assert (nodejs, no external package)
// ---

describe("Array", () => {
  describe("#indexOf()", () => {
    it("should return -1 when the value is not present", () => {
      assert.strictEqual([1, 2, 3].indexOf(4), -1);
    });
  });
});

// ---
// should
// ---

const person = {
  firstName: "Kakashi",
  lastName: "Hatake",
};

describe("person", () => {
  it("should have a property 'firstName' that is equal to 'Kakashi'", () => {
    should(person).have.property("firstName", "Kakashi");
  });
});

// ---
// expect (used in jest)
// ---

const sum = (...nums) => nums.reduce((acc, cur) => acc + cur, 0);

describe("sum", () => {
  it("should find the sum of variadic number arguments", () => {
    expect(sum(1, 2, 3)).toBe(6);
  });
});

// ---
// chai
// ---

// https://www.chaijs.com/api/bdd/

const friend = {
  firstName: "Obito",
  lastName: "Uchiha",
};

describe("friend", () => {
  it("should have a property 'firstName' that is equal to 'Obito'", () => {
    chaiExpect(friend).to.have.property("firstName");
    chaiExpect(friend.firstName).to.equal("Obito");
  });
});

// ---
// hooks
// ---

// overloaded
// before(function)
// before(description, function)

describe("hooks", () => {
  before(() => console.log("runs before first test in block"));
  after(() => console.log("runs after last test in block"));
  beforeEach(() => console.log("runs before each test in block"));
  afterEach(() => console.log("runs after each test in block"));
  // *** test things here ***
});

// ---
// pending
// ---

describe("Array", function () {
  describe("#indexOf()", function () {
    it("someone please write this test.");
  });
});

// ---
//
// ---

// ---
//
// ---
