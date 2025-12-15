# tailwind

## install

```sh
npm install tailwindcss
```

## add tailwind to css (@tailwind directive)

add these to a css file. tailwind directives/imports should be at beginning of
css file. tailwind will swap these directives out at build time with all of its
generated CSS.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## add tailwind to css (postcss)

```css
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

## customize tailwindcss (config)

```sh
npx tailwindcss init
```

tailwind.config.js

```js
module.exports = {
  theme: {},
  variants: {},
  plugins: [],
  purge: [
    "./src/**/*.html",
    "./src/**/*.vue",
    "./src/**/*.jsx",
  ],
};
```

## add tailwindcss to postcss

```js
module.exports = {
  plugins: [
    // ...
    require("tailwindcss"),
    require("autoprefixer"),
    // ...
  ],
};
```

## customization

<!-- https://tailwindcss.com/docs/configuration -->
<!-- https://tailwindcss.com/docs/theme -->
<!-- https://tailwindcss.com/docs/customizing-colors -->
<!-- https://tailwindcss.com/docs/customizing-spacing -->
<!-- https://tailwindcss.com/docs/configuring-variants -->

## usage

```html
<!-- div -->
<!-- container -- set max-width of element to match min-width of current breakpoint -->
<div class="container">Hello!</div>
<!-- width (0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,56,64) -->
<div class="w-16">Hello!</div>
<!-- width (fraction of parent container) (halves, thirds, quarters, sixths, twelfths) -->
<div class="w-1/6">Hello!</div>
<!-- breakpoints (screen prefixes) -->
<div class="sm:w-16 md:w-32 lg:w-48 xl:w-64">Hello!</div>
<!-- margin (m, mx, my, ml, mr, mt, mb) (0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,56,64) -->
<div class="mx-auto">Hello!</div>
<!-- padding -- (p, px, py, pl, pr, pt, pb) (0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,56,64) -->
<div class="px-4">Hello!</div>
<!-- sizing -- box-sizing: border-box (box-border || box-content) -->
<div class="box-border">Hello!</div>

<!-- visibility -->
.visible .invisible

<!-- width (0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,56,64) (halves, thirds, quarters, sixths, twelfths) -->
.w-1 .w-auto .w-1/2 .w-full .w-screen

<!-- height (0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,56,64) -->
.h-1 .h-auto .h-full .h-screen

<!-- width and height (min and max) -->
<!-- https://tailwindcss.com/docs/min-width -->
<!-- https://tailwindcss.com/docs/max-width -->
<!-- https://tailwindcss.com/docs/min-height -->
<!-- https://tailwindcss.com/docs/max-height -->

<!-- scale (transform) (x,y) -->
.scale-0 .scale-50 .scale-75 .scale-90 .scale-95
.scale-100
.scale-105 .scale-110 .scale-125 .scale-150

<!-- box shadow -->
.shadow
.shadow-xs .shadow-xm
.shadow-md .shadow-lg .shadow-xl .shadow-2xl
.shadow-inner
.shadow-outline
.shadow-none

<!-- opacity -->
.opacity-0
.opacity-25
.opacity-50
.opacity-75
.opacity-100

<!-- border radius (l,r,t,b,tl,tr,bl,br,) -->
.rounded
.rounded-none
.rounded-sm .rounded-md .rounded-lg .rounded-full
<!-- border width (l,r,b,t) -->
.border
.border-0 .border-2 .border-4 .border-8
<!-- border color (100 - 900) (groygtbipp) -->
.border-transparent
.border-current
.border-black .border-white
.border-gray-400
<!-- border opacity -->
.border-opacity-0
.border-opacity-25
.border-opacity-50
.border-opacity-75
.border-opacity-100
<!-- border style -->
.border-solid
.border-dashed
.border-dotted
.border-double
.border-none

<!-- appearance (browser specific styling on an element) -->
.appearance-none

<!-- cursor -->
.cursor-auto .cursor-default .cursor-pointer .cursor-wait .cursor-text .cursor-move .cursor-not-allowed

<!-- select -->
.select-none .select-text .select-all .select-auto

<!-- transition -->
<!-- https://tailwindcss.com/docs/transition-property -->

