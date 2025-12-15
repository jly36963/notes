# Localstorage

TODO: update

## About

- localStorage API is part of the window object.
- getItem, setItem, removeItem (methods)
- local storage can only hold values as strings.
  - turn arrays/objects into strings using JSON.stringify
  - use JSON.parse to turn it back into an array/object.
- localStorage persists beyond session, unlike sessionStorage

## Local storage syntax

```js
// Set localStorage item
localStorage.setItem("name", "John"); // (key, value)

// Remove from storage
localStorage.removeItem("name");

// Get from storage
const name = localStorage.getItem("name");
console.log(name);

// Clear local storage
localStorage.clear(); // console.log(name); === null
```

## Session storage syntax

```js
// Set sessionStorage item
sessionStorage.setItem("name", "Beth");
```

## Local storage example

A todo list example

```js
// Event listener for form
const handleFormAction = (e) => {
  // Prevent normal form behavior
  e.preventDefault();
  // Get value from form
  const task = document.getElementById('task').value;
  // Get tasks from LS (or default to empty array)
  const taskData = localStorage.getItem('tasks') // string | null
  let tasks = taskData ? JSON.parse(tasks) : [];
  // Add task (form value) to tasks array
  tasks.push(task);
  // Stringify and store tasks
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // Notify user
  alert('Task Saved!');
}

document.querySelector('form').addEventListener('submit', handleFormAction)

const tasks = JSON.parse(localStorage.getItem('tasks'));
tasks.forEach(function(task)){
  console.log(task);
}
```
