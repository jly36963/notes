# Event listeners & handling

## Events

- Mouse: click, dblclick, mousedown, mouseup, mouseenter, mouseleave, mouseover,
  mouseout, mousemove, blur
- Keyboard/Input: submit, keydown, focus, input, blur, cut, paste

## Events example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Counter</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="https://unpkg.com/mvp.css@1.12/mvp.css" />
    <style>
      /* Variables */
      :root {
        --color-link: black; /* Button colors (MVP.css) */
      }
      /* Reset */
      * {
        margin: 0;
        padding: 0;
        box-sizing: inherit;
      }
      /* Styles */
      body {
        width: 100vw;
        height: 100vh;
      }
      main {
        background-color: #eee;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      #app {
        background-color: #f5f5f5;
        border-radius: 2%;
        width: 20rem;
        height: 20rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        align-content: space-around;
        justify-content: space-evenly;
      }
    </style>
  </head>
  <body>
    <main>
      <div id="app">
        <div>
          <h1>Counter</h1>
        </div>
        <div>
          <h2>Count: <span id="count"></span></h2>
        </div>
        <div>
          <button id="increment">+</button>
          <button id="decrement">-</button>
          <button id="reset">&#8635;</button>
          <!-- Circle arrow: &#8635; -->
        </div>
      </div>
    </main>
    <script>
      // ---
      // Element selectors
      // ---

      const incrementButton = document.querySelector("#increment");
      const decrementButton = document.querySelector("#decrement");
      const resetButton = document.querySelector("#reset");
      const countSpan = document.querySelector("#count");

      // ---
      // State
      // ---

      const { getCount, setCount } = (() => {
        let count = 0;

        /** Get count state value */
        function getCount() {
          return count;
        }
        /** Update count state */
        const updateCountState = (newCount) => {
          count = newCount;
        };
        /** Sync count state to ui */
        const updateCountSpan = () => {
          countSpan.innerText = getCount();
        };
        /** Update count state, then sync ui */
        const setCount = (newCount) => {
          updateCountState(newCount);
          updateCountSpan();
        };
        return { getCount, setCount };
      })();

      setCount(0);

      // ---
      // Emit updates to dependents (computed values)
      // ---

      // TODO

      // ---
      // Handlers
      // ---

      /** Show event details */
      const showEventDetails = (e) => {
        const { type, timestamp, target } = e;
        console.log({ type, target });
      };
      /** Increment count state/ui */
      const handleIncrement = (e) => {
        showEventDetails(e);
        setCount(getCount() + 1);
      };
      /** Decrement count state/ui */
      const handleDecrement = (e) => {
        showEventDetails(e);
        setCount(getCount() - 1);
      };
      /** Reset count state/ui */
      const handleReset = (e) => {
        showEventDetails(e);
        setCount(0);
      };

      // ---
      // Add events
      // ---

      incrementButton.addEventListener("click", handleIncrement);
      decrementButton.addEventListener("click", handleDecrement);
      resetButton.addEventListener("click", handleReset);
    </script>
  </body>
</html>
```

## Event delegation

```js
const handleDelete = (e) => {
  // Limit behavior to a specific target
  if (e.target.parentElement.classList.contains("list")) {
    // Log event target
    console.log(e.target);
    // Remove li child of "ul.list"
    e.target.remove();
  }
};

// Event listener on document.body
document.body.addEventListener("click", handleDelete);
```

## Prevent propogation

- stopPropagation:
  - stops an event (eg: click) from bubbling to parent(s)
  - parent event handlers won't trigger

```js
const handleClick = (e) => {
  e.stopPropogation();
  console.log(e);
};
```
