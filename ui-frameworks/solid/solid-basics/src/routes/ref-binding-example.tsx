import { JSX, createEffect, createSignal } from "solid-js";
import type { Component } from "solid-js";
import * as d3 from "d3";

// ---
// Helpers
// ---

// Max value of generated random ints
const MAX_INT = 10;

/** Generate random integer between 0 and max */
const randInt = (max: number) => {
  if (max <= 0) {
    throw new Error("max should be a positive number");
  }
  return Math.ceil(Math.random() * Math.ceil(max));
};

// ---
// Graph component
// ---

interface GraphProps {
  data: number[];
}

const Graph: Component<GraphProps> = (props: GraphProps): JSX.Element => {
  let d3Container: SVGSVGElement | undefined;

  // Manipulate the DOM the react way (after component is mounted)
  createEffect(() => {
    if (!props.data || !d3Container) {
      return;
    }
    // Select container
    const svg = d3.select(d3Container);

    // Set properties
    const width = 300;
    const x = d3.scaleLinear().domain([0, MAX_INT]).range([0, width]);
    const y = d3
      .scaleBand()
      .domain(d3.range(props.data.length).map(String))
      .range([0, 10 * props.data.length]);

    // Update container
    const updatedSvg = svg
      .attr("width", width)
      .attr("height", y.range()[1])
      .attr("font-family", "sans-serif")
      .attr("font-size", "10")
      .attr("text-anchor", "end");

    // Clear old
    const oldBar = updatedSvg.selectAll("g");
    oldBar.remove();

    // Re-draw
    const bar = updatedSvg
      .selectAll("g")
      .data(props.data)
      .join("g")
      .attr("transform", (_d, i) => `translate(0,${y(String(i))})`);

    bar
      .append("rect")
      .attr("fill", "#ace")
      .attr("width", x)
      .attr("height", y.bandwidth() - 1);

    bar
      .append("text")
      .attr("fill", "white")
      .attr("x", (d) => x(d) - 3)
      .attr("y", () => y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text((d) => d);

    updatedSvg.exit().remove();
  });
  // jsx
  return (
    <div style={{ height: "15rem" }}>
      <svg class="d3-component" ref={d3Container} />
    </div>
  );
};

// ---
// Container component
// ---

const UseRefExample = (): JSX.Element => {
  const [data, setData] = createSignal<number[]>([]);

  /** Add random int to data */
  const pushInt = (): void => {
    setData([...data(), randInt(MAX_INT)]);
  };
  /** Remove last int from data */
  const popInt = (): void => {
    if (!data().length) return;
    const newData = data().slice(0, data.length - 1);
    setData(newData);
  };

  return (
    <div>
      <h2>useRef example (d3)</h2>
      <button onClick={pushInt}>+</button>
      <button onClick={popInt}>-</button>
      <br />
      <Graph data={data()} />
    </div>
  );
};

export default UseRefExample;
