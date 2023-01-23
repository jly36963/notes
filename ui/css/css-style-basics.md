# CSS basics

## Guidelines

- CSS should be in the head (style tag) or in an external file
- CSS overwrites itself (duplicate properties will overwrite previous ones)
- Child elements inherit properties from parent divs (in some cases)

## Methods

### Inline

```html
<div style="color:red">I am red</div>
```

### Style Tag

```html
<style>
  .m3 {
    margin: 10px;
  }
</style>

<div class="m3">I have margin</div>
```

### Style Sheet

Setup:

- create style sheet (eg: `style.css`)
- put link tag in header

```html
<!-- Basic -->
<link rel="stylesheet" href="css/style.css" />

<!-- Media query example -->
<link
  rel="stylesheet"
  media="screen and (max-width: 768px)"
  href="mobile.css"
/>
```

## Selectors

### Basic

```css
/* Element */
h2 {
  color: black;
}
/* Class */
.heading2 {
  color: black;
}
/* Id */
#navbar-main {
  color: black;
}
/* Multiple selectors */
h1,
h2 {
  color: black;
}
/* Nested selector */
navbar div {
  color: black;
}
```

### Targeted selectors

```css
div {} /* all div elements */
div p {} /* all p elements that are descendents of divs */
div > p {} /* all p elements that are direct descendents of divs */
div + p {} /* p elements that follow (sibling) div elements */
a[target] {} /* a elements that have a 'target' attribute */
input[type='text'] {} /* all text inputs */
```

### Nth child

```css
li:first-child {} /* first child */
li:last-child {} /* last child */
li:nth-child(3) {} /* third child */
li:nth-child(3n+0) {} /* every third child */
li:nth-child(5n+3) {} /* 3, 8, 13, 18 ... */
li:nth-child(odd) {} /* odd children */
li:nth-child(even) {} /* even children */
```

### Before and after pseudo-selectors

```css
.is-required:after {
  content: '*';
  color: #ccc;
}

.is-required:before {
  content: '*';
  color: #ccc;
}
```

## Fonts

### Default fonts

```css
body {
  font-family: Arial, Helvetica, sans-serif; /* font stack */
}
```

### Roboto (google font)

```html
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
```

```css
body {
  font-family: "Roboto", sans-serif;
}
```

### Font size

```css
body {
  font-size: 18px; /* default is 16 */
  font-size: 100%; /* better for ease-of-access */
  line-height: 1.6; /* unitless value -- acts as multiplier (font-size) */
  font-weight: normal; /* normal, bold, lighter */
  text-transform: none; /* capitalize, uppercase, lowercase, none */
}
```

## Units

- absolute units
  - `px` (pixels)
- relative units
  - `%` (percentage, parent element)
  - `em` (multiplier, parent element)
  - `rem` (multiplier, root element)
  - `vw` (percetage, viewport width)
  - `vh` (percentage, viewport height)
- em and rem
  - 1 em is the same as the font-size of the current element
  - the default font-size for html pages is 16 (before CSS styling is applied)
  - font size is inherited, and that can make em confusing
  - rem works like em, but it will always use the default base font-size
    - to affect rem: (html { font-size: 10px; })

## viewport (vh/vw)

- normally, the body is only as tall as its content
- using vh units can make the body cover the whole viewport

```css
.box-1 {
  height: 100%; /* 100% of content height */
  height: 100vh; /* 100% of viewport height */
}
```

## Height and Width

```css
/* Fixed */
.box-1 {
  height: 300px;
  width: 600px;
}
/* Responsive */
.box-1 {
  height: 300px;
  width: 100%; /* Full width of parent container */
}
```

## Colors

```css
body {
  /* name */
  color: white;
  /* rgb (0-255) */
  background-color: rgb(0, 0, 0);
  /* rgba */
  background-color: rgba(0, 0, 0, 0.3);
  /* hex */
  border-color: #ffffff; /* #000, #333, #aaa, #fff */
}
```

## Border

```css
.box-1 {
  border-width: 2px;
  border-color: black;
  border-style: solid;

  /* The above 3 lines can be reduced to */
  border: 3px solid black;

  /* Rounded corners */
  border-radius: 25px;
}
```

## Box shadow

