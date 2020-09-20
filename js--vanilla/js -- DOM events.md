# EVENT LISTENERS & HANDLING (UDEMY)

```js

//--------------------
// ADD EVENT LISTENER
//--------------------

// event listener -- console.log
document.querySelector('.clear-tasks').addEventListener('click', function(){
  console.log('Hello World');
});

// event listener -- event object & prevent default
document.querySelector('.clear-tasks').addEventListener('click', function(e){
  console.log('Hello World');
  e.preventDefault()
});

// event listener (with named function)
function sayHello(e){
  console.log('hello!');
}

document.querySelector('.clear-tasks').addEventListener('click', sayHello);


// event target
function eventDetails(e){
  let val;
  val = e; // event object
  val = e.type; // event type (click, mouseover, etc.)
  val = e.timestamp;


  val = e.target; // event target
  val = e.target.id;
  val = e.target.className;
  val = e.target.classList;
  e.target.innerText = 'Hello';
  console.log(val);
}

document.querySelector('.clear-tasks').addEventListener('click', eventDetails);


// --------------
// MOUSE EVENTS
// --------------

const clearBtn = document.querySelector('.clear-tasks');
const card = document.querySelector('.card');
const heading = document.querySelector('h5');

// click
clearBtn.addEventListener('click', runEvent);
// doubleclick
clearBtn.addEventListener('dblclick', runEvent);
// mouse down
clearBtn.addEventListener('mousedown', runEvent);
// mouse up
clearBtn.addEventListener('mouseup', runEvent);
// mouse enter (static while inside element)
clearBtn.addEventListener('mouseenter', runEvent);
// mouse leave
clearBtn.addEventListener('mouseleave', runEvent);
// mouse over (triggers while going over child elements)
clearBtn.addEventListener('mouseover', runEvent);
// mouse out
clearBtn.addEventListener('mouseout', runEvent);
// mouse move (movement inside of that element)
clearBtn.addEventListener('mousemove', runEvent);
// blur (when element has lost focus -- used in form validation)
clearBtn.addEventListener('blur', runEvent);


function runEvent(e){
  console.log(`EVENT TYPE: ${e.type}`);
}

// --------------
// KEYBOARD & INPUT EVENTS
// --------------

const form = document.querySelector('#form1');
const taskInput = document.getElementByID('task');

// form event listener (submit)
form.addEventListener('submit', runEvent)
// function for event listener
function runEvent(e){
  console.log(`EVENT TYPE: ${e.type}`); // EVENT TYPE: submit
  console.log(taskInput.value); // value contained in the input element.
  e.preventDefault(); // prevents form submit behavior (redirect).
}

// input event listener (keydown)
taskInput.addEventListener(keydown, keyEvent); // keyup, keypress are similar.
// function for event listener
function keyEvent(){
  console.log(`EVENT TYPE: ${e.type}`); // EVENT TYPE: keydown
  console.log(e.target.value); // console logs what's typed in the input box.
  heading.innerText = e.target.value; // heading text is set to what's typed.
}

// input event listener (focus) (when someone clicks inside the input)
taskInput.addEventListener('focus', focusEvent);
// function for event listener
function focusEvent(e){
  console.log(`EVENT TYPE: ${e.type}`); // EVENT TYPE: focus
}

// input event listener (input) (pretty much any action on input)
taskInput.addEventListener('input', inputEvent);
// function for event listener
function inputEvent(e){
  console.log(`EVENT TYPE: ${e.type}`); // EVENT TYPE: input
}

// 'blur', 'cut', and 'paste' are other input events.
// 'change' -- selector is changed.


//---------------------
// EVENT BUBBLING & DELEGATION
//---------------------

// EVENT DELEGATION

// event listener on document.body
document.body.addEventListener('click', deleteItem);
function deleteItem(e){
  // checks if click event target's parent has class 'delete-item'.
  if (e.target.parentElement.classList.contains('delete-item')){
    // logs the event target.
    console.log(e.target);
    // removes the event target's grandparent
    e.target.parentElement.parentElement.remove();
  }
}


// ----------------
// LOCALSTORAGE
// ----------------

// localStorage API is part of the window object.
// getItem, setItem, removeItem (methods)
// local storage can only hold values as strings.
  // turn arrays/objects into strings using JSON.stringify
  // use JSON.parse to turn it back into an array/object.

// set localStorage item
localStorage.setItem('name', 'John'); // (key, value)

// set sessionStorage item
// sessionStorage.setItem('name', 'Beth');

// remove from storage
localStorage.removeItem('name');

// get from storage
const name = localStorage.getItem('name');
console.log(name);

// clear local storage
localStorage.clear(); // console.log(name); === null


// -----------------
// local storage example (TO DO LIST)
// -----------------

// event listener for form
document.querySelector('form').addEventListener('submit', function(e){
  // form value (as variable)
  const task = document.getElementById('task').value;
  // create array 'tasks' (if not exists)
  let tasks;
  if(localStorage.getItem('tasks') === null){
    tasks = [];
  } else {
    tasks = localStorage.getItem('tasks');
  }
  // add task (form value) to tasks array
  tasks.push(task);
  // persist tasks array to storage (stringify)
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // notify user through UI
  alert('Task Saved!');
  // console.log the value stored
  console.log(task);
  // prevent normal form behavior
  e.preventDefault();
})

const tasks = JSON.parse(localStorage.getItem('tasks'));
tasks.forEach(function(task)){
  console.log(task);
}



```

































































