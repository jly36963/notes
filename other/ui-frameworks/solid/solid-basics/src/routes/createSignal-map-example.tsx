import { JSX, For, createSignal } from "solid-js";
import type { Component } from "solid-js";

interface NumberProps {
  n: number;
  handleRemoveNumber: (n: number) => void;
}

const Number: Component<NumberProps> = (props: NumberProps): JSX.Element => {
  return (
    <p>
      Number: {props.n}
      <span onClick={() => props.handleRemoveNumber(props.n)}> [x] </span>
    </p>
  );
};

const Numbers: Component = (): JSX.Element => {
  const [numbers, setNumbers] = createSignal([1, 2, 3, 4, 5]);

  const handleRemoveNumber = (n: number): void => {
    // NOTE: this is an arbitrary example
    // This would be bad if array has duplicates
    const filtered = numbers().filter((number) => number !== n);
    setNumbers(filtered);
  };

  return (
    <>
      <h2>Click x to remove</h2>
      <div>
        <For each={numbers()}>
          {(n: number) => (
            <Number n={n} handleRemoveNumber={handleRemoveNumber} />
          )}
        </For>
      </div>
    </>
  );
};

export default Numbers;
