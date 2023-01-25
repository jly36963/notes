import React, { useState, useContext, createContext, useReducer } from "react";

// ---
// Todo reducer
// ---

type TodoStatus = "unstarted" | "started" | "complete";

interface Todo {
  id: string;
  name: string;
  status: TodoStatus;
}

interface TodoState {
  todos: Todo[];
}

// Initial todo state
const initialState: TodoState = {
  todos: [],
};

// Reducer methods
const addTodo = (state: TodoState, name: string): TodoState => {
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    name,
    status: "unstarted",
  };
  return { ...state, todos: [...state.todos, newTodo] };
};
const removeTodo = (state: TodoState, todoId: string): TodoState => {
  const remainingTodos = state.todos.filter((todo) => todo.id !== todoId);
  return { ...state, todos: remainingTodos };
};
const _updateTodoStatus = (
  todoState: TodoState,
  id: string,
  newStatus: TodoStatus
): TodoState => {
  const todo = todoState.todos.find((todo: Todo) => todo.id === id);
  if (!todo) {
    console.log(`Todo not found: ${id}`);
    return todoState;
  }
  const idx = todoState.todos.indexOf(todo);
  const updated = [
    ...todoState.todos.slice(0, idx),
    { ...todo, status: newStatus },
    ...todoState.todos.slice(idx + 1),
  ];
  return { ...todoState, todos: updated };
};
const startTodo = (todoState: TodoState, id: string): TodoState => {
  return _updateTodoStatus(todoState, id, "started");
};
const completeTodo = (todoState: TodoState, id: string): TodoState => {
  return _updateTodoStatus(todoState, id, "complete");
};

type TodoAction =
  | { type: "ADD_TODO"; name: string }
  | { type: "START_TODO"; id: string }
  | { type: "COMPLETE_TODO"; id: string }
  | { type: "REMOVE_TODO"; id: string };

// Action creators
const actionAddTodo = (todoDispatch: TodoDispatch, name: string) => {
  todoDispatch({
    type: "ADD_TODO",
    name,
  } as TodoAction);
};
const actionRemoveTodo = (todoDispatch: TodoDispatch, id: string) => {
  todoDispatch({
    type: "REMOVE_TODO",
    id,
  } as TodoAction);
};
const actionStartTodo = (todoDispatch: TodoDispatch, id: string) => {
  todoDispatch({
    type: "START_TODO",
    id,
  } as TodoAction);
};
const actionCompleteTodo = (todoDispatch: TodoDispatch, id: string) => {
  todoDispatch({
    type: "COMPLETE_TODO",
    id,
  } as TodoAction);
};

/** Reducer for todo state/actions */
const todoReducer = (todoState: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "ADD_TODO":
      return addTodo(todoState, action.name);
    case "REMOVE_TODO":
      return removeTodo(todoState, action.id);
    case "START_TODO":
      return startTodo(todoState, action.id);
    case "COMPLETE_TODO":
      return completeTodo(todoState, action.id);
    default:
      return todoState;
  }
};

// ---
// Context
// ---

type ReactChildren = JSX.Element | JSX.Element[];
type TodoDispatch = React.Dispatch<TodoAction>;

interface AppContextType {
  todos: {
    todoState: TodoState;
    todoDispatch: TodoDispatch;
  };
}

let AppContext: React.Context<AppContextType>;

/** Provider component */
const AppProvider = ({ children }: { children: ReactChildren }) => {
  const [todoState, todoDispatch] = useReducer(todoReducer, initialState);

  const value = {
    todos: {
      todoState,
      todoDispatch,
    },
  };
  AppContext = createContext<AppContextType>(value);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ---
// Components
// ---

/** Todo form component */
const TodoForm = () => {
  const {
    todos: { todoDispatch },
  } = useContext(AppContext);
  const [formValue, setFormValue] = useState("");

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFormValue(e.currentTarget.value);
  };
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (formValue.trim().length > 0) actionAddTodo(todoDispatch, formValue);
    setFormValue("");
  };

  return (
    <form onSubmit={onSubmit} className="todo-form">
      <input type="text" value={formValue} onChange={onChange} />
      <button type="submit">Add Todo</button>
    </form>
  );
};

/** Todo list component */
const TodoList = () => {
  const {
    todos: { todoState, todoDispatch },
  } = useContext(AppContext);

  const todoList = todoState.todos.map(({ id, name, status }) => (
    <TodoListItem
      key={id}
      id={id}
      name={name}
      status={status}
      todoDispatch={todoDispatch}
    />
  ));
  return <ul className="list">{todoList}</ul>;
};

/** Todo component */
const TodoListItem = (props: Todo & { todoDispatch: TodoDispatch }) => {
  const { id, name, status, todoDispatch } = props;

  const handleStartTodo = (todoDispatch: TodoDispatch, id: string): void => {
    actionStartTodo(todoDispatch, id);
  };
  const handleCompleteTodo = (todoDispatch: TodoDispatch, id: string): void => {
    actionCompleteTodo(todoDispatch, id);
  };
  const handleRemoveTodo = (todoDispatch: TodoDispatch, id: string): void => {
    actionRemoveTodo(todoDispatch, id);
  };

  const todoStyle = {
    color: (status === "complete" && "#90a4ae") || "#01579b",
    textDecoration: (status === "complete" && "line-through") || "none",
  };

  const getStatus = (): JSX.Element => {
    if (status === "complete") {
      return <span>complete</span>;
    }
    const updateAction =
      status === "unstarted" ? handleStartTodo : handleCompleteTodo;
    return (
      <span style={todoStyle} onClick={() => updateAction(todoDispatch, id)}>
        {status}
      </span>
    );
  };

  return (
    <>
      <span>
        <strong>Name: </strong>
        {name}
      </span>
      {", "}
      <span>
        <strong>Status: </strong>
        {getStatus()}
      </span>
      {", "}
      <span onClick={() => handleRemoveTodo(todoDispatch, id)}>[x]</span>
      <br />
    </>
  );
};

const TodoContextExample = (): JSX.Element => {
  return (
    <AppProvider>
      <h1>Todos</h1>
      <div>
        <TodoForm />
        <TodoList />
      </div>
    </AppProvider>
  );
};

export default TodoContextExample;