# vanilla js DOM manipulation

## commonly used DOM interfaces

```js
// get by ID
document.getElementById(id)

// change style (left in this case)
element.style.left

// set value of attribute
element.setAttribute(name, value)

// get attribute value of element
element.getAttribute()

// get by tag name
document.getElementsByTagName(name)

// create element
document.createElement(name)

// append child
parentNode.appendChild(node)

// search for child elements (in this case -- <p>) (returns nodelist)
parentNode.querySelectorAll("p");

// modify inner html
element.innerHTML

// add event listener
element.addEventListener()
```

## examples of common DOM interfaces

``` js
// get by id
function changeColor(newColor) {
  var elem = document.getElementById('para');
  elem.style.color = newColor;
}

// change css styling (different ways)
elem.style.cssText = "color: blue; border: 1px solid black";
elem.style.color = "blue";
elem.setAttribute("style", "color: red; border: 1px solid blue;");

// add element (with text)
document.body.onload = addElement;
function addElement () {
  var newDiv = document.createElement("div");    // create a new div element
  var newContent = document.createTextNode("Hi there and greetings!");   // and give it some content
  newDiv.appendChild(newContent);   // add the text node to the newly created div
  var currentDiv = document.getElementById("div1");   // add the newly created element and its content into the DOM
  document.body.insertBefore(newDiv, currentDiv);
}

// append child
var p = document.createElement("p"); // Create a new paragraph element,
document.body.appendChild(p); // append it to the end of the document body

// get attribute value
var div1 = document.getElementById("div1");
var align = div1.getAttribute("align");
```



## event handling (properties)
* when button gets pressed, the body's background color gets changed.

``` js
// event handler for one button
var btn = document.querySelector('button');

function random(number) {
  return Math.floor(Math.random()*(number+1));
}

btn.onclick = function() {
  var rndCol = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';
  document.body.style.backgroundColor = rndCol;
}

// event handlers for all buttons
var buttons = document.querySelectorAll('button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = bgChange;
}
```

## event handling (add/remove event listeners)
* https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
* this is better than the previous property method.

``` js
// add event listener
var btn = document.querySelector('button');

function bgChange() {
  var rndCol = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';
  document.body.style.backgroundColor = rndCol;
}

btn.addEventListener('click', bgChange);

// remove event listener
btn.removeEventListener('click', bgChange);
```

## event object (e, evt, or event)
* `e` is an event object. (any name works, but convention is to use this.)
* `e.target` refers to the element that the event has just occurred on.

```js

// add event listener to one object
function bgChange(e) {
  var rndCol = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';
  e.target.style.backgroundColor = rndCol;
  console.log(e);
}

btn.addEventListener('click', bgChange);

// e.target is nice for adding event listeners through iteration
var divs = document.querySelectorAll('div');

for (var i = 0; i < divs.length; i++) {
  divs[i].onclick = function(e) {
    e.target.style.backgroundColor = bgChange();
  }
}
```

## prevent default (example -- form)

``` js
var form = document.querySelector('form');
var fname = document.getElementById('fname');
var lname = document.getElementById('lname');
var submit = document.getElementById('submit');
var para = document.querySelector('p');

form.onsubmit = function(e) {
  if (fname.value === '' || lname.value === '') {
    e.preventDefault();
    para.textContent = 'You need to fill in both names!';
  }
}
```

## stopPropagation()
* This stops an event from bubbling up to parent containers. (ie -- a click)

``` js
// this prevents any parents' event handlers from reacting to the click.
video.onclick = function(e) {
  e.stopPropagation();
  video.play();
};
```
