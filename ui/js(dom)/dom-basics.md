# DOM selection and manipulation

[Document mdn docs](https://developer.mozilla.org/en-US/docs/Web/API/Document)\
[HTML collection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection)
[Node list](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)
[Node mdn docs](https://developer.mozilla.org/en-US/docs/Web/API/Node)\
[Element mdn docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/append)

Inheritance: EventTarget -> Node -> Element -> HTMLElement -> HTMLLIElement

## Single-element selectors

```html
<html>
  <head>
    <style>
      #app {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .box {
        width: 20rem;
        height: 20rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ddd;
        color: "#333";
        border-radius: 2%;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div id="content" class="box">Hello world!</div>
    </div>
    <script>
      // ---
      // Basics
      // ---

      // Select element
      const box = document.getElementById("content");
      // Get properties
      const { id, className, tagName } = box;
      console.log(box);
      console.log({ id, className, tagName });
      // Change styling
      box.style.background = "#eee";
      box.style.color = "#111";
      // Change contents
      box.innerText = "Olá mundo"; // Also textContents and innerHtml

      // ---
      // Selecting
      // ---

      let elem;

      // getElementById
      elem = document.getElementById("app");

      // querySelector (get first match)
      elem = document.querySelector("#app"); // id
      elem = document.querySelector(".box"); // class
      elem = document.querySelector("div"); // element
      elem = document.querySelector("div div"); // div child of div parent
      elem = document.querySelector("div:last-child"); // last child (pseudo-class)
      elem = document.querySelector("li:nth-child(3)"); // 3rd child (pseudo-class)
      console.log(elem);
      elem = document.querySelector("li.list-items:nth-child(1)"); // element,class, & pseudo-class
    </script>
  </body>
</html>
```

## Multiple element selectors

```html
<html>
  <head>
    <style></style>
  </head>
  <body>
    <div id="app">
      <ul class="list">
        <li class="item">1</li>
        <li class="item">2</li>
        <li class="item">3</li>
      </ul>
    </div>
    <script>
      let items;

      // Select all elements of class (HTMLCollection)
      items = document.getElementsByClassName("item");
      // From first "ul" element, select all "item" class children (HTMLCollection)
      items = document.querySelector("ul").getElementsByClassName("item");
      // Select all elements of tag (HTMLCollection)
      items = document.getElementsByTagName("li");

      // View HTMLCollection
      console.log(items);
      Array.from(items).forEach(({ innerText }) => console.log(innerText));

      // Select all odd "li"
      items = document.querySelectorAll("li:nth-child(odd)");
      // For all "ul", select all "li" children (NodeList)
      items = document.querySelectorAll("ul li");

      // View NodeList
      console.log(items);
      items.forEach(({ innerText }) => console.log(innerText));
    </script>
  </body>
</html>
```

## Relative selectors

```html
<html>
  <head>
    <style></style>
  </head>
  <body>
    <main>
      <div id="app">
        <h2>Numbers</h2>
        <ul class="list">
          <li class="item">1</li>
          <li class="item">2</li>
          <li class="item">3</li>
        </ul>
        <h2>Letters</h2>
        <ul class="list">
          <li class="item">A</li>
          <li class="item">B</li>
          <li class="item">C</li>
        </ul>
      </div>
    </main>
    <script>
      const NODE_TYPES = {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        COMMENT_NODE: 8,
      };

      const list = document.querySelector("#app ul.list");

      // childNodes (NodeList)
      const { childNodes } = list;
      childNodes.forEach((n) => {
        // NodeList contains non-element types
        // Skip non-elements
        if (n.nodeType !== NODE_TYPES.ELEMENT_NODE) return;
        console.log(n.innerText);
      });

      // children (HTMLCollection)
      const { children } = list;
      console.log({ children });

      // Child
      const {
        firstChild, // First node (might not be an element)
        firstElementChild, // First element child
        lastChild, // Last node (might not be an element)
        lastElementChild, // Last element child
        childElementCount, // Number of element children
      } = list;
      // Parent
      const {
        parentElement, // Parent element
        parentNode, // Parent node (might not be an element)
        parentElement: { parentElement: grandparentElement },
      } = list;
      // Sibling
      const {
        nextSibling, // Next sibling node (might not be an element)
        nextElementSibling,
        previousElementSibling,
      } = list.children[1];
      console.log("children", {
        fec: firstElementChild.innerText,
        lec: lastElementChild.innerText,
      });
      console.log("parent", {
        pe: parentElement.innerText,
        gpe: grandparentElement.innerText,
      });
      console.log("sibling", {
        nes: nextElementSibling.innerText,
        pes: previousElementSibling.innerText,
      });
    </script>
  </body>
</html>
```

# Manipulating the DOM

```html
<html>
  <head>
    <style></style>
  </head>
  <body>
    <main>
      <div id="app">
        <h2>Numbers</h2>
        <ul class="list">
          <li class="item">um</li>
          <li class="item">dois</li>
          <li class="item">três</li>
          <li class="item">quatro</li>
        </ul>
      </div>
    </main>
    <script>
      let parent;
      // ---
      // Creating elements
      // ---

      // Create HTMLLIElement
      const li = document.createElement("li");
      // Set attributes (eg: className, id, innerHTML, etc)
      li.className = "item";
      li.id = null;
      li.setAttribute("title", "New Item");
      // Add text node
      li.appendChild(document.createTextNode("cinco"));
      // Append new child (HTMLElement) to DOM
      document.querySelector("ul.list").appendChild(li);

      const text = document.querySelector("ul.list").innertText;
      console.log(text);

      // ---
      // Replacing elements
      // ---

      // Create element
      const newElement = document.createElement("h2");
      // Append text node
      newElement.appendChild(document.createTextNode("Números"));
      // Select element to be replaced
      const existingElement = document.querySelector("div#app h2");
      parent = document.getElementById("app");
      // Replace child
      parent.replaceChild(newElement, existingElement);

      // ---
      // Removing elements
      // ---

      // Element remove itself
      const items = Array.from(document.querySelectorAll("li"));
      items.at(-1).remove();
      // Parent remove child
      parent = document.querySelector("div#app ul");
      parent.removeChild(items.at(-2));

      // ---
      // Add & remove class
      // ---

      const header = document.querySelector("div#app h2");
      header.classList.add("app-header");
      header.classList.add("oops");
      header.classList.remove("oops");

      // ---
      // Add & remove attr
      // ---

      const htmlElement = document.querySelector("html");
      htmlElement.setAttribute("lang", "en");
      const hasLang = htmlElement.hasAttribute("lang");
      const lang = htmlElement.getAttribute("lang");
      console.log("html", { hasLang, lang });

      header.setAttribute("data-idk", "oops");
      header.removeAttribute("data-idk");
    </script>
  </body>
</html>
```
