//-------------------
// arrow functions (es6), callback (es5), promises (es6), async await (es7)
//-------------------


//-------------------
// callback functions
//-------------------

// createPost will create a post and then get all posts.
// callback will make sure that it executes functions in order.

let posts = [];
// create post function
function createPost(post, callback){
  posts.push(post);
  callback();
}
// get posts function to be used as callback
function getPosts(){
  let output = '';
  posts.forEach(function(post){
    output += `<li>${post.title}</li>`;
  })
  document.body.innerHTML = output;
}

// creation of post and retrieval of posts.
createPost({title: 'Post 1', body: 'This is post 1'}, getPosts);


//-------------------
// promises (ES6 alternative to callbacks)
//-------------------

// MDN example

function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

// udemy example

let posts = [];
// create post function
function createPost(post){
  return new Promise(function(resolve, reject){
    posts.push(post);
    // const error = true;
    if(!error){
      resolve();
    } else {
      reject('Error: Something went wrong!')
    }
  });
}
// get posts function to be used as callback
function getPosts(){
  let output = '';
  posts.forEach(function(post){
    output += `<li>${post.title}</li>`;
  })
  document.body.innerHTML = output;
}

// creation of post and retrieval of posts.
// then = resolve (normal), catch = reject (error)
createPost({title: 'Post 1', body: 'This is post 1'})
.then(getPosts)
.catch(function(err){
  console.log(err);
});


//-------------------
// ARROW FUNCTIONS (ES6)
//-------------------

// something about lexical this -- don't have to do 'let self = this;'

// use 'function' for global scope, 'class' for object constructors, '=>' everywhere else.
// stack overflow -- When should I use Arrow functions in ECMAScript 6?

// normal function
const sayHello = function(){
  console.log('Hello!');
}
sayHello();

// arrow 1
const sayHello = () => {
  console.log('Hello!');
}
sayHello();

// arrow 2 (one line function) (doesn't need curly braces)
const sayHello = () => console.log('Hello!')
sayHello();

// arrow 3 (one line function) (return)
const sayHello = () => 'Hello';
console.log(sayHello());

// arrow 4 (object literal) (wrap object in parentheses)
const sayHello = () => ({msg: 'Hello'});
console.log(sayHello());

// arrow 5 (parameters) (single parameter doesn't need parentheses)
const sayHello = (name) => console.log(`Hello ${name}!`);
const sayHello = name => console.log(`Hello ${name}!`);
sayHello('Landon');
const sayHello = (firstName, lastName) => console.log(`Hello ${firstName} ${lastName}!`);
sayHello('Landon', 'Yarrington');

// arrow 6 (arrow as callback)
const users = ['Nathan', 'John', 'William'];
const nameLengths = users.map(function(name){
  return name.length;
});
console.log(nameLengths);

const users = ['Nathan', 'John', 'William'];
const nameLengths = users.map((name) => {
  return name.length;
});
console.log(nameLengths);

const users = ['Nathan', 'John', 'William'];
const nameLengths = users.map((name) => name.length);
console.log(nameLengths);


//-------------------
// async / await
//-------------------

// async (without await)

async function myFunc(){
  return 'Hello';
}
console.log(myFunc()) // logs promise object
myFunc()
  .then(res => console.log(res)); // logs 'Hello'

// async (with await)

async function myFunc(){
  const promise = new Promise((resolve, reject) => {
    setTimout(() => resolve('Hello'), 1000))
  });
  if (!error){
    const res = await promise; // wait until promise is resolved
    return res;
  } else {
    await Promise.reject(new Error('Something went wrong'))
  }
}
myFunc()
  .then(res => console.log(res))
  .catch(err => console.log(err));

// async await (with fetch)

async function getUers() {
  // await response of the fetch call
  const response = await fetch(url);
  // only proceed once it's resolved
  const data = await response.json();
  // only proceed once second promise is resolved
  return data;
}

getUsers('https://jsonplaceholder.typicode.com/users')
  .then(users => console.log(users));


//-------------------
//
//-------------------





//-------------------
//
//-------------------




//-------------------
//
//-------------------


//-------------------
//
//-------------------
