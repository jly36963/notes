# Markdown

## Headers

```md
# This is an <h1> tag

## This is an <h2> tag

###### This is an <h6> tag
```

## Emphasis

### Italic

```md
_This text will be italic_ _This will also be italic_
```

### Bold

```md
**This text will be bold** **This will also be bold**
```

### Both

```md
_You **can** combine them_
```

## Lists

### Unordered

```md
- Item 1
- Item 2
  - Item 2a
  - Item 2b
```

### Ordered

```md
1. Item 1
1. Item 2
1. Item 3
   1. Item 3a
   1. Item 3b
```

## Images

```md
![GitHub Logo](/images/logo.png) Format: ![Alt Text](url)
```

## Links

```md
http://github.com - automatic! [GitHub](http://github.com)
```

## Blockquotes

```md
As Kanye West said:

> We're living the future so the present is our past.
```

## Inline Quotes

Wrap code with triple backticks.

`` ```js `` code here `` ``` ``

```js
const User = ({ authState }) => {
  const { id } = authState.user;
  return <div>id: {id}</div>;
};

export default User;
```

## Midline Breaks

```md
End line with two spaces to create a line break

This also <br/> works
```

## Strike Through

```md
~~This will be crossed out~~
```

## Embed Images

```md
If you want to embed images, this is how you do it:
![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)
```
