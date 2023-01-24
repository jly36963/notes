// ---
// MUI
// ---

// TODO: update/refactor

// docs
// https://material-ui.com/
// https://github.com/mui-org/material-ui

// packt
// https://github.com/PacktPublishing/React-Material-UI-Cookbook/tree/master/src/Chapter02AppBar

`
npm install @material-ui/core --save
npm install @material-ui/styles --save
npm install @material-ui/icons --save
npm install @material-ui/lab --save
`;

// ---
// key terms
// ---

// createMuiTheme -- create a theme, based on options received.
// ThemeProvider (v4) -- takes a theme property, uses react context to make theme available
// CssBaseline -- makes UI default consistent. (like normalize.css or a css reset)

// MuiThemeProvider (v3) -- takes a 'theme' propety. it uses react context to make theme available.
// MuiThemeProvider is for HOC style theme (sithStyles)

// ---
// example 1 (MuiThemeProvider) (basic)
// ---

// imports
import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
/* SKIPPED -- import route components */

// default material ui theme generation
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const App = (props) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          {/* Routing according to the path entered */}
          <Route exact path="/" component={HomePage} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));

// ---
// example 2 (ThemeProvider)
// ---

// tutorial
// https://www.nearform.com/blog/forget-everything-you-learned-about-react-hooks-rock/

// imports
import React, { useState } from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import { makeStyles, useTheme, ThemeProvider } from "@material-ui/styles";
import {
  Paper,
  Button,
  TextField,
  Typography,
  Table,
  TableRow,
  TableCell,
  TextField,
  TableBody,
  TableHead,
} from "@material-ui/core";

// CUSTOM HOOK FOR INPUT ELEMENTS
// handleChange, handleBlur, handleValidate
// uses validate callback and regex

const useInput = (name, defaultValue, validate, regex) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    setValue(e.target.value);
    setError(null);
  };
  const handleBlur = () => {
    handleValidate();
  };
  const handleValidate = () => {
    const valid = validate && validate(value, regex);
    setError(!valid);
    return valid;
  };
  return {
    props: {
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      error,
    },
    validate: handleValidate,
  };
};

// REGEX VALIDATIONS
const validations = {
  // eslint-disable-next-line
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  NUMBER: /^\d*$/,
};

// CUSTOM HOOK FOR FORM SUBMISSIONS
// cycle through inputs, call validation handler
// if invalid inputs, store in errorItems
// if no invalid items, call 'success' callback function with valid data

const useSubmit = (inputs, success) => {
  const [errorItems, setErrorItems] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const errorItems = inputs.filter((input) => !input.validate());
    setErrorItems(errorItems);
    if (errorItems && errorItems.length === 0) {
      success &&
        success(
          inputs.map(({ props: { name, value } }) => ({
            name,
            value,
          }))
        );
    }
  };
  return {
    props: {
      onSubmit: handleSubmit,
    },
    errorItems,
  };
};

// FORM
// makeStyles -- create material-ui custom hook.
// useStyles -- use output of 'makeStyles', get reference to 'classes' object
// withTheme -- option that provides access to 'theme' object within 'makeStyles' function.
// useTheme -- MaterialUI's custom hook that gives the component access to 'theme'
// useCallback -- creates memoized version of function

const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing.unit * 3,
    },
    form: {
      marginTop: theme.spacing.unit * 3,
    },
    input: {
      marginBottom: theme.spacing.unit * 3,
    },
  }),
  { withTheme: true }
);

const Form = () => {
  const classes = useStyles();
  const theme = useTheme();
  const handleValidation = (value, regex) => {
    if (value && regex && value.match(regex)) return true;
    return false;
  };
  const email = useInput("Email", "", handleValidation, validations.EMAIL);
  const age = useInput("Age", "", handleValidation, validations.NUMBER);
  const [data, setData] = useState(null);
  const handleSuccess = (data) => {
    setData(data);
  };
  const submit = useSubmit([email, age], handleSuccess);
  // jsx
  return (
    <Paper className={classes.root}>
      <Typography variant="h4">NearForm Hooks Demo</Typography>
      <Typography variant="body1" color="primary">
        Theme primary color = {theme.palette.primary.main} (obtained from
        useTheme hook)
      </Typography>
      <form className={classes.form} {...submit.props}>
        <TextField label="Email" variant="outlined" {...email.props} />
        {email.props.error && (
          <Typography variant="body1" color="error">
            Invalid Email address
          </Typography>
        )}

        <TextField label="Age" variant="outlined" {...age.props} />
        {age.props.error && (
          <Typography variant="body1" color="error">
            Invalid age
          </Typography>
        )}

        <Button type="submit" color="primary" variant="contained">
          Submit
        </Button>
        {submit.errorItems && submit.errorItems.length > 0 && (
          <Typography variant="body1" color="error">
            {`Please fix ${submit.errorItems && submit.errorItems.length} form
           field error(s)`}
          </Typography>
        )}
      </form>

      {data && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Input Field</TableCell>
              <TableCell>Validated Input</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={`form-${index}`}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

// APP

// create our material ui theme using up to date typography variables
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

// Let's convert App from class to function to get into the mood!
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Form />
    </ThemeProvider>
  );
};

// ---
// example 3
// ---

// tutorial
// https://steemit.com/utopian-io/@pckurdu/build-an-application-with-react-hooks-material-ui-and-firebase-part2

// imports

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { makeStyles, useTheme, ThemeProvider } from "@material-ui/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
  Paper,
  Button,
  TextField,
  Typography,
  Table,
  TableRow,
  TableCell,
  TextField,
  TableBody,
  TableHead,
  Avatar,
  FormControl,
  Input,
  InputLabel,
} from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// HOMEPAGE

