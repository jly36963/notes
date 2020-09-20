// ---------------
// material ui (styles)
// ---------------

`
npm install @material-ui/core --save
npm install @material-ui/styles --save
npm install @material-ui/icons --save
npm install @material-ui/lab --save
`

// ---------------
// basic usage
// ---------------

// higher order component usage:
  // https://material-ui.com/styles/basics/#higher-order-component-api
  // withStyles

// hooks usage:
  // makeStyles -- create material-ui custom hook.
  // useStyles -- use output of 'makeStyles', get reference to 'classes' object

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

const MyComponent = () => {
  const classes = useStyles();
  const handleClick = e => console.log('clicked');

  return (
    <div className={classes.root}>
      <Button onClick={e => handleClick(e)}>Click Me</Button>
    </div>
  );
};


// ---------------
// adapting the hook api (use functions/props to determine class styles)
// ---------------

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    background: props =>
      props.color === 'red'
        ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: props =>
      props.color === 'red'
        ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
        : '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: 8,
  },
});

const MyButton = (props) => {
  const { color, ...other } = props;
  const classes = useStyles(props);
  return <Button className={classes.root} {...other} />;
}

MyButton.propTypes = {
  color: PropTypes.oneOf(['blue', 'red']).isRequired,
};

const AdaptingHook = () => {
  return (
    <React.Fragment>
      <MyButton color="red">Red</MyButton>
      <MyButton color="blue">Blue</MyButton>
    </React.Fragment>
  );
}

// ---------------
// theme (theme  provider)
// ---------------

// imports
import { ThemeProvider } from '@material-ui/styles';
import { useTheme } from '@material-ui/styles';
// theme
const theme = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
};
// app
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/dashboard' component={Dashboard} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
// dexcendent of App
const DeepChild = () => {
  const theme = useTheme();
  return (/* jsx here */);
}

// ---------------
// createMuiTheme (palette)
// ---------------

// https://material-ui.com/customization/palette/

import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

// re-create default palette values
const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});

// dark theme
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});


// ---------------
// createMuiTheme (typography)
// ---------------

// change font family
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

// change font size
const theme = createMuiTheme({
  typography: {
    fontSize: 12,
  },
});

// change html font size
const theme = createMuiTheme({
  typography: {
    // Tell Material-UI what's the font-size on the html element is.
    htmlFontSize: 10,
  },
});

// ---------------
// MuiThemeProvider (color)
// ---------------

// https://material-ui.com/customization/color/


// color hue
  // hues -- https://material-ui.com/customization/color/#color-palette

// syntax
import HUE from '@material-ui/core/colors/HUE';
const color = HUE[SHADE]; 

// example
import { red } from '@material-ui/core/colors';
const color = red[500];

// use with MuiThemeProvider
import { createMuiTheme } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: '#f44336',
    },
  },
});

// customize main, light, dark (and contrast text)
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

// ---------------
//
// ---------------




// ---------------
//
// ---------------



// ---------------
//
// ---------------






// ---------------
//
// ---------------



// ---------------
//
// ---------------




// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------




// ---------------
//
// ---------------



// ---------------
//
// ---------------






// ---------------
//
// ---------------



// ---------------
//
// ---------------




// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------




// ---------------
//
// ---------------



// ---------------
//
// ---------------






// ---------------
//
// ---------------



// ---------------
//
// ---------------




// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------



// ---------------
//
// ---------------




// ---------------
//
// ---------------



// ---------------
//
// ---------------



