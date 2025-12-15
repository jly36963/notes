import React from "react";

class Numbers extends React.Component {
  state = {
    numbers: [1, 2, 3, 4, 5],
  };

  handleRemoveNumber = (n: number): void => {
    const filteredNumbers = this.state.numbers.filter((number) => number !== n);
    this.setState({ numbers: filteredNumbers });
  };

  render() {
    return (
      <>
        <h2>Click x to remove</h2>
        <div>
          {this.state.numbers.map((n) => (
            <Number
              n={n}
              key={n}
              handleRemoveNumber={this.handleRemoveNumber}
            />
          ))}
        </div>
      </>
    );
  }
}

interface NumberProps {
  n: number;
  handleRemoveNumber: (n: number) => void;
}

const Number = (props: NumberProps): JSX.Element => {
  const { n, handleRemoveNumber } = props;
  return (
    <p>
      Number: {n}
      <span onClick={() => handleRemoveNumber(n)}> [x] </span>
    </p>
  );
};

export default Numbers;
