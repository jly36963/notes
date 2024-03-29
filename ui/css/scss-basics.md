# SCSS

## NPM, SCSS, and Preprocesing

- `npm i sass`
- create 'main.scss' file in 'scss' directory of project.
- write scss
- under scripts (in package.json):
  - "compile:scss": "node-sass scss/main.scss css/style.css"
- "npm run compile:scss" in terminal
- adding a '-w' flag to the compile:scss script will make node-sass watch for
  updates
- live-server can also be used to detect changes to scss files.

## CSS Principles

- CSS should be in the head (style tag) or in an external file
- CSS overwrites itself (duplicate properties will overwrite previous ones)
- Child elements inherit properties from parent divs (in some cases)

- 3 principles of good HTML/CSS
  - Responsive design
  - Maintainable/scalable
  - Web performance

## Basic reset (universal selector)

```scss
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}
html {
  font-size: 100%; // percentage -- ease of access. html selector -- rem
}
body {
  font-family: 'Roboto', sans-serif; // link to font in <head>
  font-weight: 400;
  line-height: 1.7;
  color: #777;
  box-sizing: border-box; // include margin & border in width/height
}
```

## Build meaningful classnames

Composition:

- BEM format: block, element, modifier

```scss
.block {}
.block__element {}
.block__element--modifier {}
```

Example

```scss
.recipe {}
.recipe__stat {}
.recipe__stat--key {}
.recipe__stat--value {}
```

## SCSS Features

- variables
  - store reusable values
- nesting
  - nest selectors inside of one another
- operators
  - math operations inside of CSS
- partials and imports
  - write CSS in modules
- mixins
  - write reusable pieces of CSS code
- functions
  - dynamically produce values
- extends
  - make different selectors inherit common declarations

## Sass and SCSS (Syntax)

- Sass -- indentation sensitive, no brackets/semi-colons
- SCSS -- preserves original CSS syntax

- JS-style comments work
  - `//` or `/* ... */`

## SCSS variables

```scss
$c-primary: #55f;
$c-secondary: #2a6;
$c-tertiary: #f55;
$c-dark: #333;
$c-gray: #aaa;
$c-light: #eee;

.box-1 {
  background-color: $c-p;
}
```

## Nested selectors

// use '&' when using pseudo-classes in nested selectors

```scss
.container {
  padding: 3rem;

  p {
    border: 1px solid $c-dark;
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
```

## Advanced nesting

classes: '.header', '.header__logo-box'

```scss
.header {
  background: $c-primary;

  &__logo-box {
    font-size: 3rem;
  }
}

.heading-primary {
  color: $c-light;
  text-transform: uppercase;

  &--main {
    font-size: 2rem;
  }

  &--sub {
    font-size: 1.8rem;
  }
}

.btn {
  &:link { /* something */ }
  &:visited { /* something */ }
  &:hover { /*something */ }
  &:active { /*something */ }
  &::after { /*something */ }
  &--white { /*something */ }
  &--animated { /*something */ }
}
```

## RGBA with hex

```scss
box-1 {
  background: rgba($c-tertiary, .8)  // in scss, rgba can accept hex
}
```

## Color functions (SCSS)

```scss
.btn-main {
  background-color: $c-secondary;

  &:hover {
    background-color: darken($c-secondary, 15%);
  }
  &:active {
    background-color: lighten($c-secondary, 15%);
  }
}
```

## SCSS mixins (with arguments, default arguments)

```scss
@mixin clearfix {
  &::after {
    content: "";
    clear: both;
    display: table;
  }
}
@mixin style-link-text($color: $c-light) {
  text-decoration: none;
  text-transform: capitalize;
  color: $color;
}

.box-1 {
  @include clearfix;
}
a {
  @include style-link-text(#eee);
}
```

## SCSS functions

```scss
@function divide($numerator, $denominator) {
  @return $numerator / $denominator;
}

box-1 {
  margin: divide(3, 2) * 1rem;
}
```

## Extends (using placeholder) (like mixins, but produces DRY code)

```scss
%btn-placeholder {
  padding: 1rem;
  display: inline-block;
  text-align: center;
  border-radius: 100px;
  width: 200px;
  @include style-link-text($c-light);
}

btn-main {
  @extend %btn-placeholder;
  background-color: $c-primary;
}
btn-alternate {
  @extend %btn-placeholder;
  background-color: $c-secondary;
}
```

## 7-1 PATTERN

- 7 folders, 1 main Sass file
  - main.scss
  - base
  - components
  - layout
  - pages
  - themes
  - abstracts
  - vendors

- naming convention of files
  - _functions.scss, _home.scss, _header.scss

### Example

main.scss

