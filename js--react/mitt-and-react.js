// ------------
// mitt
// ------------

// install
`
npm i --save mitt
`

// using ES6 modules
// import mitt from 'mitt'

// using CommonJS modules
// var mitt = require('mitt')

// ------------
// usage
// ------------

// import
import mitt from 'mitt';
// create emitter
const emitter = mitt()
// listen to an event
emitter.on('foo', e => console.log('foo', e))
// listen to all events
emitter.on('*', (type, e) => console.log(type, e))
// fire an event
emitter.emit('foo', { a: 'b' })
// register event handler:
const onFoo = () => {
  // do something
}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten

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




// ------------
//
// ------------




// ------------
//
// ------------




