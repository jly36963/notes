import { useReducer } from "react";

interface CounterProps {
  title?: string;
}

const Counter = ({
  title = "useReducer example",
}: CounterProps): JSX.Element => {
  // ---
  // Todo reducer
  // ---

  interface CountState {
    value: number;
  }

  // Initial todo state
  const initialState: CountState = {
    value: 0,
  };

  // Reducer methods
  const incrementCount = (state: CountState, amount: number): CountState => {
    return { ...state, value: state.value + amount };
  };
  const decrementCount = (state: CountState, amount: number): CountState => {
    return { ...state, value: state.value - amount };
  };
  const resetCount = (state: CountState): CountState => {
    return { ...state, value: 0 };
  };

  type CountAction =
    | { type: "INC_COUNT"; amount: number }
    | { type: "DEC_COUNT"; amount: number }
    | { type: "RESET_COUNT" };

  type CountDispatch = React.Dispatch<CountAction>;

  const actionIncrementCount = (
    countDispatch: CountDispatch,
    amount = 1
  ): void => {
    countDispatch({
      type: "INC_COUNT",
      amount,
    } as CountAction);
  };
  const actionDecrementCount = (
    countDispatch: CountDispatch,
    amount = 1
  ): void => {
    countDispatch({
      type: "DEC_COUNT",
      amount,
    } as CountAction);
  };
  const actionResetCount = (countDispatch: CountDispatch): void => {
    countDispatch({ type: "RESET_COUNT" } as CountAction);
  };

  /** Reducer for todo state/actions */
  const countReducer = (
    countState: CountState,
    action: CountAction
  ): CountState => {
    switch (action.type) {
      case "INC_COUNT":
        return incrementCount(countState, action.amount);
      case "DEC_COUNT":
        return decrementCount(countState, action.amount);
      case "RESET_COUNT":
        return resetCount(countState);
      default:
        return countState;
    }
  };

  const [countState, countDispatch] = useReducer(countReducer, initialState);

  const { value: count } = countState;

  // Event handlers
  const handleIncrementCount = (): void => {
    actionIncrementCount(countDispatch);
  };
  const handleDecrementCount = (): void => {
    actionDecrementCount(countDispatch);
  };
  const handleResetCount = (): void => {
    actionResetCount(countDispatch);
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
