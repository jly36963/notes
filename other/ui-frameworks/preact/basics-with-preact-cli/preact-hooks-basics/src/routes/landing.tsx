import { h, Fragment } from "preact";
import { Link } from "preact-router/match";

const Landing = (): h.JSX.Element => {
  return (
    <>
      <h1>Preact Hooks Basics</h1>
      <Link href="/children-and-composition-example">
        Children and composition
      </Link>
      <Link href="/hooks-useState-example">useState example</Link>
      <Link href="/hooks-useState-map-example">useState map elements</Link>
      <Link href="/hooks-useEffect-cleanup-example">useEffect cleanup</Link>
      <Link href="/hooks-useEffect-fetch-example">useEffect with fetch</Link>
      <Link href="/hooks-useReducer-example">useReducer example</Link>
      <Link href="/hooks-useReducer-and-useContext-example">
        useContext with useReducer
      </Link>
      <Link href="/hooks-useRef-example">useRef example</Link>
    </>
  );
};

export default Landing;
