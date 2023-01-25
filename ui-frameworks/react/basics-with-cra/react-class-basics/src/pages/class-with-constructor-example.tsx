import React from "react";

// super: calls parent constructor
// In react, must be called if constructor method is used
// pass props to constructor and parent constructor to avoid bugs with 'this'

// this.setState: shallow merge provided object with state

// bind: bind current context to methods

interface CounterProps {
  title?: string;
}

interface CounterState {
  count: number;
}

class Counter extends React.Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);

    this.state = {
      count: 0,
    };

    this.handleIncrementCount = this.handleIncrementCount.bind(this);
    this.handleDecrementCount = this.handleDecrementCount.bind(this);
  }

  // Event handlers
  handleIncrementCount(): void {
    this.setState({ count: this.state.count + 1 });
  }
  handleDecrementCount(): void {
    this.setState({ count: this.state.count - 1 });
  }
  handleResetCount(): void {
    this.setState({ count: 0 });
  }

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
