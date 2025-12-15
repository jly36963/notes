import { h } from "preact";
import { Route, Router } from "preact-router";

// Code-splitting is automated for `routes` directory
import Landing from "../routes/landing";
import UseStateExample from "../routes/hooks-useState-example";
import Children from "../routes/children-and-composition-example";
import MapElements from "../routes/hooks-useState-map-example";
import Cleanup from "../routes/hooks-useEffect-cleanup-example";
import MountFetch from "../routes/hooks-useEffect-fetch-example";
import UseReducerExample from "../routes/hooks-useReducer-example";
import UseContextAndUseReducerExample from "../routes/hooks-useReducer-and-useContext-example";
import UseRefExample from "../routes/hooks-useRef-example";

const App = (): h.JSX.Element => (
  <div id="root">
    <div id="app">
      <Router>
        <Route path="/" component={Landing} />
        <Route path="/hooks-useState-example" component={UseStateExample} />
        <Route path="/children-and-composition-example" component={Children} />
        <Route path="/hooks-useState-map-example" component={MapElements} />
        <Route path="/hooks-useEffect-cleanup-example" component={Cleanup} />
        <Route path="/hooks-useEffect-fetch-example" component={MountFetch} />
        <Route path="/hooks-useReducer-example" component={UseReducerExample} />
        <Route
          path="/hooks-useReducer-and-useContext-example"
          component={UseContextAndUseReducerExample}
        />
        <Route path="/hooks-useRef-example" component={UseRefExample} />
      </Router>
    </div>
  </div>
);

export default App;

/*

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Profile from "../routes/profile";

const App = (): h.JSX.Element => (
  <div id="app">
    <main>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/profile/" component={Profile} user="me" />
        <Route path="/profile/:user" component={Profile} />
      </Router>
    </main>
  </div>
);

*/
