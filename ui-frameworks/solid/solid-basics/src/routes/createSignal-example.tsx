import { JSX, createSignal, mergeProps } from "solid-js";
import type { Component } from "solid-js";

interface CounterProps {
  title?: string;
}

const Counter: Component = (props: CounterProps): JSX.Element => {
  // Merge props with defaults
  const p = mergeProps({ title: "useState example" }, props);

  const [count, setCount] = createSignal(0);

  // Event handlers
  const handleIncrementCount = (): void => {
    setCount((c) => c + 1);
  };
  const handleDecrementCount = (): void => {
    setCount((c) => c - 1);
  };
  const handleResetCount = (): void => {
    setCount(() => 0);
  };

  return (
    <>
      <h2>{p.title}</h2>
      <h3>Count: {count()}</h3>
      <div>
        <button onClick={handleIncrementCount}>+</button>
        <button onClick={handleDecrementCount}>-</button>
        <button onClick={handleResetCount}>&#8635;</button>
      </div>
    </>
  );
};

export default Counter;
