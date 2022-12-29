# HTML

## HTML TEMPLATE (with bootstrap CDN)

``` html
<!doctype html>
<html lang="en">
  <head>
    <title>Profile Scroller</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
  </head>

  <body>


    <!-- HTML STUFF GOES HERE  -->


    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>

    <script>
      // javascript goes here unless linked to.
    </script>
  </body>
</html>

```

## HTML TEMPLATE (with css and script links)

``` html
<!DOCTYPE html> <!-- The DOCTYPE tells the browser what kind of document this is (HTML) -->
<html lang="en">
  <head>
    <!-- The head tag includes important information about the page -->
    <meta charset="UTF-8">
    <meta name="author" content="Landon Yarrington">
    <meta name="description" content="A basic html format."
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- sets the viewport -->
    <title>My Basic HTML Tree</title>
     <!-- This is the title of your page (what appears in the name of a browser tab) -->
    <link rel="stylesheet" href="style.css">
    <!-- This line links your CSS stylesheet to your HTML (see Lesson 1.3) -->
  </head>


  <body>
    <header>
        <h1>Title</h1>
    </header>

    <main>
    </main>

    <footer>
    </footer>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type = "text/javascript" src="script.js"></script>
  </body>

</html>
```

## HTML NOTES

``` html
<!-- BASIC TAGS -->
<!-- italicizes whatever it wraps. (adds emphasis for screen readers.) -->
 <em></em>
<!-- italicizes (without adding "emphasis"). -->
 <i></i>
<!-- bolds whatever it wraps. (strong importance for screen readers.) -->
<strong></strong>
<!-- bolds (without adding "strong importance"). -->
<b></b>
<!-- is an example of a nested element -->
<div><p>HI!</p></div>
<!-- is a block element -->
<div></div>
<!-- is an inline element. -->
<span></span>
 <!-- has a class and an id. -->
 <div class="box" id="firstBox"></div>
<!-- nested text is a clickable link that opens a new tab at the link provided. -->
<a href="http://www.google.com" title="google homepage" target="_blank">GOOGLE</a>
<!-- is a block-level paragraph element. -->
<p></p>
<!-- creates an input box element -->
<input></input>
<!-- creates a clickable button with "RESET" on it. -->
<button>RESET</button>
<!-- the element that everything goes inside. -->
<html></html>
<!-- where you put important things that shouldn't show up on the page.
This includes CSS, character set, title, linking to CSS files, etc. -->
<head></head>
<!-- sets the character set, utf-8 includes most characters from human languages. -->
<meta charset="utf-8">
<!-- title element that sets what is shown on the browser tab. -->
<title></title>
<!-- element that contains everything you want to be visible. -->
<body></body>

<!-- ESCAPING CHARACTERS -->

<!-- < -->
&lt
<!-- > -->
&gt
<!-- " -->
&quot
<!-- ' -->
&apos
<!-- & -->
&amp

<!-- LISTS AND FORMS -->

<!-- unordered list  -->
<ul>
  <li>1</li>
  <li>2</li>
</ul>
<!-- ordered list  -->
<ol>
  <li>1</li>
  <li>2</li>
</ol>
<!-- definition list -->
<dl>
  <dt>1</dt>
  <dd>the first positive whole number</dd>
  <dt>2</dt>
  <dd>the second positive whole number</dd>
</dl>

<!-- FORMS -->

<form action="" method="">  
  <input type="text">
  <input type="checkbox">
  <input type="radio">
  <input type="date">
  <textarea>
  <label for="name">What is your name?</label> <input type="text" id="name">
  <label for="age">How old are you?</label> <input type="number" id="age">
  <button>I am just a button.</button>
  <button type="submit">I am a submit   button!</button>
  <button type="reset">I am a reset button!</button>
  <button type="button">I am a button with an image! <br> <img src="rocketship.png" alt="udacity-rocket"></button>
</form>

<!-- EXAMPLE: -->
<form action="/my-handling-form-page" method="post">
  <div>
      <label for="name">Name:</label>
      <input type="text" id="name" name="user_name">
  </div>
  <div>
      <label for="mail">E-mail:</label>
      <input type="email" id="mail" name="user_mail">
  </div>
  <div>
      <label for="msg">Message:</label>
      <textarea id="msg" name="user_message"></textarea>
  </div>
</form>

<!--
label's for= and input's id= need to match.
action/method tell the form where/how to send the form data.
-->

<!-- EXAMPLE (LOGIN PAGE): -->
<!DOCTYPE html>
<title>Login Page</title>
<form action="http://localhost:8000/" method="GET">
<label>Username:
  <input type="text" name="username">
</label>
<br>
<label>Password:
  <input type="password" name="pw">
</label>
<br>
<button type=submit>Log in!</button>
...

<!-- EXAMPLE POST REQUEST FORM: -->
<!DOCTYPE html>
<title>Testing POST requests</title>
<form action="http://localhost:9999/" method="POST">
  <label>Magic input:
    <input type="text" name="magic" value="mystery">
  </label>
  <br>
  <label>Secret input:
     <input type="text" name="secret" value="spooky">
  </label>
  <br>
  <button type="submit">Do a thing!</button>
</form>

<!-- ## IMAGES, IFRAMES -->

<img src="[url]" alt="backup text description">
  <!-- linking an image with text that appears when the img isn't loaded.
  attribute "srcset" allows multiple possible image sources -->

<iframe width="240" height="132" src="[url]"  allowfullscreen></iframe>
  <!-- effectively embeds content from url (nested broswing content). -->

<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  <!-- put this in the head to link to a favicon in the same directory as "index.html".
  you can link multiple different png files to be used for icons on an iphone/ipad. -->

<!-- ## MISC ADVANCED CONCEPTS -->

<p>Japanese example: <span lang="jp">ご飯が熱い。</span>.</p>
  <!-- this span box is recognized as japanese. -->

<span style="font-size: 32px; margin: 21px 0;">
  <!-- using inline styling to make a span box look like a top level heading -->

<a href="projects/index.html">projects</a>
<!-- links to index.html in subdirectory "projects". -->
<a href="../poop/index.html">poop</a>
<!-- links to index.html (inside the "poop" folder of the parent folder). -->

<h2 id="todaysArticles">Today's Articles</h2>  
  <a href="#todaysArticles">Back to Articles</a>
  <!-- creates a link to the id="todaysArticles" on the same page. -->
  <a href="articles.html#todaysArticles">Back to Articles</a>
  <!-- creates a link to the id="todaysArticles" on the articles page. -->

<!-- http://www.example.com/projects/index.html is an absolute URL
  (if you're already in the projects folder, use a relative URL: index.html) -->
```
