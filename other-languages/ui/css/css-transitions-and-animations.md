# CSS Animations, Transitions, and Transforms

Animations vs transitions:

- Animation: how the properties of an element change over a duration
- Transition: how the element changes between two states (eg: on/off hover)

## Keyframes Animations

### Keyframes example 1

Box that grows, moves (down/right), and becomes transparent. Repeats.

```html
<html>
  <head>
    <style>
      .box {
        background: #333;
        width: 200px;
        height: 200px;
        position: relative;
        animation-duration: 3s;
        animation-timing-function: ease-in; /* linear, ease-in, ease-out, ease-in-out */
        animation-delay: 0s; /* delay animation */
        animation-iteration-count: 1; /* 1, 2, 3, ... infinite */
        animation-direction: normal; /* normal, alternate, alternate-reverse */
        animation-fill-mode: forwards; /* none, forwards, backwards, both */
        animation-play-state: running; /* running, paused */
        animation-name: animate1;
        /* or */
        /* duration, timing-function, delay, iteration-count, direction, fill-mode, play-state, name */
        animation: 4s linear 0s infinite normal forwards running animate1;
      }

      @keyframes animate1 {
        from {
          width: 200px;
          height: 200px;
          background: #333;
          top: 0;
          left: 0;
        }
        to {
          width: 500px;
          height: 500px;
          background: #fff;
          top: 300px;
          left: 300px;
        }
      }
    </style>
  </head>
  <body>
    <div class="box"></div>
  </body>
</html>
```

### Keyframes example 2

Flexbox-centered shape that oscillates between black/white circle/square

```html
<html>
  <head>
    <style>
      :root {
        --animated-box-size: 10em;
        --box-color-1: #333;
        --box-color-2: #eee;
      }

      .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }
      .box {
        background: var(--box-color-1);
        width: var(--animated-box-size);
        height: var(--animated-box-size);
        border-radius: 0;
        /* duration, timing-function, delay, iteration-count, direction, fill-mode, play-state, name */
        animation: 2s linear 0s infinite normal forwards running animate1;
      }

      @keyframes animate1 {
        50% {
          background: var(--box-color-2);
          border-radius: 50%;
        }
        100% {
          background: var(--box-color-1);
          border-radius: 0%;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box"></div>
    </div>
  </body>
</html>
```

### Keyframes example 3

Flexbox-centered shape that oscilates between circle/wide-oval/circle/tall-oval.

```html
<html>
  <head>
    <style>
      :root {
        --animated-box-size: 10em;
        --box-color-1: #333;
      }

      .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }
      .box {
        background: var(--box-color-1);
        width: var(--animated-box-size);
        height: var(--animated-box-size);
        border-radius: 50%;
        /* duration, timing-function, delay, iteration-count, direction, fill-mode, play-state, name */
        animation: 2s ease-in-out 0s infinite normal forwards running animate1;
      }

      @keyframes animate1 {
        25% {
          width: calc(var(--animated-box-size) * 1.5);
        }
        50% {
          width: var(--animated-box-size);
          height: var(--animated-box-size);
        }
        75% {
          height: calc(var(--animated-box-size) * 1.5);
        }
        100% {
          width: var(--animated-box-size);
          height: var(--animated-box-size);
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box"></div>
    </div>
  </body>
</html>
```

### Keyframes example 4

Circle that moves in square pattern.

```html
<html>
  <head>
    <style>
      :root {
        --animated-box-size: 10em;
        --box-color: #333;
      }

      .container {
        width: 100vw;
        height: 100vh;
        padding: 10%;
        box-sizing: border-box;
      }
      .box {
        background: var(--box-color);
        width: var(--animated-box-size);
        height: var(--animated-box-size);
        position: relative;
        border-radius: 50%;
        /* duration, timing-function, delay, iteration-count, direction, fill-mode, play-state, name */
        animation: 4s linear 0s infinite normal forwards running animate1;
      }

      @keyframes animate1 {
        0% {
          top: 0%;
          left: 0%;
        }
        25% {
          top: 0%;
          left: calc(100% - var(--animated-box-size));
        }
        50% {
          top: calc(100% - var(--animated-box-size));
          left: calc(100% - var(--animated-box-size));
        }
        75% {
          top: calc(100% - var(--animated-box-size));
          left: 0%;
        }
        100% {
          top: 0%;
          left: 0%;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box"></div>
    </div>
  </body>
</html>
```

## Transitions

- properties that can use transitions:
  - properties with an identifiable half-way point

Transition:

- property
- name
- duration
- timing-function
- delay

Examples:

- 'transition: background 4s linear 0s;'
- 'transition: background, border-radius 4s linear 0s;'
- 'transition: all 4s linear 0s;'

### Transitions example

body > box > text

```css
body {
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}
.text {
  text-align: center;
  margin: auto auto;
}
.box {
  background: #f4f4f4;
  display: flex;
  width: 100px;
  height: 100px;
  transition: background 2s linear 0s;
  border-radius: 50%;
  font-size: 3em;
}
.box:hover {
  background: #88f;
}
```

## Transform

```css
.box {
  background: #333;
  width: 300px;
  height: 300px;
  transition: all 1s ease-in-out;
}
box:hover {
  /* transform: rotate(45deg); */
  /* transform: skew(45deg); */
  /* transform: scale(2); */
  /* transform: translateX(100px); */
  /* transform: translateY(100px); */
  /* transform: translate(100px, 100px); */
  /* transform: translate3d(100px, 100px, 100px); */

  transform: rotate(180deg); /* Rotate on hover */
}
```
