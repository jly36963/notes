// ------------
// socket.io notes
// ------------

// install (server)
  // npm i --save socket.io
// install (client)
  // npm i --save socket.io-client

// docs (server)
  // https://github.com/socketio/socket.io/blob/master/docs/README.md
  // https://github.com/socketio/socket.io#readme

// docs (client)
  // https://github.com/socketio/socket.io-client/blob/HEAD/docs/API.md


// ------------
// about
// ------------

// two parts
  // server
  // client

// real time bidirectional event-based communication
  // connections are established, even in the presence of proxies, load balancers, personal firewalls, antivirus softwares.
// uses engine.io
  // engine.io establishes a long-polling connection, then tries to upagrade to better transports if available.
// data support -- any serializable data structure can be emitted
// namespaces -- used to separate communication channels (but they will share the same underlying connection).
// rooms -- arbitrary channels within a namespace, that sockets can join and leave. rooms can be broadcasted to.

// ------------
// basic api usage (server)
// ------------

const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
  // create listeners (params: when to fire, callback to fire)
  client.on('connect', () => console.log('socket.io connect'))
  client.on('event', data => console.log(data))
  client.on('disconnect', () => console.log('socket.io disconnect'))
})
server.listen(5000);

// ------------
// basic server usage (express / koa)
// ------------

// express

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => { /* … */ });
server.listen(3000);

// koa

const app = require('koa')();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
io.on('connection', () => { /* … */ });
server.listen(3000);

// ------------
// basic api usage (client)
// ------------

import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const endpoint = 'http://localhost:5000'
const App = () => {
  const [number, setNumber] = useState("");
  useEffect(() => {
    const socket = socketIOClient(endpoint);
    socket.on("event-name-here", data => {
      setNumber(data);
    })
  }, []);
  return (
    <p>Number: {number}</p>
  )
}
export default App;


// ------------
//
// ------------



// ------------
// server api
// ------------



// ------------
// client api
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



