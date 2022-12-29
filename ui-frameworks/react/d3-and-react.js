// ------------
// d3 API (with react)
// ------------

// install
`
npm i --save d3
`

// import (no default module)
// import * as d3 from 'd3';

// ------------
// select
// ------------

// grouping and data propogation
  // select -- preserves existing grouping, propogates from parent to child (1:1)
  // selectAll -- doesn't propogate data from parent to child, (1:many)
    // data-join -- 
  // append -- wrappers on top of select. preserve grouping
  // insert -- wrappers on top of select. preserve grouping

// select
d3
  .select("body")
  .style("background-color", "black");

// select all
d3
  .selectAll("p")
  .style("color", "blue");

// chain
d3
  .select(d3Container.current) // ref
  .selectAll("tr") // ref -> tr
  .selectAll("td") // ref -> tr -> td

// ------------
// data
// ------------

// array
const numbers = [1,2,3,4,5]
// array of objects
const letters = [
  { name: "A", frequency: .08167 },
  { name: "B", frequency: .01492 },
  { name: "C", frequency: .02780 },
  { name: "D", frequency: .04253 },
  { name: "E", frequency: .12702 }
];
// multi-dimensional arrays
const matrix = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15]
];


// ------------
// join
// ------------

// when a key for a datum and an element are equal, the datum is assigned to that element.

// using index as key

// array
const numbers = [4, 5, 18, 23, 42];
// join
d3
  .selectAll("div")
  .data(numbers);

// using object property as key

// array of objects
const letters = [
  { name: "A", frequency: .08167 },
  { name: "B", frequency: .01492 },
  { name: "C", frequency: .02780 },
  { name: "D", frequency: .04253 },
  { name: "E", frequency: .12702 }
];
// key function
const name = (d) => d.name;
// join (using key function)
d3
  .selectAll("div")
  .data(letters, name);


// ------------
// enter, update, exit
// ------------

// joining elements & data -- 3 outcomes:
  // update -- matching element and datum
  // enter -- no element, yes datum
  // exit -- yes element, no datum

// manage nodes
  // enter -- create new nodes for incoming data
  // exit -- remove nodes for data that is no longer needed.

// enter
d3
  .select("body")
  .selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
  .enter().append("p")
  .text((d) => `Number: ${d}`);
// update
const p = d3
  .select("body")
  .selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
  .text((d) => d);
// enter
p
  .enter()
  .append("p")
  .text((d) => d);
// exit
p
  .exit()
  .remove();

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




