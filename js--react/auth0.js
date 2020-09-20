// -----------------
// auth0 and react
// -----------------

// https://auth0.com/docs/quickstart/spa/react/01-login#integrate-the-sdk

// -----------------
// json web token
// -----------------

// looks like: xxxxx.yyyyy.zzzzz

// header
  // algorithm (hs256)
  // type (jwt)
// payload (3 characters long)
  // value1 (iss -- issuer)
  // value2 (exp -- expiration time)
  // value3 (sub -- subject)
  // etc
// signature
  // HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)

// -----------------
// jwt workflow
// -----------------

// application requests authorization to auth server (auth0)
// when authorization is granted, auth server returns access token
// application uses access token to access a protected resource (my api)

// -----------------
// auth0 workflow
// -----------------

// user clicks login button
// auth0 sdk redirects to auth0 hosted login page
// user signs up
// credentials are sent to auth0
// if credentials work, auth0 returns jwt token
// jtw token is saved in localstorage
// use react to check for token
// if token, user is authenticated

// if requests are sent to back-end, jwt is used to authenticate?

// -----------------
// setup
// -----------------

// clients > create client > single page web application > react > add rules

// open client
// settings tab
  // name, domain, client ID, client secret
  // add 'allowed callback URLs'
    // http://localhost:3000/callback
// save changes

// -----------------
// invite-only workflow
// -----------------

// https://auth0.com/docs/design/creating-invite-only-applications

// create new users, import them into Auth0
// trigger the email verification process via Auth0
// trigger the password reset process via Auth0

// prevent users from adding themselves
  // under 'connections', open 'database'
  // select the 'Disable Sign Ups' option on the connection.

// create an application in the dashboard with the correct parameters
  // name -- give the app a clear name (this will be used in the invite emails)
  // application type -- SPA (react)
  // allowed callback urls -- url of the app (for redirect) (localhost, then deployed uri)

// this application will need the 'management api'
  // go to 'api' section of dashboard
  // select 'Auth0 Management API'
  // click 'Machine to Machine Applications' tab
  // find the app, toggle/set to 'authorized'
  // use 'down arrow' to open scopes. select the following scopes:
    // read users, update users, delete users, create users, create user_tickets
  // click update
  


// -----------------
// setting up app
// -----------------

// set up Auth0

// get application keys
  // create app
  // Application Settings are available from Auth0 dashboard
// set up callback URL
  // users will be redirected here after they have authenticated
  // callback URL must be whitelisted in 'Allowed Callback URLs' field in Application Settings.
// set up logout URL
  // users will be redirected to here after they log out.
  // logout URL must be whitelisted in 'Allowed Logoug URLs' field in Application Settings.
// configure allowed web origins
  // whitelist the URL for the app in the Allowed Web Origins field in Application Settings

// integrate Auth0

// save auth0-spa-js
  // npm install --save @auth0/auth0-spa-js
// import
  // import createAuth0Client from '@auth0/auth0-spa-js';

// upon login

// when a user logs in, Auth0 returns 3 items:
  // access_token -- 
  // id_token -- 
  // expires_in -- 




// -----------------
// Auth0 React wrapper
// -----------------

// src/react-auth0-wrapper.js
import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

// -----------------
// navbar
// -----------------

// src/components/NavBar.js

import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button
          onClick={() =>
            loginWithRedirect({})
          }
        >
          Log in
        </button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
    </div>
  );
};

export default NavBar;

// -----------------
// integrate SDK
// -----------------

// src/index.js

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-wrapper";
import config from "./auth_config.json";

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();


// -----------------
// auth_config.json
// -----------------

{
  "domain": "YOUR_DOMAIN",
  "clientId": "YOUR_CLIENT_ID"
}


// -----------------
// App
// -----------------

// src/App.js

import React from "react";
import NavBar from "./components/NavBar";
import { useAuth0 } from "./react-auth0-wrapper";

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div className="App">
      <header>
        <NavBar />
      </header>
    </div>
  );
}

export default App;

// -----------------
// private route
// -----------------

// src/components/PrivateRoute.js

import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path }
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  const render = props => isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;

// -----------------
// display contents of profile (example2)
// -----------------

// src/components/Profile.js

import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <>
      <img src={user.picture} alt="Profile" />

      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
    </>
  );
};

export default Profile;



// -----------------
// App (example2)
// -----------------

// src/App.js

import React from "react";
import NavBar from "./components/NavBar";

// New - import the React Router components, and the Profile page component
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";

function App() {
  return (
    <div className="App">
      {/* New - use BrowserRouter to provide access to /profile */}
      <BrowserRouter>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact />
          <Route path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;



// -----------------
// navbar (example2)
// -----------------

// src/components/NavBar.js
// .. other imports

// NEW - import the Link component
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    // .. code removed for brevity

    { isAuthenticated && <button onClick={() => logout()}>Log out</button>}

{/* NEW - add a link to the home and profile pages */ }
{
  isAuthenticated && (
    <span>
      <Link to="/">Home</Link>&nbsp;
        <Link to="/profile">Profile</Link>
    </span>
  )
}

    //..
  );
};

export default NavBar;


// -----------------
// App (example2)(protected route)
// -----------------

// src/App.js

// .. other imports removed for brevity

// NEW - import the PrivateRoute component
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    {/* other components removed for brevity */ }

    {/* NEW - Modify the /profile route to use PrivateRoute instead of Route */ }
  <PrivateRoute path="/profile" component={Profile} />
  );
}

export default App;



// -----------------
// 
// -----------------




// -----------------
// 
// -----------------




// -----------------
// 
// -----------------




// -----------------
// 
// -----------------





// -----------------
// sdk (youtube example?)
// -----------------

// npm install auth0-js

// create 'src/utils/auth.js'
import auth0 from 'auth0-js';
export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'domain string from auth0 settings',
    clientID: 'client ID string from auth0 settings',
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid profile email'
  })

  login = () => {
    this.auth0.authorize()
  }

  handleAuth = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult) {
        localStorage.setItem('access_token', authResult.access_token)
        localStorage.setItem('id_token', authResult.id_token)
        let expiresAt = authResult.expiresIn * 1000 + newDate().getTime()
        expiresAt = JSON.stringify(expiresAt)
        localStorage.setItem('expiresAt', expiresAt)
      } else {
        console.log(err)
      }
    })
  }

  logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expiresAt')
  }

  isAuthenticated = () => {
    let expiresAt = JSON.parse(localStorage.getItem('expiresAt'))
    return new Date().getTime() < expiresAt // true : still good, false: expired
  }
}

// in component that uses Auth (srs/components/dashboard.js)
import Auth from '../utils/auth';
return (
  <div>
    <button onClick={() => this.props.auth.login()}>Login</button>
    <button onClick={() => this.props.auth.logout()}>Logout</button>
  </div>
)

// in 'src/components/callback.js' (where auth0 redirects to)
import React from 'react';
const Callback = (props) => (
  <div>
    <p>Callback Page</p>
    {console.log(props)}
  </div>
);
export default Callback;

// create route in router (in App.js or wherever else)
import React, { Component } from 'react';
import Callback from './components/callback';
import { Router, Route, Switch } from 'react-router';
import Dashboard from '.components/dashboard';

const auth = new Auth()

const handleAuthentication = (props) => {
  if (props.location.hash) {
    auth.handleAuth()
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <Switch>
              <Route exact path='/' render={() => <Dashboard auth={auth} />} />
              <Route exact path='/callback' render={handleAuthentication(props); return<Callback />} />
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}
}
