# CSS Animations, Transitions, and Transforms

## Keyframes Animations

### Keyframes example 1

```css
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
    width:500px;
    height: 500px;
    background: #fff;
    top: 300px;
    left: 300px;
  }
}
```

### Keyframes example 2

```css
.box {
  background: #333;
  width: 200px;
  height: 200px;
  position: relative;
  top: 0;
  left: 0;
  border: 2px solid #333;
  border-radius: 0;
  /* duration, timing-function, delay, iteration-count, direction, fill-mode, play-state, name */
  animation: 4s linear 0s infinite normal forwards running animate2;
}

@keyframes animate2 {
  25% {
    background: #eee;
    top: 0;
    left: 300px;
    border-radius: 50%;
  }
  50% {
    background: #333;
    top: 300px;
    left: 300px;
    border-radius: 0%;
  }
  75% {
    background: #eee;
    top: 300px;
    left: 0;
    border-radius: 50%;
  }
  100% {
    background: #333;
    top: 0;
    left: 0;
    border-radius: 0%;
  }
}
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
