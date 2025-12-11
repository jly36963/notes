import React from "react";

// Example with no constructor or method context bindings

interface CounterProps {
  title?: string;
}

interface CounterState {
  count: number;
}

class Counter extends React.Component<CounterProps, CounterState> {
  state = { count: 0 };

  // Event handlers
  handleIncrementCount = (): void => {
    this.setState({ count: this.state.count + 1 });
  };
  handleDecrementCount = (): void => {
    this.setState({ count: this.state.count - 1 });
  };
  handleResetCount = (): void => {
    this.setState({ count: 0 });
  };

  // Render: return jsx
  render() {
    const { title = "Classes example" } = this.props;
    return (
      <>
        <h2>{title}</h2>
        <h3>Count: {this.state.count}</h3>
        <div>
          <button onClick={() => this.handleIncrementCount()}>+</button>
          <button onClick={() => this.handleDecrementCount()}>-</button>
          <button onClick={() => this.handleResetCount()}>&#8635;</button>
        </div>
      </>
    );
  }
}

export default Counter;