.transition
.duration-75 .duration-100 .duration-150 .duration-200 .duration-300 .duration-500 .duration-700 .duration-1000
.ease-in-out .ease-in .ease-out .ease-linear
.delay-75 .delay-100 .delay-150 .delay-200 .delay-300 .delay-500 .delay-700 .delay-1000

<button
  class="transition duration-500 ease-in-out bg-blue-500 hover:bg-red-500 transform hover:-translate-y-1 hover:scale-110"
>
  Hover me
</button>

<!-- animation -->
<!-- https://tailwindcss.com/docs/animation -->

<!-- rotate (transform) -->
<!-- https://tailwindcss.com/docs/rotate -->

<!-- translate (0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,56,64) -->
.translate-x-4
.translate-y-4
.-translate-x-4
.-translate-y-4

<!-- skew -->
<!-- https://tailwindcss.com/docs/skew -->

<!-- ----------- -->
<!-- layout (position) -->
<!-- ----------- -->

<!-- display classes -->
.block .inline-block .inline
.hidden

<!-- display classes (flex) -->
.flex .inline-flex
.flex-row .flex-row-reverse .flex-col .flex-col-reverse
.flex-wrap .flex-wrap-reverse .flex-no-wrap
<!-- placement (items) -->
.items-start .items-end .items-center .items-baseline .items-stretch
<!-- placement (content) (multi-line) -->
.content-center .content-start .content-end .content-between .content-around
.justify-start .justify-end .justify-center .justify-between .justify-around .justify-evenly
<!-- flex (spacing) (0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,56,64) -->
.space-x-1
.space-y-1
<!-- flexbox grid (support for older browsers) -->
<!-- https://tailwindcss.com/components/flexbox-grids -->

<!-- grid (parent) -->
.grid .inline-grid
.grid-cols-1 (...) .grid-cols-12
.grid-rows-1 (...) .grid-rows-6
<!-- grid (children) (col)-->
.col-span-1 (...) .col-span-12
.col-start-1 (...) .col-start-12
.col-end-1 (...) .col-end-12
<!-- grid (children) (row)-->
.row-span-1 (...) .row-span-6
.row-start-1 (...) .row-start-7
.row-end-1 (...) .row-end-7
<!-- grid gutters (0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,56,64) -->
.gap-0 (...) .gap-6
.col-gap-0 (...) .col-gap-6
.row-gap-0 (...) .row-gap-6
<!-- grid placement -->
.grid-flow-row .grid-flow-col
.grid-flow-row-dense .grid-flow-col-dense

<!-- display classes (flex) (child) -->
<!-- https://tailwindcss.com/docs/flex -->
<!-- https://tailwindcss.com/docs/flex-grow -->
<!-- https://tailwindcss.com/docs/flex-shrink -->
<!-- https://tailwindcss.com/docs/order -->

<!-- float -->
.float-left .float-right .float-none .clearfix

<!-- clear -- position an element below preceding floated elements -->
.clear-left .clear-right .clear-both .clear-none

<!-- object fit -- fit an element within a parent container -->
.object-contain .object-cover .object-fill .object-none .object-scale-down

<!-- object position -- position an element within a parent container -->
.object-center
.object-bottom .object-top .object-left .object-right
.object-left-bottom .object-right-bottom .object-left-top .object-right-top

<!-- overflow -->
.overflow-auto .overflow-hidden .overflow-visible .overflow-scroll
.overflow-x-auto .overflow-x-hidden .overflow-x-visible .overflow-x-scroll
.overflow-y-auto .overflow-y-hidden .overflow-y-visible .overflow-y-scroll

<!-- overscroll -->
<!-- https://tailwindcss.com/docs/overscroll-behavior -->

<!-- position -->
.static .fixed .absolute .relative .sticky
.top-100 .bottom-100 .left-100 .right-100
.top-auto .bottom-auto .left-auto .right-auto
.inset-auto .inset-x-auto .inset-y-auto

<!-- z -->
.z-0 .z-10 .z-20 .z-30 .z-40 .z-50 .z-auto

<!-- dividers (0,2,4,8) -->
.divide-y .divide-x
.divide-y-reverse .divide-x-reverse
.divide-y-2 .divide-x-2

<!-- divide color (100 - 900) (groygtbipp) -->
.divide-transparent
.divide-current
.divide-black .divide-white
.divide-gray-400

