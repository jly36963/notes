import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./pages/landing";
import UseStateExample from "./pages/hooks-useState-example";
import Children from "./pages/children-and-composition-example";
import MapElements from "./pages/hooks-useState-map-example";
import Cleanup from "./pages/hooks-useEffect-cleanup-example";
import MountFetch from "./pages/hooks-useEffect-fetch-example";
import UseReducerExample from "./pages/hooks-useReducer-example";
import UseContextAndUseReducerExample from "./pages/hooks-useReducer-and-useContext-example";
import UseRefExample from "./pages/hooks-useRef-example";

// TODO: DRY with paths

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/children-and-composition-example", element: <Children /> },
  { path: "/hooks-useState-example", element: <UseStateExample /> },
  { path: "/hooks-useState-map-example", element: <MapElements /> },
  { path: "/hooks-useEffect-cleanup-example", element: <Cleanup /> },
  { path: "/hooks-useEffect-fetch-example", element: <MountFetch /> },
  { path: "/hooks-useReducer-example", element: <UseReducerExample /> },
  {
    path: "/hooks-useReducer-and-useContext-example",
    element: <UseContextAndUseReducerExample />,
  },
  { path: "/hooks-useRef-example", element: <UseRefExample /> },
]);

function App(): JSX.Element {
  return (
    <div id="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