```css
.box-1 {
  box-shadow: 5px 5px #444; /* offset-x, offset-y, color */
  box-shadow: -5px -5px #444; /* offset-x, offset-y, color */
  box-shadow: 5px 5px 10px #444; /* x, y, blur-radius, color */
  box-shadow: 5px 5px 10px 1px #444; /* x, y, blur-radius, color */
  box-shadow: 3px 3px 10px 1px rgba(0,0,0,0.3); /* rgba */
}
```

## Text shadow

```css
.box-1 {
  text-shadow: 0.2rem 0.2rem #333; /* h-shadow, v-shadow, color */
  text-shadow: -0.2rem -0.2rem #333; /* h-shadow, v-shadow, color */
  text-shadow: 0.4rem 0.3rem 0.7rem #333; /* x, y, blur, color */
}
```

## Backgrounds

```css
/* Background color */
#box-1 {
  background-color: #aaa;
}

/* Background image */
.box-1 {
  background-image: url("./img/stars.jpg"); /* relative */
  background-image: url("https://google.com/google.jpg");
  background-repeat: no-repeat;
  background-position: 100px 200px; /* 100px right, 200 px down */

  height: 300px;
  width: 600px;
  background-size: cover; /* match the background image to its height/width */
}

/* Fixed background image */
body {
  background: url("./img/leaf.png") no-repeat center center;
  background-attachment: fixed;
}

/* Background color and image */
.box-1 {
  background: #000 url("./img/leaf.png");
}
```

## Box model

```css
.box-1 {
  background: #aaa;
  border: 2px #777 solid;
  width: 500px;
  box-sizing: border-box; /* includes padding/margin in width/height */
  padding: 20px; /* space inside border */
  margin: 20px /* space outside border */
}

.box-2 {
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  /* or */
  padding: 10px 20px 10px 20px; /* top, right, bottom, left */
  padding: 10px 20px; /* y, x */
  margin: 10px 20px 10px 20px;
  margin: 10px 20px;
}
```

## Simple CSS Reset

These elements have margin by default: `<h1>`, `<ul>`, `<ol>`\
They can be reset with:

```css
* {
  margin: 0;
  padding: 0;
}
```

## Centering

```css
.box-1 {
  width: 1000px; /* not responsive */
  max-width: 1000px; /* more responsive */
  margin: 30px auto; /* y = 30px, x = auto */
  text-align: center; /* left, right, center, justify */
}
```

## Link pseudo-selectors

```css
a {
  color: blue;
  text-decoration: none
}
a:hover {
  color: red;
  text-decoration: underline;
}
a:visited {
  color: violet;
}
a:active {
  color: orange;
}
```

## Display

```css
.nav-links {
  display: inline; /* <li> will appear on same line */
}

.img-1 {
  display: block; /* can't add margin to an inline element */
  margin: auto;
}

.box-1 {
  display: inline-block; /* blocks that can appear on the same line */
  box-sizing: border-box;
  margin-bottom: 15px;
}

.box-1 {
  display: none; /* removed from DOM */
  visibility: hidden; /* insvisible but still takes up space */
}
```

## Precedence

With conflicting properties/values, here's the order of precedence:

- !important
- specificity (selectors -- id, class, type)
- source order

```css
/* only use '!important' when overriding a foreign css library (bootstrap) */
.box-1 {
  color: black !important;
}
```

## Media Queries

```css
.box-1 {
  background-color: #000;
}
/* smartphone */
@media(max-width: 500px) {
  .box-1 {
    background-color: #222;
  }
}
/* tablet */
@media(min-width: 501px) and (max-width: 768px) {
  .box-1 {
    background-color: #444;
  }
}
/* normal */
@media(min-width: 769px) and (max-width: 1200px) {
  .box-1 {
    background-color: #666;
  }
}
/* widescreen */
@media(min-width: 1201px) {
  .box-1 {
    background-color: #888;
  }
}
```

## CSS variables (custom properties)

```css
/* To make variable accessible everywhere: */
:root {
  --max-width: 1100px;
  --primary-color: steelblue;
  --secondary-color: skyblue;
  --light-color: #f4f4f4;
}

body {
  background: var(--light-color);
}

/* Fallback values */
.navbar-1 {
  background: var(--primary-color, steelblue); /* one fallback */
  background: var(--primary-color, var(--secondary-color, skyblue)) /* two fallbacks */
}

/* Local variable */
body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4; /* unitless value -- multiply by element's font size */
  --light-color: #f4f4f4;
  background: var(--light-color);
}
```
