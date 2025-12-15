import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./pages/landing";
import Children from "./pages/children-and-composition-example";
import Cleanup from "./pages/class-cleanup-example";
import Lifecycle from "./pages/class-lifecycle-example";
import MapElements from "./pages/class-map-example";
import MountFetch from "./pages/class-mount-fetch-example";
import ClassNoConstructor from "./pages/class-no-constructor-example";
import ClassWithConstructor from "./pages/class-with-constructor-example";

// TODO: DRY with paths

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/children-and-composition-example", element: <Children /> },
  { path: "/class-cleanup-example", element: <Cleanup /> },
  { path: "/class-lifecycle-example", element: <Lifecycle /> },
  { path: "/class-map-example", element: <MapElements /> },
  { path: "/class-mount-fetch-example", element: <MountFetch /> },
  { path: "/class-no-constructor-example", element: <ClassNoConstructor /> },
  {
    path: "/class-with-constructor-example",
    element: <ClassWithConstructor />,
  },
]);

function App(): JSX.Element {
  return (
    <div id="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
