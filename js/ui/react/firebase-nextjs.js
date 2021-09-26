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
// firebase (nextjs + hooks)
// ------------

// firebase utils (src/utils/firebase.utils.js)
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

// navbar (/src/components/MainNavbar.js)

// library imports
import React, { useState } from 'react';
import { auth } from '../utils/firebase.utils';
// components
const MainNavbar = ({ authState }) => {
  // home
  const handleHome = () => {
    if (currentUser && Object.keys(currentUser).length) {
      Router.push("/user/home")
    } else {
      Router.push("/auth/login")
    }
  }
  // login
  const handleLogin = () => {
    Router.push("/auth/login")
  }
  // handle logout button press
  const handleSignOut = async (e) => {
    await auth.signOut(); // sign out firebase user
  }
  // *** jsx ***
}

// signup (/src/pages/auth/signup.js)

import React, { useState } from 'react';
import { auth } from '../../utils/firebase.utils';

const Signup = () => {
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

// reset-password (/src/pages/auth/reset-password.js)

import React, { useState } from 'react';
import { auth } from '../../utils/firebase.utils';

const ResetPassword = () => {
  // event handler (reset password form submission)
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
  // *** jsx ***
}

// login (/src/pages/auth/login.js)

// library imports
import React, { useState } from 'react';
import { auth } from '../../utils/firebase.utils';
// component
const Login = () => {
  // event handler (login form submission)
  const handleLogin = async (e) => {
    e.preventDefault() // prevent default form action
    try {
      // make firebase authentication request
      const { email, password } = formData;
      const { user } = loginResponse;
      const loginResponse = await auth.signInWithEmailAndPassword(email, password);
      if (!user) {
        console.log('Credentials do not match any of our records');
        return;
      }
      if (!user.emailVerified) {
        // sign out user, prompt email verification
        auth.signOut();
        console.log(`Please verify account. Email was sent to ${user.email}.`)
        return;
      }
      // redirect on login
      Router.push('/user/home');
    } catch (err) {
      console.error(err.message);
    }
  }
  // *** jsx ***
}

// app override (/src/pages/_app.js)

// library imports
import React, { useState, useEffect } from 'react';
import MainNavbar from '../components/MainNavbar';
import { auth } from '../utils/firebase.utils';
// component
const MyApp = ({ Component, pageProps }) => {
  // auth state
  const initialUserState = auth.currentUser || null;
  const [authState, setAuthState] = useState({
    currentUser: initialUserState,
    initializing: true
  });
  // initialize auth state
  useEffect(() => {
    // handle status updates (synchronous)
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setAuthState({ initializing: false, currentUser: currentUser });
    });
    // cleanup
    return unsubscribe;
  }, []);
  // current user
  const { currentUser } = authState;
  if (currentUser) {
    var { uid } = currentUser;
  }
  // jsx
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* navbar */}
      <MainNavbar
        authState={authState}
        setAuthState={setAuthState}
      />
      {/* component */}
      <Head>
        {/* title */}
        <title>Title Here</title>
      </Head>
      <Component {...pageProps} 
        authState={authState}
        setAuthState={setAuthState}
      />
    </ThemeProvider>
  )
}