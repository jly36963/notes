# xhr, fetch,

* most async code will be part of an API/library
  * XMLHttpRequest, Fetch, jQuery Ajax, Axios, Node.js fs module


``` js
//-------------------
// get text from a text file (XHR)
//-------------------

document.getElementByID('button').addEventListener('click', loadData);

function loadData(){
  // create an XHR object
  const xhr = new XMLHttpRequest();
  // OPEN (type of request, url/filename, async?)
  xhr.open('GET', 'data.txt', true)
  // XHR onload (used to be xhr.onreadystatechange)

  // optional -- used for spinners/loaders
  xhr.onprogress = function(){
    console.log('READYSTATE', xhr.readyState);
  }

  // what to do with response
  xhr.onload = function(){
    if(this.status === 200){
      console.log(this.responseText);
      document.getElementById('output').innerHTML = `<h1>${this.responseText}</h1>`
    }
  }
  // error handling
  xhr.onerror = function() {
    console.log('Request Error...');
  }
  // send request
  xhr.send();
}


//-------------------
// get data from JSON file (xhr) (one object)
//-------------------

// customer.json file needed for this request (here's what would be inside)
{
  "id": 1,
  "name": "John Doe",
  "company": "123 Designs",
  "phone": "444-555-6666"
}

// event listener for loadCustomer
document.getElementById('button1').addEventListener('click', loadCustomer);

// function for async request
function loadCustomer(e) {
  // create an XHR object
  const xhr = new XMLHttpRequest();
  // OPEN (type of request, url/filename, async?)
  xhr.open('GET', 'customer.json', true);

  // what to do with response
  xhr.onload = function(){
    if(this.status === 200){
      console.log(this.responseText);
      // parse response
      const customer = JSON.parse(this.responseText);
      // use data from response in html
      const output = `
        <ul>
          <li>ID: ${customer.id}</li>
          <li>Name: ${customer.name}</li>
          <li>Company: ${customer.company}</li>
          <li>Phone: ${customer.phone}</li>
        </ul>
      `;
      // insert html into web page
      document.getElementById('customer').innerHTML = output;
    }
  }

  // send request
  xhr.send();
}

//-------------------
// get data from JSON file (xhr) (array of objects)
//-------------------

// customers.json file needed for this request (here's what would be inside)
[
  {
    "id": 1,
    "name": "John Doe",
    "company": "123 Designs",
    "phone": "444-555-6666"
  },
  {
    "id": 2,
    "name": "Steve Smith",
    "company": "Hello Productions",
    "phone": "444-333-6666"
  },
  {
    "id": 3,
    "name": "Tara Williams",
    "company": "ABC Designs",
    "phone": "444-555-4444"
  }
]

// event listener for loadCustomer
document.getElementById('button2').addEventListener('click', loadCustomers);

// function for async request
function loadCustomer(e) {
  // create an XHR object
  const xhr = new XMLHttpRequest();
  // OPEN (type of request, url/filename, async?)
  xhr.open('GET', 'customers.json', true);
  // what to do with response
  xhr.onload = function(){
    if(this.status === 200){
      console.log(this.responseText);
      // parse response
      const customers = JSON.parse(this.responseText);
      // iterate through array from customers.json
      let output = '';
      customers.forEach(function(customer){
        // use data from response in html
        output += `
          <ul>
            <li>ID: ${customer.id}</li>
            <li>Name: ${customer.name}</li>
            <li>Company: ${customer.company}</li>
            <li>Phone: ${customer.phone}</li>
          </ul>
        `;
      });

      // insert html into web page
      document.getElementById('customers').innerHTML = output;
    }
  }

  // send request
  xhr.send();
}


//-------------------
// get data from external API
//-------------------

// every API is different. the object returned will come in varying formats.

// html file with input form. (input a number, get that many chuck norris jokes).

// event listener for 'get-jokes' button
document.querySelector('.get-jokes').addEventListener('click', getJokes);

// function for event listener ('get-jokes' button)
function getJokes(e){
  // get number from input
  const number = document.querySelector('input[type="number"]').value;
  // new XHR object
  const xhr = new XMLHttpRequest();
  // xhr open (number variable determines number of chuck norris jokes -- API)
  xhr.open('GET', `http://api.icndb.com/jokes/random/${number}`, true);
  // onload function (parse jokes and add to web page)
  xhr.onload = function(){
    if(this.status === 200) {
      const response = JSON.parse(this.responseText);
      console.log(response);
      // output for web page
      let output = '';
      // append jokes to 'output'
      if(response.type === 'success') {
        response.value.forEach( function(joke){
          output += `<li>${joke.joke}</li>`
        })
      // error handling
      } else {output += '<li>Something went wrong</li>'}
      // insert 'output' into web page
      document.querySelector('.jokes').innerHTML = output;
    }
  }

  xhr.send();

  e.preventDefault();
}


