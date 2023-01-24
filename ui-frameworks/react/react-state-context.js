// -------------------
// react context api
// -------------------

// TODO: update/refactor

// api docs
// https://reactjs.org/docs/context.html
// https://reactjs.org/docs/context.html#examples

// when to use:
// when a prop gets used by many components at different levels

// Provider -- allows consuming components to subscribe to context changes
// Consumer -- allows consuming the value store from the context provider
// useContext -- react hook that returns the current value of context object.

// -------------------
// example 1
// -------------------

// code from:
// https://medium.com/swlh/mimic-redux-with-react-context-api-and-hooks-21fbec280205

//imports
import React, { useState, useContext, createContext, useReducer } from "react";
import ReactDOM from "react-dom";
import uuidv4 from "uuid/v4"; // npm install uuidv4

// store
const initialState = {
  todos: [],
};
const Store = createContext(initialState);

// reducer methods
const addTodo = (state, todoText) => {
  const newTodo = {
    id: uuidv4(),
    text: todoText,
    status: "incomplete",
  };
  return { ...state, todos: [...state.todos, newTodo] };
};
const removeTodo = (state, todoId) => {
  const remainingTodos = state.todos.filter((todo) => todo.id !== todoId);
  return { ...state, todos: remainingTodos };
};
const editTodoStatus = (state, todoId, status) => {
  const todo = state.todos.find((todo) => todo.id === todoId);
  const todoIndex = state.todos.indexOf(todo);
  const updatedTodo = { ...todo, status };
  const updatedTodos = [
    ...state.todos.slice(0, todoIndex),
    updatedTodo,
    ...state.todos.slice(todoIndex + 1),
  ];
  return { ...state, todos: updatedTodos };
};
// actions
const actionAddTodo = (todo, dispatch) => {
  dispatch({
    type: "ADD_TODO",
    todoText,
    todo,
  });
};
const actionRemoveTodo = (todoId, dispatch) => {
  dispatch({
    type: "REMOVE_TODO",
    todoId,
  });
};
const actionEditTodoStatus = (todoId, status, dispatch) => {
  dispatch({
    type: "EDIT_TODO_STATUS",
    todoId,
    status,
  });
};
// reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return addTodo(state, action.todoText);
    case "REMOVE_TODO":
      return removeTodo(state, action.todoId);
    case "EDIT_TODO_STATUS":
      return editTodoStatus(state, action.todoId, action.status);
    default:
      return state;
  }
};
// provider
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

// form component
const TodoForm = () => {
  const { dispatch } = useContext(Store);
  // form hook
  const [formValue, setFormValue] = useState("");
  // on change
  const onChange = (e) => {
    setFormValue(e.target.value);
  };
  // on submit
  const onSubmit = (e) => {
    e.preventDefault();
    if (formValue.trim().length > 0) addTodo(formValue, dispatch);
    setFormValue("");
  };
  // jsx
  return (
    <form onSubmit={onSubmit} className="todo-form">
      <input type="text" value={formValue} onChange={onChange} />
      <button type="submit">Add Todo</button>
    </form>
  );
};

// list component
const TodoList = () => {
  const { state, dispatch } = useContext(Store);
  const todoList = state.todos.map((todo) => (
    <Todo
      key={todo.id}
      todoId={todo.id}
      todoText={todo.text}
      todoStatus={todo.status}
      dispatch={dispatch}
    />
  ));
  return <div className="todo-list">{todoList}</div>;
};

// todo component
const Todo = (props) => {
  const { todoId, todoText, todoStatus, dispatch } = props;
  // change status
  const changeStatus = (todoId, todoStatus, dispatch) => {
    const newStatus = todoStatus === "incomplete" ? "complete" : "incomplete";
    actionEditTodoStatus(todoId, newStatus, dispatch);
  };
  // remove todo
  const removeTodo = (todoId, dispatch) => {
    actionRemoveTodo(todoId, dispatch);
  };
  // style
  const todoStyle = {
    color: (todoTag === "complete" && "#90a4ae") || "#01579b",
    textDecoration: (todoTag === "complete" && "line-through") || "none",
  };
  // jsx
  return (
    <div className="todo">
      <span
        style={todoStyle}
        onClick={() => changeStatus(todoId, todoStatus, dispatch)}
      >
        {todoText}
      </span>
      <button onClick={() => removeTodo(todoId, dispatch)}>x</button>
    </div>
  );
};

// app component
const App = () => {
  return (
    <div className="App">
      <h1>Todo App</h1>
      <div>
        <TodoForm />
        <TodoList />
      </div>
    </div>
  );
};

// index
const app = (
  <StoreProvider>
    <App />
  </StoreProvider>
);
ReactDOM.render(app, document.getElementById("root"));
