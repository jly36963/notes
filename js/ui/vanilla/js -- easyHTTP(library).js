// ES5 object-oriented libary (protoypes)
function easyHTTP(){
  this.http = new XMLHttpRequest();
}

// ------------------
// GET request
// ------------------

// const http = new easyHTTP;
// http.get(url, function(err, response) {
//  if(err) {
//    console.log(err);
//  } else {
//    console.log(response);
//  })

// 'get' prototype method
easyHTTP.prototype.get = function(url, callback){
  // xhr open (xhr object created earlier)
  this.http.open('GET', url, true);
  // capturing 'this' value because it won't work inside another function
  let self = this;
  // onload function
  this.http.onload = function(){
    // if successful, if not successful
    if(self.http.status === 200) {
      callback(null, self.http.responseText); // error, response
    } else {
      callback('Error: ' + self.http.status);
    }
  }
  // send request
  this.http.send();
}

// ------------------
// POST request
// ------------------

//  const data = {
//   title: 'Custom Post',
//   body: 'This is a custom post'
// };

// const http = new easyHTTP;
// http.post(url, data, function(err, post ){
//   if(err) {
//     console.log(err);
//   } else {
//     console.log(post);
//   }
// });

// 'post' prototype method
easyHTTP.prototype.post = function(url, data, callback){
  // xhr open (xhr object created earlier)
  this.http.open('POST', url, true);
  // set request header
  this.http.setRequestHeader('Content-Type', 'application/json');
  // capture 'this' value for use in functions.
  let self = this;
  // onload function
  this.http.onload = function() {
    callback(null, self.http.responseText);
  }
  // send request
  this.http.send(JSON.stringify(data));
}


// ------------------
// PUT request
// ------------------

// const data = {
//   title: 'Custom Post',
//   body: 'This is a custom post'
// };

// const http = new easyHTTP;
// http.put(url, data, function(err, post){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(post);
//   }
// });


// 'put' prototype method
easyHTTP.prototype.put = function(url, data, callback){
  // xhr open (xhr object created earlier)
  this.http.open('PUT', url, true);
  // set request header
  this.http.setRequestHeader('Content-Type', 'application/json');
  // capture 'this' value for use in functions.
  let self = this;
  // onload function
  this.http.onload = function() {
    callback(null, self.http.responseText);
  }
  // send request
  this.http.send(JSON.stringify(data));
}


// ------------------
// DELETE request
// ------------------

// const http = new easyHTTP;
// http.delete(url, function(err, response) {
//  if(err) {
//    console.log(err);
//  } else {
//    console.log(response);
//  })


// 'delete' prototype method
easyHTTP.prototype.delete = function(url, callback){
  // xhr open (xhr object created earlier)
  this.http.open('DELETE', url, true);
  // capturing 'this' value because it won't work inside another function
  let self = this;
  // onload function
  this.http.onload = function(){
    // if successful, if not successful
    if(self.http.status === 200) {
      callback(null, 'Post deleted!'); // error, response
    } else {
      callback('Error: ' + self.http.status);
    }
  }
  // send request
  this.http.send();
