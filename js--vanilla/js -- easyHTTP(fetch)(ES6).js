// ES6 ajax library (classes)

class EasyHTTP{
  // GET request
  get(url){
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    })
  }
  // POST request
  post(url, data){
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    })
  }
  // PUT request
  put(url, data){
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    })
  }
  // DELETE request
  delete(url){
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'DELETE',
        headers: {'Content-type': 'application/json'},
      })
        .then(res => res.json())
        .then(() => resolve('Resource Deleted!'))
        .catch(err => reject(err));
    })
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
