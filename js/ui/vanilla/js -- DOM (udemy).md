# DOM SELECTION/MANIPULATION

## single element selectors

```js
// ------------------------
// document.getElementById()
// ------------------------

document.getElementByID('box1'); // selects element with id 'box1'
document.getElementByID('box1').id;
document.getElementByID('box1').className;
document.getElementByID('box1').tagName;

// change styling

document.getElementById('box1').style.background = 'gray';
document.getElementById('box1').style.color = 'white';
document.getElementById('box1').style.padding = '5px';
document.getElementById('box1').style.display = 'none';

// change content

document.getElementById('box1').textContent = 'Task List';
document.getElementById('box1').innerText = 'My Tasks';
document.getElementById('box1').innerHTML = '<span>Task List</span>';

// selector as a variable

const taskTitle = document.getElementById('box1');
taskTitle.textContent = 'Hello World!';

// ------------------------
// document.querySelector()
// ------------------------

let val;
val = document.querySelector('#box1'); // id select
val = document.querySelector('.box'); // class select (first only)
val = document.querySelector('h5'); // first h5 select
val = document.querySelector('ul li'); // first <li> of first <ul>
val = document.querySelector('li:last-child'); // last child, pseudo-class
val = document.querySelector('li:nth-child(3)'); // 3rd child, pseudo-class
val = document.querySelector('li.list-items:nth-child(1)'); // element, class, pseudo-class
```

## multiple element selectors

```js

// ------------------------
// document.getElementsByClassName()
// ------------------------

let items;
// get all elements of specific class -- html collection
items = document.getElementsByClassName('list-items');
// changes color of first in collection.
items[0].style.color = 'red';

// select all elements of class 'list-items' from first <ul>.
listItems = document.querySelector('ul').getElementsByClassName('list-items');

// ------------------------
// document.getElementsByTagName()
// ------------------------

let items;
// selects all 'li' elements.
items = document.getElementsByTagName('li');
// selects first 'li' element.
items[0];
// converts 'items' html collection to array.
items = Array.from(items);
// iterate through 'items' array.
items.forEach(function)(item, index){
  console.log(item.tagName);
  console.log(item.className);
  console.log(`${index}: ${item}`);
});

// ------------------------
// document.querySelectorAll()
// ------------------------

let items;
// select all <li> children of <ul> -- node list, array functions work.
items = document.querySelectorAll('ul li');
// iterate through node list.
items.forEach(function)(item, index){
  console.log(`${index}: ${item}`);
});



let oddItems;
let evenItems;
// select even and odd <li>.
oddItems = document.querySelectorAll('li:nth-child(odd)');
evenItems = document.querySelectorAll('li:nth-child(even)');
// even and odd styling for <li>
oddItems.forEach(function(li, index){
  li.style.background = 'gray';
});
evenItems.forEach(function(li, index){
  li.style.background = 'gainsboro';
});

```

## relative selectors

```js
// ------------
// CHILDREN
// ------------

let val;
const list = document.querySelector('ul.collection');
const listItem = document.querySelector('li.list-items:first-child');

val = list; // <ul class='collection'>
val = listItem; // <li class='list-items'> (first-child)

// childNodes -- node list of children

val = list.childNodes; // node list of children (including text & line breaks)
val = list.childNodes[0] // first child.
val = list.childnodes[0].nodeName; // #text, body, div, [other elements...]
val = list.childnodes[0].nodeType; // 1-elem, 2-attr, 3-text, 8-comment, 9-doc, 10-doctype.
val = list.childnodes[0].nodeValue; // value that is contained.

// children -- html collection of elements

val = list.children; // html collection (not node list) (elements only)
val = list.children[0]; // first child element
list.children[0].text.content = 'Hello!'; // change text content of first child.
val = list.children[0].children // first child's children.

// firstChild

val = list.firstChild; // first node (text or element)
val = list.firstElementChild // first element child
val = list.lastChild; // last node (text or element)
val = list.lastElementChild; // last element child
val = list.childElementCount; // returns number of element children.

console.log(val);

// ------------
// PARENTS
// ------------

val = listItem.parentNode; // node of parent (usually same as parentElement)
val = listItem.parentNode.parentNode; // grandparent node

// ------------
// SIBLING
// ------------

val = listItem.nextSibling; // next sibling (node or element)
val = listItem.nextElementSibling; // next sibling element
val = listItem.nextElementSibling.nextElementSibling; // next sibling after that
val = listItem.previousElementSibling; // previous element sibling

```

# adding to the DOM

```js
// ------------
// CREATING ELEMENTS
// ------------

// create
const li = document.createElement('li');
// add class
li.className = 'list-items';
// add id
li.id = 'new-item';
// add attribute
li.setAttribute('title', 'New Item');
// create text node and append (inside <li></li>)
li.appendChild(document.createTextNode('Hello World'));
// create link element
const link = document.createElement('a');
// add class
link.className = 'delete-item secondary-content';
// add inner html content
link.innerHTML = '<i class="fa fa-remove"></i>';
// append link to <li>
li.appendChild(link);
// append <li> as child to <ul class='collection'>
document.querySelector('ul.collection').appendChild(li);


console.log(li);


// -------------------
// REPLACING ELEMENTS
// -------------------

// create element
const newHeading = document.createElement('h2');
// add ID
newHeading.id = 'box1';
// append text node
newHeading.appendChild(document.createTextNode('Task List'));
// select element to be replaced
const oldHeading = document.getElementById('box1');
// select parent
const cardAction = document.querySelector('.card-action');
// replace child
cardAction.replaceChild(newHeading, oldHeading);


// -------------------
// REMOVING ELEMENTS
// -------------------

const lis = document.querySelectorAll('li');
const list = document.querySelector('ul');
// remove first <li>
lis[0].remove();
// remove fourth child element
list.removeChild(lis[3]);

// -------------------
// ADD & REMOVE CLASS
// -------------------

const firstLi = document.querySelector('li:first-child');
// first grandchild of <li>
const link = firstLi.children[0];
let val;
val = link.className; // classes in string form
val = link.classList; // classes in dom token list
val = link.classList[0]; // first class
// add class
link.classList.add('test');
// remove class
link.classList.remove('test');


// -------------------
// ADD & REMOVE ATTR
// -------------------

val = link.getAttribute('href'); // get value
val = link.setAttribute('href', 'http://google.com'); // set value
val = link.hasAttribute('href'); // check for attr
link.removeAttribute('href'); // remove attr



```


















# DOM
* document object model
  * tree of nodes/elements created by the browser.
  * js can be used to read/write/manipulate to the DOM.
  * object oriented representation. (each node as properties/methods available.)
  * (window(document(node tree)))

```js

// document
let val;
val = document;
val = document.all; // html collection of nodes.
val = document.all.length; // length of html collection.
val = document.head; // document head.
val = document.body; // document body.
val = document.doctype; // doctype (<!DOCTYPE html>)
val = document.domain;
val = document.URL;
val = document.characterSet;
val = document.contentType;

// NOT RECOMMENDED -- USE SELECTORS
val = document.forms; // all forms in document (NOT RECOMMENDED)
val = document.forms[0]; // first form in document
val = document.forms[0].id;
val = document.forms[0].method; // GET, POST, ETC (for forms)
val = document.forms[0].action;
val = document.links; // links in html page
val = document.links[0].className; // string of classes.
val = document.links[0].classList; // DOM token list of classes;
val = document.links[0].classList[0]; // class from DOM token list.
val = document.images;
val = document.scripts;
val = document.scripts[2].getAttribute('src'); // src attribute for the second script element.

console.log(val);
```








END
