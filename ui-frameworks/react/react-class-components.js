// ---------------
// react class components
// ---------------

// TODO: update/refactor

// ---------------
// example (class)
// ---------------

import React, { Component } from "react";

class Counter extends Component {
  // constructor
  constructor(props) {
    // super
    // calls the constructor of its parent
    // must be called in subclasses (if constructor is called) for 'this' to work properly
    // pass props to constructor and parent constructor to avoid bugs when using 'this.props.xxx'
    super(props);

    // state
    this.state = {
      count: 0,
    };
    // bind context (this)
    this.incrementCount = this.incrementCount.bind(this);
    this.decrementCount = this.decrementCount.bind(this);
  }
  // class methods
  incrementCount() {
    this.setState({ count: this.state.count + 1 }); // shallow merge (update only the properties specified)
  }
  decrementCount() {
    this.setState({ count: this.state.count - 1 }); // shallow merge (update only the properties specified)
  }
  // render
  render() {
    // jsx
    return (
      <>
        <button onClick={() => this.incrementCount()}> + </button>
        <button onClick={() => this.decrementCount()}> - </button>
        <p>Count: {this.state.count}</p>
      </>
    );
  }
}

// ---------------
// example (avoid constructor) (avoid binding 'this') (setState with callback)
// ---------------

class Counter extends Component {
  // state
  state = { count: 0 };
  // class property & arrow function (no need to bind 'this')
  incrementCount = () => this.setState({ count: this.state.count + 1 });
  // setState + callback
  incrementCountWithCallback = () =>
    this.setState(
      { count: this.state.count + 1 }, // state to update
      () => console.log(this.state.count) // callback once state has updated
    );
  // update state using previous state (prevState + prevProps)
  incrementCountWithPrevState = () =>
    this.setState((prevState, prevProps) => ({
      count: prevState.count + 1,
    }));
  // render
  render() {
    // jsx
    return (
      <div>
        <button onClick={this.incrementCount}> + </button>
        <p>{this.state.count}</p>
      </div>
    );
  }
}

// ---------------
// example (nested components)
// ---------------

class Numbers extends Component {
  // state
  state = {
    numbers: [1, 2, 3, 4, 5],
  };

  removeNumber = (n) => {
    const filteredNumbers = this.state.numbers.filter((number) => number !== n);
    this.setState({ numbers: filteredNumbers });
  };

  render() {
    return (
      <>
        {this.state.numbers.map((number) => (
          <Number
            number={number}
            key={number}
            removeNumber={this.removeNumber}
          />
        ))}
      </>
    );
  }
}

const Number = (props) => {
  const { number, removeNumber } = props;
  console.log(removeNumber);
  return (
    <p>
      Number: {number}
      <span onClick={() => removeNumber(number)}>x</span>
    </p>
  );
};

// ---------------
// example (children) (composition)
// ---------------

const Wrapper = (props) => {
  return (
    <div className={`super-important-class border-${props.color}`}>
      {props.children}
    </div>
  );
};

const WelcomeDialogue = (props) => {
  return (
    <Wrapper color="gray">
      <h1>Welcome!</h1>
      <p>Thank you for visiting!</p>
    </Wrapper>
  );
};

// ---------------
// example (mount/unmount)
// ---------------

class Timer extends Component {
  state = {
    time: 0,
  };

  // start timer on mount
  componentDidMount() {
    this.timerID = setInterval(
      () => this.setState({ time: this.state.time + 1 }),
      1000
    );
  }

  // clear timer on unmount (prevent memory leak)
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div>
        <p>time: {this.state.time} seconds</p>
      </div>
    );
  }
}

// ---------------
// example (fetch) (componentDidMount)
// ---------------

class User extends Component {
  state = {
    user: null,
  };
  // lifecycle methods
  componentDidMount() {
    // async function -- fetch and update state
    const fetchUserAndUpdateState = async () => {
      const apiResponse = await this.fetchUser();
      const { data: user, err } = apiResponse;
      if (err) {
        console.log(err);
        return;
      }
      this.setState({ user }); // no error, update state with fetched user
    };
    // call fetch function
    fetchUserAndUpdateState();
  }
  // class methods
  fetchUser = async () => {
    try {
      const apiResponse = await fetch(
        "https://jsonplaceholder.typicode.com/users/1"
      );
      const user = await apiResponse.json();
      return { data: user, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };
  // render
  render() {
    // jsx
    return (
      <div>
        {this.state.user && Object.keys(this.state.user).length && (
          <p>Name: {this.state.user.name}</p>
        )}
      </div>
    );
  }
}

// ---------------
// example (lifecycle)
// ---------------

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

class App extends Component {
  state = {
    count: 1,
  };

  // lifecycle methods
  componentDidMount() {
    console.log("componentDidMount"); // when component mounts (useful for fetching)
  }
  componentDidUpdate() {
    console.log("componentDidUpdate"); // when component updates
  }
  componentWillUnmount() {
    console.log("componentWillUnmount"); // when component unmounts (useful for cleanup)
  }

  // optimization
  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate"); // decide if compoment should go through update phase
    const shouldUpdate = this.props.count !== nextState.count; // only update component if different
    return shouldUpdate;
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
      </div>
    );
  }
}

// ---------------
// rest
// ---------------

// if passing multiple props to children, use rest operator

const Parent = ({ id, ...other }) => {
  <Child id={id} {...other} />;
};
