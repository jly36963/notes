# CSS Positioning

## Position

- place is held
  - static -- not affected by top/bottom/left/right properties/values
  - relative -- affected by t/b/l/r values
- place is not held
  - absolute -- positioned relative to parent ('relative') or body
  - fixed -- positioned relative to the viewport
  - sticky -- positioned based on scroll position

- z-index
  - higher z-index will appear above, lower will appear below
  - only applies to elements in the same parent container

```css
.box {
  width: 100px;
  height: 100px;
  position: static; /* static, relative, absolute, fixed, sticky */
  z-index: 0; /* higher z-index, appears above; lower, appears below */
}
```

## Float

```css
/* remember to clear floats */
/* create <div> with 'clear: both;' property (under floats) */
.float-box {
  box-sizing: border-box;
  float: left;
  width: 30%;
}

.clear-fix {
  clear: both;
}

/* clearfix using pseudo-class */
/* apply to parent element */
.clearfix::after {
  content: " ";
  clear: both;
  display: block;
  height: 0;
  clear: both;
}

/* newer clearfix method */
/* apply to parent element */
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}
```

## Flex

### Flexbox

```css
#container {
  display: flex;
  flex-direction: row; /* row, column */
  flex-wrap: wrap; /* after 12 elements: wrap, nowrap */
  flex-flow: row wrap; /* shortcut for previous two lines */
}
.flex-item {
  background: #f4f4f4;
  border: #ccc solid 1px;
  padding: 1rem;
  text-align: center;
  flex: 1; /* items with different flex values will take up space differently */
  margin: 1rem; /* space between flex boxes */
}
```

### Flex alignment

```css
#container {
  display: flex;
  flex-wrap: wrap; /* wrap, nowrap */
  /* horizontal alignment */
  justify-content: flex-start; /* flex-start, flex-end, space-around, space-between, space-evenly */
  /* vertical alignment */
  height: 600px;
  /* single-line alignment */
  align-items: stretch; /* stretch, baseline, center, flex-end, flex-start */
  /* multi-line alignment */
  align-content: space-around; /* flex-start, flex-end, center, space-between, space-around, stretch */
}
.flex-item {
  background: #f4f4f4;
  border: #ccc solid 1px;
  text-align: center;
  padding: 1rem;
  margin: 1rem;
  flex-basis: 150px; /* width for flex items */
}
#flex-item-2 {
  align-self: center; /* stretch, baseline, center, flex-end, flex-start */
}
/* order */
#item-1 { order: 3; }
#item-2 { order: 2; }
#item-3 { order: 1; }
```

## CSS Grid

### Grid columns

```css
/* three column example */
/* beyond 3 elements will wrap to the next row */
/* grid-template-columns can take 'auto' as a value */
.grid {
  display: grid;
  /* grid-template-columns: 200px 200px 200px; */
  /* grid-template-columns: 1fr 2fr 1fr; */
  /* grid-template-columns: repeat(3, 200px); */
  grid-template-columns: repeat(3, auto); /* 3 columns, auto */
  grid-gap: 1rem; /* gap between columns/rows */
}
.item {
  padding: 3rem;
  border: #ccc 1px solid;
  background: #f4f4f4;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
}
```

### Grid rows

```css
/* grid of 6+ (2 wide, 3 tall) */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr 2fr 1fr;
  grid-auto-rows: 1fr; /* any elements beyond the defined rows */
}
.item {
  padding: 3rem;
  border: #ccc 1px solid;
  background: #f4f4f4;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
}
```

### Grid (spanning cols and rows)

TODO: update

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.item {
  padding: 3rem;
  border: #ccc 1px solid;
  background: #f4f4f4;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
}
.item:first-child {
  grid-column-start: 1;
  grid-column-end: 5; /* beginning of 1 to beginning of 5 */
  grid-column-start: 1;
  grid-column-end: 3; /* beginning of 1 to beginning of 3 */
  /* grid-column: 1 / span 4; */
  /* grid-row: 1 / span 2; */
}
.item:nth-child(9) {
  grid-column: 2 / span 3;
  grid-row: 4 / span 2;
}
```

### Grid (autofit and minmax)

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
.item {
  padding: 3rem;
  border: #ccc 1px solid;
  background: #f4f4f4;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
}
```

### Grid template areas (with media query)

```css
.container {
  display: grid;
  grid-template-areas:
    'header header header'
    'content content sidebar'
    'box-1 box-2 box-3'
    'footer footer footer';
  grid-gap: 1rem;
}
.header {
  grid-area: header;
}
.content {
  grid-area: content;
}
.sidebar {
  grid-area: sidebar;
}
.box-1 {
  grid-area: box-1;
}
.box-2 {
  grid-area: box-2;
}
.box-3 {
  grid-area: box-3;
}
.footer {
  grid-area: footer;
}
@media(max-width: 500px) {
  .container {
    grid-template-areas:
    'header'
    'content'
    'sidebar'
    'box-1'
    'box-2'
    'box-3'
    'footer';
  }
}
```

### Grid template columns (media queries)

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
}
@media(max-width: 768px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media(max-width: 500px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```
