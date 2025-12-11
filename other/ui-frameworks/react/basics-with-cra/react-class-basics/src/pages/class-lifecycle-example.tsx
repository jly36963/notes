import React from "react";

interface CounterProps {}
interface CounterState {
  count: number;
}

class Counter extends React.Component<CounterProps, CounterState> {
  state = { count: 0 };

  // Lifecycle methods
  componentDidMount() {
    console.log("componentDidMount"); // when component mounts (useful for fetching)
  }
  componentDidUpdate() {
    console.log("componentDidUpdate"); // when component updates
  }
  componentWillUnmount() {
    console.log("componentWillUnmount"); // when component unmounts (useful for cleanup)
  }
  shouldComponentUpdate(
    _nextProps: CounterProps,
    nextState: CounterState
  ): boolean {
    const shouldUpdate = this.state.count !== nextState.count;
    console.log("shouldComponentUpdate:", shouldUpdate);
    return shouldUpdate;
  }

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
    return (
      <>
        <h2>Lifecycle methods</h2>
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

// https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class

// mounting
// render phase
// constructor
// render
// commit phase
// react interacts with DOM / refs
// component did mount
// updating (new props, setState, forceUpdate)
// render phase
// render
// commit phase
// react interacts with DOM / refs
// componentDidUpdate
