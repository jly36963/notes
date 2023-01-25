import React from "react";
import { Link } from "react-router-dom";

class Landing extends React.Component {
  state = {};
  render() {
    return (
      <>
        <h1>React Class Basics</h1>
        <Link to="/children-and-composition-example">
          Children and composition
        </Link>
        <Link to="/class-cleanup-example">Cleanup</Link>
        <Link to="/class-no-constructor-example">Class (no constructor)</Link>
        <Link to="/class-with-constructor-example">
          Class (with constructor)
        </Link>
        <Link to="/class-lifecycle-example">Lifecycle</Link>
        <Link to="/class-map-example">Map elements</Link>
        <Link to="/class-mount-fetch-example">Mount with fetch</Link>
      </>
    );
  }
}

export default Landing;
