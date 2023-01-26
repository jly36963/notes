import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

const Timer = (): h.JSX.Element => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    // Set timer
    const timerId = setInterval(() => setTime((time) => time + 1), 1000);
    // Return cleanup method
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div>
      <p>
        <strong>Time:</strong> {time} seconds
      </p>
    </div>
  );
};

export default Timer;