const useStyles = makeStyles(
  (theme) => ({
    main: {
      width: "auto",
      display: "block",
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${
        theme.spacing.unit * 3
      }px`,
    },
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: theme.palette.primary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
    },
  }),
  { withTheme: true }
);

const HomePage = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <VerifiedUserOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Hi Steemit User
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.submit}
          onClick={() => props.history.push("/register")}
        >
          Register
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => props.history.push("/login")}
        >
          Login
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
          onClick={() => props.history.push("/dashboard")}
        >
          Dashboard
        </Button>
      </Paper>
    </main>
  );
};

// LOGIN PAGE

const Login = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // handle login here
  };

  const onChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="off"
              autoFocus
              value={loginData.email}
              onChange={(e) => onChange(e)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="off"
              value={loginData.password}
              onChange={(e) => onChange(e)}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            Sign in
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="secondary"
            className={classes.submit}
            onClick={() => props.history.push("/register")}
          >
            Register
          </Button>
        </form>
      </Paper>
    </main>
  );
};

// REGISTER PAGE

const Register = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const onChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();
    // handle register here
  };

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register Account
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              name="name"
              autoComplete="off"
              autoFocus
              value={registerData.name}
              onChange={(e) => onChange(e)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="off"
              value={registerData.email}
              onChange={(e) => onChange(e)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="off"
              value={registerData.password}
              onChange={(e) => onChange(e)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password2">Confirm Password</InputLabel>
            <Input
              name="password2"
              type="password"
              id="password2"
              autoComplete="off"
              value={registerData.password2}
              onChange={(e) => onChange(e)}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleRegister}
          >
            Register
          </Button>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            onClick={() => props.history.push("/login")}
          >
            Go back to Login
          </Button>
        </form>
      </Paper>
    </main>
  );
};

// APP

// create our material ui theme using up to date typography variables
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

// Let's convert App from class to function to get into the mood!
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

// ---
// example 4 (only core, NO mui/style)
// ---

// todo list
// https://codesandbox.io/s/r7qjrm4w0n?from-embed

// imports
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { DeleteIcon } from "@material-ui/icons";
import {
  Typography,
  TextField,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  IconButton,
} from "@material-ui/core";

// USE INPUT STATE (CUSTOM HOOK)

const useInputState = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: (event) => {
      setValue(event.target.value);
    },
    reset: () => setValue(""),
  };
};

// USE TODO STATE (CUSTOM HOOK)

const useTodoState = (initialValue) => {
  const [todos, setTodos] = useState(initialValue);
  return {
    todos,
    addTodo: (todoText) => {
      setTodos([...todos, todoText]);
    },
    deleteTodo: (todoIndex) => {
      const newTodos = todos.filter((_, index) => index !== todoIndex);
      setTodos(newTodos);
    },
  };
};

// TODO LIST

const TodoList = ({ todos, deleteTodo }) => (
  <List>
    {todos.map((todo, index) => (
      <ListItem key={index.toString()} dense button>
        <Checkbox tabIndex={-1} disableRipple />
        <ListItemText primary={todo} />
        <ListItemSecondaryAction>
          <IconButton
            arial-label="Delete"
            onClick={() => {
              deleteTodo(index);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
);

// TODO FORM

const TodoForm = ({ saveTodo }) => {
  const { value, reset, onChange } = useInputState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        saveTodo(value);
        reset();
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Add todo"
        margin="normal"
        value={value}
        onChange={onChange}
      />
    </form>
  );
};

// INDEX

function App() {
  const { todos, addTodo, deleteTodo } = useTodoState([]);

  return (
    <div className="App">
      <Typography component="h1" variant="h2">
        Todos
      </Typography>

      <TodoForm
        saveTodo={(todoText) => {
          const trimmedText = todoText.trim();
          if (trimmedText.length > 0) {
            addTodo(trimmedText);
          }
        }}
      />

      <TodoList todos={todos} deleteTodo={deleteTodo} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// ---
// example 5 (drawer)
// ---

// https://medium.com/@nthchildconsulting/react-material-ui-drawer-using-hooks-c80a3c429abe

import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { makeStyles, useTheme, ThemeProvider } from "@material-ui/styles";
import {
  IconButton,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  SwipeableDrawer,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

// CONTEXT

// store
const initialState = {
  darkMode: false,
};

// STYLES

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    top: 5,
    right: 5,
  },
  drawer: {
    width: 250,
  },
  drawerItem: {
    padding: 15,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
}));

// DRAWER

const Drawer = ({ classes, align = "left" }) => {
  const classes = useStyles();
  const { darkMode, setAndStoreDarkMode } = useContext(Store);
  const [open, setOpen] = useState(false);
  return (
    <div className={classes.root}>
      <IconButton
        color="inherit"
        aria-label="Settings"
        onClick={() => setOpen(true)}
      >
        <Typography>
          <MenuIcon fontSize="large" />
        </Typography>
      </IconButton>
      <SwipeableDrawer
        anchor={align}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <div className={classes.drawer}>
          <Typography
            component="h5"
            variant="h6"
            align="center"
            style={{
              margin: 10,
            }}
          >
            Settings
          </Typography>
          <Divider />
          <div className={classes.drawerItem}>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setAndStoreDarkMode(!darkMode)}
                />
              }
              label="Dark Mode"
            />
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
};

// APP

// create our material ui theme using up to date typography variables
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Drawer align="left" />
      {/* components */}
    </ThemeProvider>
  );
};

// INDEX

const app = (
  <StoreProvider>
    <App />
  </StoreProvider>
);
ReactDOM.render(app, document.getElementById("root"));