```scss
@import "abstracts/functions";
@import "abstracts/mixins";
@import "abstracts/variables";

@import "base/animations";
@import "base/base";
@import "base/typography";
@import "base/utilities";

@import "components/button";
@import "components/card";
@import "components/form";
@import "components/modal";

@import "layout/header";
@import "layout/footer";
@import "layout/sidebar";
@import "layout/grid";

@import "pages/home";
@import "pages/signup";
@import "pages/login";
@import "pages/dashboard";
@import "pages/profile";
```

## Not (pseudo-selector)

```scss
.row {
  background-color: #eee;

  &:not(:last-child) {
    margin-bottom: 4rem; // mb for all .row except last-child
  }
}
```

## Attribute selector (advanced)

```scss
// select all elements whose class begins with 'col-'
[class^="col-"] {}
// select all elements whose class ends with 'col-'
[class$="col-"] {}
// select all elements whose class contains 'col-'
[class*="col-"] {}
```

## Custom grid with floats

```scss
// variables (abstracts/variables)
$grid-width: 72rem; // px to rem: 1140/16 = 71.25rem
$grid-gutter-h: 2rem;
$grid-gutter-v: 2rem;

// clearfix mixin (abstracts/mixins)
@mixin clearfix {
  &::after {
    content: "";
    clear: both;
    display: table;
  }
}

// grid system (layout/grid)
.row {
  max-width: $grid-width;
  background: #eee;
  margin: 0 auto; // center elements
  margin-bottom: 4rem;

  // mb for row
  &:not(:last-child) {
    margin-bottom: 4rem; // mb for all .row except last-child
  }

  // clearfix for row
  @include clearfix;

  // float all columns, add gutter
  [class^="col-"] {
    float: left;

    &:not(:last-child) {
      margin-right: $grid-gutter-h;
    }
  }

  // columns
  .col {
    &-1-of-2 {
      width: calc((100% - #{$grid-gutter-h}) / 2);
    }
    &-1-of-3 {
      width: calc((100% - 2 * #{$grid-gutter-h}) / 3);
    }
    &-2-of-3 {
      width: calc((100% - 2 * #{$grid-gutter-h}) * 2 / 3 + #{$grid-gutter-h});
    }
    &-1-of-4 {
      width: calc((100% - 3 * #{$grid-gutter-h}) / 4);
    }
    &-2-of-4 {
      width: calc((100% - 3 * #{$grid-gutter-h}) / 2 + #{$grid-gutter-h});
    }
    &-3-of-4 {
      width: calc((100% - 3 * #{$grid-gutter-h}) * 3 / 4 + 2 * #{$grid-gutter-h});
    }
  }
}
```

## Media queries (breakpoints)

// best practice is to create a breakpoints based on content.

// predefined breakpoints (based on devices) that work pretty well: // phone
(<600), tablet-portrait (<900), tablet-landscape (<1200), desktop (<1800)

### SCSS & media queries (nesting)

// without mixin (good)

```scss
.box-1 {
  font-size: 1.2rem;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
}
```

### SCSS & media queries (mixin)

```scss
// abstracts/mixins
@mixin rd-phone {
  @media (max-width: 600px) { @content };
}
@mixin rd-tablet-p {
  @media (min-width: 601px) and (max-width: 900px) { @content };
}
@mixin rd-tablet-l {
  @media (min-width: 901) and (max-width: 1200px) { @content };
}
@mixin rd-big-desktop {
  @media (min-width: 1801px) { @content };
}

// base/base
html {
  font-size: 1.2rem;

  @include rd-phone {
    font-size: 1rem;
  }
}
```

### SCSS & media queries (media query manager) (best)

```scss
// abstracts/mixins
@mixin rd($device) {
  @if $device == phone {
    @media (max-width: 600px) { @content }; // 38 em
  }
  @if $device == tablet-p {
    @media (min-width: 601px) and (max-width: 900px) { @content }; // 56 em
  }
  @if $device == tablet-l {
    @media (min-width: 901) and (max-width: 1200px) { @content }; // 75 em
  }
  @if $device == widescreen {
    @media (min-width: 1801px) { @content }; // 112 em
  }
}

// base/base
html {
  font-size: 100%;

  @include rd(phone) {
    font-size: 80%;
  }
  @include rd(tablet-p) {
    font-size: 90%;
  }
  @include rd(tablet-l) {
    font-size: 90%;
  }
  @include rd(widescreen) {
    font-size: 110%;
  }
}
```

## SCSS responsive images

// responsive images improve performance and design. // resolution switching
(decrease resolution on smaller screen) // density switching (different image
for high/low resolution screens) // art direction (serving an alternate/altered
image for smaller screens)

## SCSS & flexbox (display: flex;)

```scss
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  background: $c-gray;
  padding: 10px;
  display: flex;
  flex-direction: row; // column
  justify-content: space-around; // space-between, center
  align-items: stretch;
  align-content: space-around;

}

.item {
  background: $c-primary;
  padding: 2rem;
  margin: 1rem;
  color: $c-light;
}
```

## SCSS & CSS-GRID

```scss
.container {
  display: grid;
}
```

TODO