<!-- divide opacity -->
.divide-opacity-0
.divide-opacity-25
.divide-opacity-50
.divide-opacity-75
.divide-opacity-100

<!-- ----------- -->
<!-- typography -->
<!-- ----------- -->

<!-- text alignment -->
.text-left .text-center .text-right .text-justify

<!-- font -->
.font-sans .font-serif .font-mono

<!-- font size -->
.text-xs .text-sm .text-base .text-lg
.text-xl .text-2xl .text-3xl .text-4xl .text-5xl .text-6xl

<!-- case -->
.uppercase
.lowercase
.capitalize
.normal-case

<!-- font color (100 - 900) (groygtbipp) -->
.text-transparent
.text-current
.text-black .text-white
.text-gray-400

<!-- font opacity -->
.text-opacity-0
.text-opacity-25
.text-opacity-50
.text-opacity-75
.text-opacity-100

<!-- font smoothing -->
.antialiased
.subpixel-antialiased

<!-- font weight -->
.font-hairline
.font-thin
.font-light
.font-normal
.font-medium
.font-semibold
.font-bold
.font-extrabold
.font-black

<!-- letter spacing -->
.tracking-tighter
.tracking-tight
.tracking-normal
.tracking-wide
.tracking-wider
.tracking-widest

<!-- line height -->
.leading-3 (...) .leading-10
.leading-none
.leading-tight
.leading-snug
.leading-normal
.leading-relaxed
.leading-loose

<!-- decoration -->
.italic
.underline
.line-through

<!-- vertical alignment -->
<!-- https://tailwindcss.com/docs/vertical-align -->

<!-- whitespace -->
<!-- https://tailwindcss.com/docs/whitespace -->

<!-- word break -->
<!-- https://tailwindcss.com/docs/word-break -->

<!-- list style -->
.list-none .list-disc .list-decimal

<!-- placeholder color (text input) (100 - 900) (groygtbipp) -->
.placehoder-transparent
.placeholder-current
.placeholder-black .placeholder-white
.placeholder-gray-400
<!-- placeholder opacity -->
.placeholder-opacity-0
.placeholder-opacity-25
.placeholder-opacity-50
.placeholder-opacity-75
.placeholder-opacity-100


<!-- ----------- -->
<!-- background  -->
<!-- ----------- -->

<!-- bg attachment -->
.bg-fixed .bg-local .bg-scroll

<!-- bg color (100 - 900) (groygtbipp) -->
.bg-transparent
.bg-current
.bg-black .bg-white
.bg-gray-400

<!-- bg opacity -->
.bg-opacity-0
.bg-opacity-25
.bg-opacity-50
.bg-opacity-75
.bg-opacity-100

<!-- bg size -->
.bg-cover .bg-auto .bg-contain

<!-- bg position -->
<!-- https://tailwindcss.com/docs/background-position -->

<!-- bg repeat -->
<!-- https://tailwindcss.com/docs/background-repeat -->


<!-- ----------- -->
<!-- table  -->
<!-- ----------- -->

<!-- table -->
.table .table-caption .table-cell .table-column .table-row
.table-column-group .table-footer-group .table-header-group .table-row-group

<!-- table border -->
.border-collapse .border separate

<!-- table layout -->
.table-auto .table-fixed

<!-- ----------- -->
<!-- svg -->
<!-- ----------- -->

<!-- https://tailwindcss.com/docs/fill -->
<!-- https://tailwindcss.com/docs/stroke -->
<!-- https://tailwindcss.com/docs/stroke-width -->


<!-- ----------- -->
<!-- components -->
<!-- ----------- -->

<!-- alerts -->
<!-- https://tailwindcss.com/components/alerts -->

<!-- buttons  -->
<!-- https://tailwindcss.com/components/buttons -->

<!-- cards -->
<!-- https://tailwindcss.com/components/cards -->

<!-- form -->
<!-- https://tailwindcss.com/components/forms -->

<!-- navigation -->
<!-- https://tailwindcss.com/components/navigation -->

<!-- ----------- -->
<!-- design with tailwindcss -->
<!-- ----------- -->

<!-- course -->
<!-- https://tailwindcss.com/course -->
```
