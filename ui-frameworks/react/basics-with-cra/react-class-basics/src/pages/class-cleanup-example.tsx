import React from "react";

interface TimerState {
  time: number;
}

class Timer extends React.Component<{}, TimerState> {
  state = {
    time: 0,
  };

  timerID: ReturnType<typeof setInterval> | null = null;

  // Start timer on mount
  componentDidMount() {
    this.timerID = setInterval(
      () => this.setState({ time: this.state.time + 1 }),
      1000
    );
  }

  // Clear timer on unmount (prevent memory leak)
  componentWillUnmount() {
    clearInterval(this.timerID!);
  }

  render() {
    return (
      <div>
        <p>time: {this.state.time} seconds</p>
      </div>
    );
  }
}

export default Timer;
