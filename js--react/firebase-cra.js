// ------------
// firebase
// ------------

// npm install --save firebase

// docs -- https://firebase.google.com/docs

// ------------
// create application
// ------------

// create app
  // firebase website > go to console > add project
  // enter name, opt in/out of analytics
// services
  // auth -- project > develop > authentication
  // db -- project > develop > database
  // file storage -- project > develop > storage
// register
  // project > project overview > 'web' button
  // enter nickname
  // 'add firebase SDK' -- copy config object contents (key, id, etc)

// create database
  // project > develop > database > create database (button)
  // start in test mode (locked mode later)
  // data -- collection of documents
    // add collection 'users'
    // add document in collection (id, field, type/value) (can add more fields)
  // rules -- configure access to database

// if config object is lost
  // go to project overview > click on 'apps' button
  // click on app, config object should be in resulting page.

// enable providers
  // project > develop > authentication > sign-in method (tab)
  // edit/enable desired provider (email/password, google, etc).

// ------------
// firebase (CRA + hooks)
// ------------

// firebase utils (/firebase/firebase.utils.js)
  // js sdk for firebase

// imports
import firebase from 'firebase/app';
import 'firebase/firestore'; // database
import 'firebase/auth'; // auth
// config
const config = {
  apiKey: "api-key-here",
  authDomain: "domain-here",
  databaseURL: "db-url-here",
  projectId: "project-id-here",
  storageBucket: "storage-bucket-here",
  messagingSenderId: "message-sender-id-here",
  appId: "app-id-here"
};
// intitialize
firebase.initializeApp(config);
// init & export
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export default firebase;

// private route (/components/PrivateRoute.js)
  // re-direct if not logged in

// imports
import React from "react";
import { Route, Redirect } from "react-router-dom";
// private route HOC
const PrivateRoute = ({ component: Component, authState, ...rest }) => {
  // render based on initializiting, then based on existence of authState
  let render;
  if (authState.initializing === true) {
    render = () => <div></div>
  } else {
    render = (props) => authState.currentUser ? <Component {...props} authState={authState} /> : <Redirect to='/login' />
  }
  return (
    // if currentUser, open Route.else, redirect to login 
    <Route {...rest} render={render} />
  );
}
export default PrivateRoute;

// navbar (/components/MainNavbar.js)
  // logout button

// import libraries
import React from 'react';
import { auth } from '../firebase/firebase.utils';
import { withRouter } from 'react-router'; // router HOC (provides 'history' as prop to component)
// component
const MainNavbar = ({ currentUser, history }) => {
  // handle logout button press
  const handleSignOut = async (e) => {
    await auth.signOut();
  }
  // *** jsx here ***
};
// export with HOC
export default withRouter(MainNavbar);

// signup (/components/Signup/Signup.js)
  // signup form

// library imports
import React, { useState } from 'react';
import { auth } from '../../utils/firebase.utils';
// component
const Signup = () => {
  // helper function -- validate email
  const validateEmail = (email) => {
    const validEmail = true; // pretend validation
    return validEmail;
  }
  const validatePW = (pw1, pw2) => {
    const validPW = true;
    return validPW;
  }
  // event handler -- sign up (form submission)
  const onSubmit = async (e) => {
    e.preventDefault();
    // *** validate email & pw first ***
    try {
      // create account with password (wait for response)
      const firebaseResponse = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
      const { user: firebaseUser } = firebaseResponse;
      // send email (confirm user)
      const emailTaskStatus = await firebaseUser.sendEmailVerification();
      console.log("email task status:", emailTaskStatus);
      // sign out user (user gets automatically signed in)
      auth.signOut();
      console.log(`Account created for ${formData.email}. Please verify email.`)
    } catch (err) {
      console.log(err.message)
    }
  }
}

// login (/components/Login/Login.js)
  // login form

const Login = ({ history }) => {
  // handle login (form submission)
  const handleLogin = async (e) => {
    e.preventDefault() // prevent default form action
    try {
      // make firebase authentication request
      const { email, password } = formData;
      const loginResponse = await auth.signInWithEmailAndPassword(email, password);
      const { user } = loginResponse;
      if (!user) {
        console.log(`Credentials do not match any of our records.`)
        return;
      }
      // if email is not verified, sign out and prompt to verify.
      if (!user.emailVerified) {
        auth.signOut(); // sign out user
        console.log(`Please verify account. Email was sent to ${user.email}.`)
        return;
      }
      history.push('/'); // redirect on login
    } catch (err) {
      console.log(err.message);
    }
  } 
  // *** jsx here ***
}
export default Login;

// reset password

// library imports
import React, { useState } from 'react';
import { auth } from '../../utils/firebase.utils';
// component
const ResetPassword = () => {
  // event handler -- reset password (form submission)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { email } = formData;
      // send password reset email
      await auth.sendPasswordResetEmail(email);
      console.log(`Email sent to ${email}`)
    } catch (err) {
      console.log(err.message);
    }
  }
  // *** jsx here ***
}

// app (/App.js)
  // manage auth state and pass to components

// import libraries
import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { auth } from './firebase/firebase.utils';
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, Box } from '@material-ui/core';
// import components
import PrivateRoute from './components/PrivateRoute';
import MainNavbar from './components/MainNavbar';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Landing from './components/Landing/Landing';
import NotFound from './components/NotFound/NotFound';
// main app component
const App = () => {
  // user state (hook)
  const initialUserState = auth.currentUser || null;
  const initializing = true;
  const [authState, setAuthState] = useState({
    currentUser: initialUserState,
    initializing: initializing
  });
  // handle user state updates (and clean-up)
    // listeners have to be removed before unmount.
    // function components -- useEffect hook has this functionality built in.
    // class components --  use ComponentDidMount and ComponentWillUnmount life-cycle methods.
  useEffect(() => {
    // handle status updates (synchronous)
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setAuthState({initializing: false, currentUser: currentUser});
    });
    // cleanup
    return unsubscribe;
  }, []);
  // jsx
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Fragment>
          <MainNavbar 
            currentUser={authState.currentUser}
          />
          <Box minHeight="100vh">
            {/* switch */}
            <Switch>
              {/* Landing */}
              <PrivateRoute
                exact path='/'
                authState={authState}
                component={Landing}
              />
              {/* Login */}
              <Route
                exact path='/login'
                render={(props) => <Login {...props} />}
              />
              {/* signup */}
              <Route
                exact path='/signup'
                render={(props) => <Signup {...props} />}
              />
              {/* ResetPassword */}
              <Route 
                exact path='/reset-password' 
                component={ResetPassword} 
              />
              {/* NotFound */}
              <Route 
                component={NotFound} 
              />
            </Switch>
          </Box>
          <MainFooter />
        </Fragment>
      </Router>
    </ThemeProvider>
  );
};
export default App;


// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



