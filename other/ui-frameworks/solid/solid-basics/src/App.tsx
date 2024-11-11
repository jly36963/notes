import type { Component } from "solid-js";
import { JSX } from "solid-js";
import { Routes, Route } from "@solidjs/router";

import Landing from "./routes/landing";
import Children from "./routes/children-and-composition-example";
import CreateSignalExample from "./routes/createSignal-example";
import Cleanup from "./routes/on-cleanup-example";
import ResourceExample from "./routes/resource-example";
import MapElements from "./routes/createSignal-map-example";
import RefBindingExample from "./routes/ref-binding-example";

const App: Component = (): JSX.Element => {
  return (
    <div id="app">
      <Routes>
        <Route path="/" component={Landing} />
        <Route path="/children-and-composition-example" component={Children} />
        <Route path="/createSignal-map-example" component={MapElements} />
        <Route path="/createSignal-example" component={CreateSignalExample} />
        <Route path="/on-cleanup-example" component={Cleanup} />
        <Route path="/resource-example" component={ResourceExample} />
        <Route path="/ref-binding-example" component={RefBindingExample} />
      </Routes>
    </div>
  );
};

export default App;

/*
// From ts template

import styles from "./App.module.css";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
      </header>
    </div>
  );
};
*/
