// ES7 ajax library (async wait)

class EasyHTTP {
  // GET Request
  async get(url) {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  }
  // POST Request
  async post(url, data) {
    const response = await fetch(url {
      method: 'POST',
      headers {'Content-type': 'application/json'},
      body: JSON.stringify(data)
    });
    const resData = await response.json();
    return resData;
  }
  // PUT Request
  async put(url, data) {
    const response = await fetch(url, {
      method: 'PUT',
      headers {'Content-type': 'application/json'},
      body: JSON.stringify(data)
    });
    const resData = await response.json();
    return resData;
  }
  // DELETE Request
  async delete(url) {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {'Content-type': 'application/json'}
    });
    const resData = await 'Resource Deleted...';
    return resData;
  }
}

// ------------------
// GET request
// ------------------

const http = new EasyHTTP
const users = http.get('https:/jsonplaceholder.typicode.com/users')
  .then(data => console.log(data))
  .catch(err => console.log(err));

// ------------------
// POST request
// ------------------

const data = {
  name: 'John Doe',
  username: 'johndoe',
  email: 'jdoe@gmail.com'
}

const http = new EasyHTTP
const users = http.post('https:/jsonplaceholder.typicode.com/users', data)
  .then(data => console.log(data))
  .catch(err => console.log(err));

// ------------------
// PUT request
// ------------------

const data = {
  name: 'John Doe',
  username: 'johndoe',
  email: 'jdoe@gmail.com'
}

const http = new EasyHTTP
const users = http.put('https:/jsonplaceholder.typicode.com/users/2', data)
  .then(data => console.log(data))
  .catch(err => console.log(err));

// ------------------
// DELETE request
// ------------------

const http = new EasyHTTP
const users = http.delete('https:/jsonplaceholder.typicode.com/users/2')
  .then(data => console.log(data))
  .catch(err => console.log(err));
