import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

interface NumberProps {
  n: number;
  handleRemoveNumber: (n: number) => void;
}

const Number = (props: NumberProps): h.JSX.Element => {
  const { n, handleRemoveNumber } = props;
  return (
    <p>
      Number: {n}
      <span onClick={() => handleRemoveNumber(n)}> [x] </span>
    </p>
  );
};

const Numbers = (): h.JSX.Element => {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);

  const handleRemoveNumber = (n: number): void => {
    const filteredNumbers = numbers.filter((number) => number !== n);
    setNumbers(filteredNumbers);
  };

  return (
    <Fragment>
      <h2>Click x to remove</h2>
      <div>
        {numbers.map((n) => (
          <Number n={n} key={n} handleRemoveNumber={handleRemoveNumber} />
        ))}
      </div>
    </Fragment>
  );
};

export default Numbers;