//-------------------
// fetch API (text file, json file, external API)
//-------------------

// button1 (test.txt)

document.getElementById('button1').addEventListener('click', getText);

function getText(){
  fetch('test.txt')
    // promise (return text )
    .then(function(res){
      // response object
      console.log(res); // type, url, body, headers, ok, status, statusText, __proto__ (text, json)
      // return text
      return res.text();
    })
    // promise (console log text, output to webpage)
    .then(function(data){
      console.log(data)
      document.getElementById('output').innerHTML = data;
    })
    // catch (console log error)
    .catch(function(err){
      console.log(err)
    });
}

// button2 (posts.json)

document.getElementById('button2').addEventListener('click', getJson);

function getJson()){
  fetch('posts.json')
    // promise (return text)
    .then(function(res){
      // response object
      console.log(res); // type, url, body, headers, ok, status, statusText, __proto__ (text, json)
      // return text
      return res.json();
    })
    // promise (output json to webpage)
    .then(function(data){
      let output = '';
      data.forEach(function(post){
        output += `<li>${post.title}</li>`
      });
      console.log(output);
      document.getElementById('output').innerHTML = output;
    })
    // catch (console log error)
    .catch(function(err){
      console.log(err)
    });
}


// button3 (url -- external API)

document.getElementById('button3').addEventListener('click', getExternal);

function getExternal()){
  fetch('https://api.github.com/users')
    // promise (return text)
    .then(function(res){
      // response object
      console.log(res); // type, url, body, headers, ok, status, statusText, __proto__ (text, json)
      // return text
      return res.json();
    })
    // promise (output json to webpage)
    .then(function(data){
      let output = '';
      data.forEach(function(user){
        output += `<li>${user.login}</li>`
      });
      console.log(output);
      document.getElementById('output').innerHTML = output;
    })
    // catch (console log error)
    .catch(function(err){
      console.log(err)
    });
}


//-------------------
// fetch API (arrow functions)
//-------------------

// button1 (test.txt)

document.getElementById('button1').addEventListener('click', getText);

function getText(){
  fetch('test.txt')
    // promise (return text)
    .then((res) => res.text())
    // promise (console log text, output to webpage)
    .then((data) => {
      console.log(data);
      document.getElementById('output').innerHTML = data;
    })
    // catch (console log error)
    .catch((err) => console.log(err));
}

// button2 (posts.json)

document.getElementById('button2').addEventListener('click', getJson);

function getJson()){
  fetch('posts.json')
    // promise (return text)
    .then((res) => res.json())
    // promise (output json to webpage)
    .then((data) => {
      let output = '';
      data.forEach((post) => output += `<li>${post.title}</li>`);
      console.log(output);
      document.getElementById('output').innerHTML = output;
    })
    // catch (console log error)
    .catch((err) => console.log(err));
}

// button3 (url -- external API)

document.getElementById('button3').addEventListener('click', getExternal);

function getExternal()){
  fetch('https://api.github.com/users')
    // promise (return text)
    .then((res) => res.json())
    // promise (output json to webpage)
    .then((data) => {
      let output = '';
      data.forEach((user) => output += `<li>${user.login}</li>`);
      console.log(output);
      document.getElementById('output').innerHTML = output;
    })
    // catch (console log error)
    .catch((err) => console.log(err));
}








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







//-------------------
//
//-------------------
```
