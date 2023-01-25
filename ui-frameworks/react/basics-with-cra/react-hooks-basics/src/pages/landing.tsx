import { Link } from "react-router-dom";

const Landing = (): JSX.Element => {
  return (
    <>
      <h1>React Hooks Basics</h1>
      <Link to="/children-and-composition-example">
        Children and composition
      </Link>
      <Link to="/hooks-useState-example">useState example</Link>
      <Link to="/hooks-useState-map-example">useState map elements</Link>
      <Link to="/hooks-useEffect-cleanup-example">useEffect cleanup</Link>
      <Link to="/hooks-useEffect-fetch-example">useEffect with fetch</Link>
    </>
  );
};

export default Landing;
