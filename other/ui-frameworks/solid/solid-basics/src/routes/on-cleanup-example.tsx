import { JSX, createSignal, onCleanup, onMount } from "solid-js";
import type { Component } from "solid-js";

const Timer: Component = (): JSX.Element => {
  const [time, setTime] = createSignal(0);

  let timerId: number;
  onMount(() => {
    timerId = setInterval(() => setTime((time) => time + 1), 1000);
  });
  onCleanup(() => clearInterval(timerId));

  return (
    <div>
      <p>
        <strong>Time:</strong> {time} seconds
      </p>
    </div>
  );
};

export default Timer;
