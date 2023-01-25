import { useState } from "react";

interface CounterProps {
  title?: string;
}

const Counter = ({ title }: CounterProps): JSX.Element => {
  const [count, setCount] = useState(0);

  // Event handlers
  const handleIncrementCount = (): void => {
    setCount(count + 1);
  };
  const handleDecrementCount = (): void => {
    setCount(count - 1);
  };
  const handleResetCount = (): void => {
    setCount(0);
  };

  return (
    <>
      <h2>{title}</h2>
      <h3>Count: {count}</h3>
      <div>
        <button onClick={handleIncrementCount}>+</button>
        <button onClick={handleDecrementCount}>-</button>
        <button onClick={handleResetCount}>&#8635;</button>
      </div>
    </>
  );
};

export default Counter;
