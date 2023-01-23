# HTML

[mdn web docs](https://developer.mozilla.org/en-US/docs/Web)\
[mdn element docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

## Doctype

Doctype preamble:

- prevents a browser from switching to "quirks mode"
- ensures that the browser makes a best-effort attempt at following spec

```html
<!DOCTYPE html>
```

## Root Elements

### Html

The html element is the root (top-level) element of an HTML document.\
It is allowed one `head`, followed by one `body` document.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    Hello World
  </body>
</html>
```

### Head

The `head` element contains document metadata.\
It is the first child of the `html` element.

```html
<head>
  <meta charset="UTF-8" />
  <meta name="description" content="document description" />
  <title>HTML basics</title>
</head>
```

### Link

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link

```html
<!-- CSS examples -->
<link href="/static/css/main.css" rel="stylesheet" />
<link rel="stylesheet" type="text/css" href="static/css/styles.css"/>
```

### Meta

The `meta` element contains metadata.\
Void element.\
Usually inside `head` element.\
[Standard metadata names](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name)

```html
<head>
  <!-- Character set declaration -->
  <meta charset="UTF-8" />
  <!-- Author meta tag (document author's name) -->
  <meta name="author" content="Spongebob Squarepants" />
  <!-- Color scheme meta tag (one or more of normal, light, dark) -->
  <meta name="color-scheme" content="normal" />
  <meta name="color-scheme" content="dark light" />
  <meta name="color-scheme" content="only light" />
  <!-- Description meta tag (for: bookmark descriptions, SEO) -->
  <meta name="description" content="document description" />
  <!-- Generator meta tag (software that generated page) -->
  <meta name="generator" content="React" />
  <!-- Keywords meta tag (comma-separated, content-relevant words) -->
  <meta name="keywords" content="html, css, javascript" />
  <!-- Robots meta tag (requested behavior for cooperative crawlers) -->
  <meta name="robots" content="index, follow" />
  <meta name="robots" content="noindex, nofollow" />
  <!-- Viewport meta tag -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Title tag -->
  <title>HTML basics</title>
</head>
```

### Title

The `title` tag defines the document title.\
Shown in browser's title bar or page tab.\
Always in `head` block.\
Contents: Text only, no tags.\
SEO: longer/descriptive titles perform better than shorter/generic titles.\
A11y: concise, unique-per-page, contain purpose & name of website

```html
<title>HTML basics</title>
```

### Body

The `body` element represents the content of the HTML document.\
Only one, second child of `html` element (after `head`).\
Contains flow content
([flow content docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#flow_content)).\
Includes global attributes
([global attribute docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes))

```html
<body>
  Hello World!
</body>
```

## Heading

```html
<h1>heading 1</h1>
<h2>heading 2</h2>
<h3>heading 3</h3>
<h4>heading 4</h4>
<h5>heading 5</h5>
<h6>heading 6</h6>
```

## Text

Paragraphs (`<p>...</p>`) are block-level elements for text blocks

```html
<p>
  I am a paragraph.
  <br />
  <em>emphasized (italics)</em>
  <br />
  <strong>strong (bold)</strong>
  <br />
  <s>strike-through</s>
  <br />
  <mark>mark (highlighted)</mark>
  <br />
  <a href="javascript:;">link</a>
  <br />
  <q>quote</q>
  <br />
  <code>const a = 5</code>
  <br />
  <kbd>Ctrl + s</kbd>
  <br />
</p>
```

## Anchor

```html
<a href="http://google.com">Google</a>
<br />
<a href="http://google.com" target="_blank">Google (new tab)</a>
<br />
<a href="#">Nowhere</a>
<br />
<a href="javascript:;">Nowhere (no history change)</a>
```

## Image

```html
<!-- Image (relative link) -->
<img src="/images/image.jpg" alt="replacement text" />
<!-- Image (absolute link) -->
<img
  src="https://images.unsplash.com/photo-1549945676-4fdf5f18a9fa"
  alt="Zion National Park"
/>
```

## Containers

### Div

The `div` element is a block-level generic container for flow content.

```html
<div>
  <p>Content</p>
</div>
```

### Span

The `span` element is a generic inline container for phrasing content.

```html
<span> Is mayonnaise an instrument? </span>
```

## Lists

### Unordered list

The `ul` element represents an unordered list. (Bulleted list by default).\
Use CSS list-style-type to change from bullets.

```html
<ul>
  <li>a</li>
  <li>b</li>
  <li>c</li>
</ul>
```

### Ordered list

The `ol` element represents an ordered list. (Numbered list by default).\
Use CSS list-style-type to change index type (eg: roman numerals, letters, etc).

```html
<ol>
  <li>a</li>
  <li>b</li>
  <li>c</li>
</ol>
```

### Descriptive list

The `dl` element represents a description list.\
It encloses a list of grouped terms/descriptions.

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

```html
<dl>
  <dt>eu</dt>
  <dd>I</dd>
  <dt>você</dt>
  <dd>you</dd>
  <dt>ele/ela</dt>
  <dd>he/she</dd>
  <dt>nòs</dt>
  <dd>we</dd>
  <dt>vocês/</dt>
  <dd>you all</dd>
  <dt>eles/elas</dt>
  <dd>they</dd>
</dl>
```

## Tables

```html
<table>
  <thead>
    <tr>
      <th>name</th>
      <th>email</th>
      <th>phone</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>landon</th>
      <th>landon@gmail.com</th>
      <th>555-555-5555</th>
    </tr>
  </tbody>
</table>
```

## Forms

The `form` element represents a document section containing interactive controls
for submitting information.

### Form inputs

Input `id` should match label `for`.\
Input `name` is used during form submission.

```html
<form>
  <!-- Text -->
  <div>
    <label for="name">Name</label>
    <input type="text" id="name" name="name" placeholder="Name" />
  </div>
  <!-- Number -->
  <div>
    <label for="age">Age</label>
    <input type="number" name="age" id="age" />
  </div>
  <!-- Email -->
  <div>
    <label for="email">Email</label>
    <input type="email" name="email" id="email" />
  </div>
  <!-- Password  -->
  <div>
    <label for="pw">Password</label>
    <input type="password" name="pw" id="pw" />
  </div>
  <div>
    <label for="pw2">Confirm Password</label>
    <input type="password" name="pw2" id="pw2" />
  </div>
  <!-- Select -->
  <label for="gender">Gender</label>
  <select name="gender" id="gender">
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="female">Not listed</option>
  </select>
  <!-- Date -->
  <div>
    <label for="dob">Birthdate</label>
    <input type="date" name="dob" id="dob" />
  </div>
  <!-- Radio -->
  <div>
    <legend>Plan</legend>
    <div>
      <input type="radio" name="plan" value="silver" id="silver" />
      <label for="silver">Silver</label>
    </div>
    <div>
      <input type="radio" name="plan" value="gold" id="gold" />
      <label for="gold">Gold</label>
    </div>
    <div>
      <input type="radio" name="plan" value="platinum" id="platinum" />
      <label for="platinum">Platinum</label>
    </div>
  </div>
  <!-- Checkbox -->
  <div>
    <legend>Hobbies</legend>
    <div>
      <input type="checkbox" name="hobbies" id="sports" value="sports" />
      <label for="sports">Sports</label>
    </div>
    <div>
      <input type="checkbox" name="hobbies" id="coding" value="coding" />
      <label for="coding">Coding</label>
    </div>
    <div>
      <input type="checkbox" name="hobbies" id="food" value="food" />
      <label for="food">Food</label>
    </div>
    <div>
      <input type="checkbox" name="hobbies" id="music" value="music" />
      <label for="music">Music</label>
    </div>
    <div>
      <input type="checkbox" name="hobbies" id="reading" value="reading" />
      <label for="reading">Reading</label>
    </div>
    <div>
      <input type="checkbox" name="hobbies" id="crafting" value="crafting" />
      <label for="crafting">Crafting</label>
    </div>
    <div>
      <input type="checkbox" name="hobbies" id="movies" value="movies" />
      <label for="movies">Movies</label>
    </div>
  </div>
  <!-- Submit -->
  <div>
    <!-- <input type="submit" value="Submit" /> -->
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </div>
</form>
```

## HTML entities

```html
<!-- Non-breaking space -->
<p>Oi! &nbsp; Tudo bem? </p>
<!-- Angle brackets -->
<p>5 &gt; 3.</p>
<p>4 &lt; 6.</p>
<!-- Quote -->
<p>&quot;</p>
<!-- Apostrophe -->
<p>&apos;</p>
<!-- Ampersand -->
<p>&amp;</p>
<!-- Copyright -->
<p>&copy;</p>
<p>&reg;</p>
<!-- Currency -->
<p>&cent;</p>
<p>&pound;</p>
<p>&yen;</p>
<p>&euro;</p>
```

## Script

The `script` element is used to embed/reference code.

```html
<script defer="defer" src="/static/js/main.js"></script>
```

## Math

MathML

[mdn docs](https://developer.mozilla.org/en-US/docs/Web/MathML/Element/math)

TODO

## Template

TODO

## Flow content

- embedded content elements
  - audio, canvas, embed, iframe, img, picture, svg, video
- form-related elements
  - button, datalist, form, input, label, meter, option, optgroup, progress,
    select, textarea
- heading elements
  - h1..h6
- list-related elements
  - dd, dl, dt, ol, li, menu, ul
- misc elements
  - dialog, div, hr, script, slot, span, style, template
- text-related elements
  - a, blockquote, br, code, em, kbd, mark, p, pre, q, s, strong
- sectioning elements
  - article, aside, footer, header, main, nav, section
- table-related elements
  - caption, col, colgroup, table, tbody, td, tfoot, th, thead, tr,
- text nodes
- less-used
  - abbr, address, area, base, bdi/bdo, caption, cite, data, del/ins, details,
    dfn, fieldset, figcaption, figure, i, legend, object, output, map,
    ruby/rt/rp, samp, small, sub, summary, sup, time, u, var, wbr

## Global attributes

[mdn docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes)

TODO
