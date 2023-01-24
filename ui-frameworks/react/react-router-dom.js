// -----------
// react router
// -----------

// TODO: update/refactor

// react-router -- uses 'history' api to hijack routing
// browser router -- router
// switch -- only use the first match
// route -- route
// exact -- must be exact match
// path -- path to match url against
// component -- component to use for route
// render -- use function to return component without re-mounting on every update
// https://tylermcginnis.com/react-router-pass-props-to-components/
// link -- react-router friendly link
// match prop -- use slugs in component (ie '/users/:userId' --> '/users/13')
// history prop -- use 'history' API in component
// withRouter -- HOC for routing (avoid prop drilling the 'history' prop)
// export default withRouter(ChildComponent);

import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  withRouter,
} from "react-router-dom";

const Landing = (props) => {
  return (
    <div>
      <p>Landing</p>
      <button onClick={() => props.history.push("/about")}>About</button>
    </div>
  );
};
const About = () => {
  return (
    <div>
      <p>About</p>
    </div>
  );
};
const NotFound = () => {
  return (
    <div>
      <p>NotFound</p>
      <Link to="/">Back</Link>
    </div>
  );
};
const UserDetail = (props) => {
  return <div>User: {props.match.params.userId}</div>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/about" component={About} />
        <Route path="/user/:userId" component={UserDetail} />
        <Route exact path="/home" render={(props) => <Home {...props} />} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
