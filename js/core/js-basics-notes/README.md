# Javascript basics

## Advanced javascript

- javascript
  - single threaded language
  - callback loop
  - interpreted language
- code
  - interpreted: read line by line and executed. faster to stand up, slower performance.
  - compiled: converted to machine code. slower to stand up, faster performance
  - JIT: TODO
- js engine
  - ECMAScript engines: must conform to ECMA language standard.
    - v8 engine (nodejs, chrome): fastest, compliles to machine code
    - spidermonkey (firefox): slower, compiles to byte code (original js engine)
- v8 flow
  - parser -> AST -> interpreter -> bytecode
  - parser -> AST -> interpreter -> profiler -> compiler -> optimized code
- runtime
  - web API: native to browser, not JS. (DOM, requests (fetch), setTimeout)
  - memory heap: where memory is allocated
  - call stack: where code is in its execution
    - LIFO mode (last in, first out)
  - event loop
  - callback queue
  - job queue: like callback queue but for promises. has higher priority.
- async
  - call stack: LIFO mode (normal operations)
  - async event initiated: put on job/callback queue (job queue if promises are involved)
  - once call stack is clear, event loop checks for (ready) job/callback queue items
  - those job/callback queue items will be returned to call stack.

## Scope and hosting

- global scope
  - not in a function (closure)
  - accessible anywhere
- local scope
  - in a function
  - accessible only from that function
- nested scope
  - nested functions and their associated local scopes.
- block scope
  - let & const, if defined in a block, are limited to that scope
  - var does not support block scope
- lexical scope model
  - capturing free variables into lexical environments. implemented by closures
- static scope (lexical scope)
  - available data + variables where the function was defined
  - write time
- dynamic scope
  - available data + variables where the function is called.
  - run time
  - 'this' is dynamically scoped
- hoisting
  - moving declarations to the top of their environments (during compilation)
  - var: partially hoisted
    - declaration is hoisted, not the initialization. memory is allocated.
    - returns undefined if used before initizlization.
  - function: fully hoisted (doesn't work for function expressions)
  - let, const: not hoisted
- bubbling
  - look for variable in scope

## Functions

- expression
  - defined at runtime
- declaration
  - defined at parse time
- invocation/call/execution
  - creates execution context
  - gets 'this' keyword
  - gets 'arguments' keyword. (don't use these, it slows down compiler)

## Context vs scope

- context: value of 'this'. determined by how a function is invoked
- scope: visibility of variales
