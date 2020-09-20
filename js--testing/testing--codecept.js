// ------------
// codecept
// ------------

// setup
`
# install
npm i codeceptjs puppeteer playwright @codeceptjs/configure --save-dev
# initialize
npx codeceptjs init
# generate test file
npx codeceptjs gt
# run tests
npx codeceptjs run --steps # step by step output of running tests
npx codeceptjs run --debug # more details
npx codeceptjs run --verbose # even more details
# run specific test
npx codeceptjs run tests/login_test.js
# parallel run
npx codeceptjs run-workers 4 # threads
`;

// ------------
// simple example
// ------------

// example 1 (see)

Feature("See logo on github.com");

Scenario("test something", (I) => {
  I.amOnPage("https://github.com");
  I.see("GitHub");
});

// example 2 (see)

Feature("Welcome page");

Scenario("check welcome page on site", (I) => {
  I.amOnPage("/");
  I.see("Welcome");
});

// example 3 (see, dontSee, click)

Feature("Login page");

Scenario("check login page on site", (I) => {
  I.amOnPage("/");
  I.click("Login"); // search for button/link with exact text and click it
  I.click("Login", ".nav"); // specify where to search
  I.see("Please Login", "h1"); // check for visible text
  I.dontSee("Log Out"); // make sure text not visible
});

// example 4 (seeElement, dontSeeElement)

Feature("Profile page");

Scenario("check for user element on profile page", (I) => {
  I.amOnPage("/profile");
  I.seeElement(".user"); // select element by class (css)
  I.seeElement("#user"); // select element by id (css)
  I.seeElement("//div[@class=user]"); // select element by class (xpath)
  I.seeElement('//dev[@id="user"]');
  I.seeElement({ css: "div.user" }); // specify selector (css or xpath)
  I.dontSeeElement(".admin"); // check if element doesn't exist
});

// example 5 (fill fields)

// selectOption and checkOption only work with standard 'select' elements.
// alternative -- I.click()

Feature("Signup Page");

Scenario("check signup page works", (I) => {
  I.fillField("First Name", "Kakashi"); // fill field (found by label)
  I.fillField("#last-name", "Hatake"); // fill field (found by id)
  I.fillField("user[email]", "kakashi@hatake.com"); // fill field (found by field name)
  I.fillField("#password1", secret("123456")); // keep password secret (don't show in logs)
  I.fillField("#password2", secret("123456"));
  I.selectOption("Role", "Admin"); // select option (found by label)
  I.checkOption("Accept"); // check box (found by text)
  I.click("Save"); // click save button (found by text)
});

// example 6 (grab)

Feature("Signup and login");

Scenario("check if signup and successive login work", async (I) => {
  I.fillField("email", "miles@davis.com");
  I.click("Generate Password");
  I.fillField("#password", secret("123456")); // keep password secret (don't show in logs)
  const password = await I.grabTextFrom("#password"); // save value for later use
  I.click("Login");
  I.fillField("email", "miles@davis.com");
  I.fillField("password", password);
  I.click("Log in!");
  I.see("Hello, Miles");
});

// example 7 (waiting)

Feature("Wait for and check welcome");

Scenario("wait for page to render and check for content", (I) => {
  I.amOnPage("/");
  I.waitForElement("#welcome", 30); // wait 30 seconds
  I.seeElement("#welcome");
});

// example 8 (debug)

Feature("Welcome page");

Scenario("check welcome page on site", (I) => {
  I.amOnPage("/");
  pause(); // causes test to stop, opens interactive shell
  I.see("Welcome");
});

// example 9 (before / after)

Feature("Welcome page");

Before((I) => {
  // prep steps
  I.amOnPage("/");
});

Scenario("check welcome page on site", (I) => {
  I.see("Welcome");
});

After((I) => {
  // cleanup
});

// example 10 (comments)

Feature("Welcome page");

Scenario("check welcome page on site", (I) => {
  I.say('Going to "/"');
  I.amOnPage("/");
  I.say('Looking for "Welcome" text');
  I.see("Welcome");
});

// example 11 (screenshot)

Feature("Welcome page");

Scenario("check welcome page on site", (I) => {
  I.amOnPage("/");
  I.see("Taking screenshot");
  I.saveScreenshot("my-screenshot.png");
});

// ------------
// helpers
// ------------

// docs
// https://codecept.io/basics/#architecture

// helpers
// webdriver
// proctractor
// nightmare
// puppeteer

// ------------
// config
// ------------

// config
// config in `codecept.conf.js`.
// this file is generated during init process
// use custom config file
// npx codeceptjs run -c codecept.ci.conf.js

exports.config = {
  helpers: {
    // enabled helpers with their configs
  },
  plugins: {
    // list of used plugins
  },
  include: {
    // current actor and page objects
  },
};

// ------------
// multiple sessions
// ------------

// https://codecept.io/basics/#multiple-sessions

// ------------
// config example (playwright)
// ------------

// https://codecept.io/helpers/Playwright/#configuration

// env
require("dotenv").config();
// imports
const { setHeadlessWhen } = require("@codeceptjs/configure");
const { devices } = require("playwright");
// headless
setHeadlessWhen(process.env.HEADLESS); // enable headless when env var HEADLESS exists

exports.config = {
  tests: "./tests/*.js",
  output: "./tests/output", // where screenshots will go
  helpers: {
    // enabled helpers with their configs
    Playwright: {
      // base url
      url: process.env.FRONTEND_URL || "http://localhost:3000",
      // browser to use -- chromium, firefox, webkit
      browser: "chromium",
      // emulate a device
      emulate: devices["iPhone 6"],
      // keep cookies between tests (restart === false)
      keepCookies: true,
      // restart browser between tests
      restart: false,
      // wait _ ms between actions (default 100)
      waitForAction: 100,
      // how long to wait to consider navigation complete -- load, domcontentloaded, networkidle
      waitForNavigation: "load",
      // default window size
      windowSize: "640x480",
    },
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
  include: {
    // current actor and page objects
  },
};

// ------------
// access playwright helper
// ------------

// browser
const { browser } = this.helpers.Playwright;
await browser.pages(); // List of pages in the browser
// page
const { page } = this.helpers.Playwright;
await page.url(); // Get the url of the current page
// context
const { browserContext } = this.helpers.Playwright;
await browserContext.cookies(); // get current browser context

// ------------
// playwright API
// ------------

// amAcceptingPopups

I.amAcceptingPopups();
I.click("#triggerPopup");
I.acceptPopup();

// amCancellingPopups

I.amCancellingPopups();
I.click("#triggerPopup");
I.cancelPopup();

// amOnPage

I.amOnPage("/"); // opens main page of website
I.amOnPage("https://github.com"); // opens github
I.amOnPage("/login"); // opens a login page

// appendField

I.appendField("#myTextField", "appended");

// attachFile

I.attachFile("Avatar", "data/avatar.jpg");
I.attachFile("form input[name=avatar]", "data/avatar.jpg");

// checkOption

I.checkOption("#agree");
I.checkOption("I Agree to Terms and Conditions");
I.checkOption("agree", "//form");

// clearCookie

I.clearCookie();
I.clearCookie("test");

// clearField

I.clearField("Email");
I.clearField("user[email]");
I.clearField("#email");

// click

I.click("Logout"); // simple link
I.click("Submit"); // button of form
I.click("#form input[type=submit]"); // CSS button
I.click("//form/*[@type=submit]"); // XPath
I.click("Logout", "#nav"); // link in context
I.click({ css: "nav a.login" }); // using strict locator

// closeCurrentTab

I.closeCurrentTab();

// closeOtherTabs

I.closeOtherTabs();

// dontSee

I.dontSee("Login"); // assume we are already logged in.
I.dontSee("Login", ".nav"); // no login inside .nav element

// dontSeeCheckboxIsChecked

I.dontSeeCheckboxIsChecked("#agree"); // located by ID
I.dontSeeCheckboxIsChecked("I agree to terms"); // located by label
I.dontSeeCheckboxIsChecked("agree"); // located by name

// dontSeeCookie

I.dontSeeCookie("auth"); // no auth cookie

// dontSeeCurrentUrlEquals

I.dontSeeCurrentUrlEquals("/login"); // relative url are ok
I.dontSeeCurrentUrlEquals("http://mysite.com/login"); // absolute urls are also ok

// dontSeeElement (visible elements)

I.dontSeeElement(".modal"); // modal is not shown

// dontSeeElementInDOM (in DOM)

I.dontSeeElementInDOM(".nav"); // checks that element is not on page visible or not

// dontSeeInCurrentUrl

I.dontSeeInField("email", "user@user.com"); // field by name
I.dontSeeInField({ css: "form input.email" }, "user@user.com"); // field by CSS

// dontSeeInSource (string is not ofund in raw source code)

I.dontSeeInSource("<!--"); // no comments in source

// dontSeeInTitle

I.dontSeeInTitle("Error");

// doubleClick

I.doubleClick("Edit");
I.doubleClick("Edit", ".actions");
I.doubleClick({ css: "button.accept" });
I.doubleClick(".btn.edit");

// dragAndDrop

I.dragAndDrop("#dragHandle", "#container");

// dragSlider

I.dragSlider("#slider", 30);
I.dragSlider("#slider", -70);

// executeScript

I.executeScript(() => window.alert("Hello world")); // execute script
I.executeScript(({ x, y }) => x + y, { x, y }); // object
I.executeScript(([x, y]) => x + y, [x, y]); // array

// fillField

I.fillField("Email", "hello@world.com"); // by label
I.fillField("password", secret("123456")); // by name
I.fillField("form#login input[name=username]", "John"); // by CSS
I.fillField({ css: "form#login input[name=username]" }, "John"); // or by strict locator

// forceClick

I.forceClick("#hiddenButton");
I.forceClick("Click me", "#hidden");

// grabAttributeFrom

let hint = await I.grabAttributeFrom("#tooltip", "title"); // locator, attribute

// grabBrowserLogs

let logs = await I.grabBrowserLogs(); // JS log from browser
console.log(JSON.stringify(logs));

// grabCssPropertFrom

const value = await I.grabCssPropertyFrom("h3", "font-weight");

// grabCurrentUrl

let url = await I.grabCurrentUrl();
console.log(`Current URL is [${url}]`);

// grabDataFromPerformanceTiming
// returns -- { responseEnd, domInteractive, domContentLoadedEventEnd, loadEventEnd, }

await I.amOnPage("https://example.com");
let data = await I.grabDataFromPerformanceTiming();

// grabElementBoundingRect
// returns -- { x: 226.5, y: 89, width: 527, height: 220 }

const value = await I.grabElementBoundingRect("h3");

// grabElementBoundingRect (one value)
// x, y, width, height

const width = await I.grabElementBoundingRect("h3", "width");

// grabHTMLFrom

let postHTML = await I.grabHTMLFrom("#post");

// grabNumberOfOpenTabs

let tabs = await I.grabNumberOfOpenTabs();

// grabNumberOfVisibleElements

let numOfElements = await I.grabNumberOfVisibleElements("p"); // number of <p> elements

// grabPageScrollPosition

let { x, y } = await I.grabPageScrollPosition();

// grabPopupText

let text = await I.grabPopupText();

// grabSource

let pageSource = await I.grabSource();

// grabTextFrom

let pin = await I.grabTextFrom("#pin");

// grabTitle

let title = await I.grabTitle();

// grabValueFrom

let email = await I.grabValueFrom("input[name=email]");

// handleDownloads

I.handleDownloads("downloads/avatar.jpg");
I.click("Download Avatar");
I.amInPath("output/downloads");
I.waitForFile("downloads/avatar.jpg", 5);

// haveRequestHeaders

I.haveRequestHeaders({ "X-Sent-By": "CodeceptJS" }); // set headers for all next requests

// moveCursorTo

I.moveCursorTo(".tooltip");
I.moveCursorTo("#submit", 5, 5); // with offset

// openNewTab

I.openNewTab();
I.openNewTab({ isMobile: true }); // enable mobile

// pressKey
// accepted key names -- https://codecept.io/helpers/Playwright/#presskey

I.pressKey("Backspace"); // one key
I.pressKey(["Control", "Z"]); // combination
I.pressKey(["CommandOrControl", "Z"]); // cmd (mac) or cntrl (non-mac)

// pressKeyDown & pressKeyUp

I.pressKeyDown("Control");
I.click("#element");
I.pressKeyUp("Control");

// refreshPage

I.refreshPage();

// resizeWindow

// ...

// rightClick

I.rightClick("#el"); // right click element with id el
I.rightClick("Click me"); // right click link or button with text "Click me"
I.rightClick("Click me", ".context"); // right click button with text "Click me" inside .context

// saveScreenshot

I.saveScreenshot("debug.png");
I.saveScreenshot("debug.png", true); //resizes to available scrollHeight and scrollWidth before taking screenshot

// scrollPageToBottom & scrollPageToTop

I.scrollPageToBottom();
I.scrollPageToTop();

// scrollTo

I.scrollTo("footer");
I.scrollTo("#submit", 5, 5);

// see

I.see("Welcome"); // text welcome on a page
I.see("Welcome", ".content"); // text inside .content div
I.see("Register", { css: "form.register" }); // use strict locator

// seeAttributesOnElements

I.seeAttributesOnElements("//form", { method: "post" });

// seeCheckboxIsChecked

I.seeCheckboxIsChecked("Agree");
I.seeCheckboxIsChecked("#agree"); // I suppose user agreed to terms
I.seeCheckboxIsChecked({ css: "#signup_form input[type=checkbox]" });

// seeCookie
// check if cookie with given name exists

I.seeCookie("Auth");

// seeCssPropertiesOnElements

I.seeCssPropertiesOnElements("h3", { "font-weight": "bold" });

// seeCurrentUrlEquals

I.seeCurrentUrlEquals("/register");
I.seeCurrentUrlEquals("http://my.site.com/register");

// seeElement

I.seeElement("#modal");

// seeElementInDOM

I.seeElementInDOM("#modal");

// seeInCurrentUrl

I.seeInCurrentUrl("/register"); // we are on registration page

// seeInField

I.seeInField("Username", "davert");
I.seeInField({ css: "form textarea" }, "Type your comment here");
I.seeInField("form input[type=hidden]", "hidden_value");
I.seeInField("#searchform input", "Search");

// seeInPopup

I.seeInPopup("Popup text");

// seeInSource

I.seeInSource("<h1>Green eggs &amp; ham</h1>");

// seeInTitle

I.seeInTitle("Home Page");

// seeNumberOfElements

I.seeNumberOfElements("#submitBtn", 1);

// seeNumberOfVisibleElements

I.seeNumberOfVisibleElements(".buttons", 3);

// seeTextEquals

I.seeTextEquals("text", "h1");

// seeTitleEquals

I.seeTitleEquals("Test title.");

// selectOption

I.selectOption("Choose Plan", "Monthly"); // select by label
I.selectOption("subscription", "Monthly"); // match option by text
I.selectOption("subscription", "0"); // or by value
I.selectOption("//form/select[@name=account]", "Premium");
I.selectOption("form select[name=account]", "Premium");
I.selectOption({ css: "form select[name=account]" }, "Premium");

// setCookie

I.setCookie({ name: "auth", value: true });
I.setCookie([
  { name: "auth", value: true },
  { name: "agree", value: true },
]);

// switchToNextTab

I.switchToNextTab();
I.switchToNextTab(2);

// switchToPreviousTab

I.switchToPreviousTab();
I.switchToPreviousTab(2);

//uncheckOption

I.uncheckOption("#agree");
I.uncheckOption("I Agree to Terms and Conditions");
I.uncheckOption("agree", "//form");

// wait

I.wait(2); // wait 2 secs

// waitForClickable

I.waitForClickable(".btn.continue"); // default -- 1 second
I.waitForClickable(".btn.continue", 5); // wait for 5 secs

// waitForDetached

I.waitForDetached("#popup");

// waitForElement

I.waitForElement(".btn.continue"); // default -- 1 second
I.waitForElement(".btn.continue", 5); // wait for 5 secs

// waitForFunction
// wait for a function to return true

I.waitForFunction(() => window.requests == 0); // default -- 1 second
I.waitForFunction(() => window.requests == 0, 5); // waits for 5 sec
I.waitForFunction((count) => window.requests == count, [3], 5); // pass args and wait for 5 sec

// waitForInvisible

I.waitForInvisible("#popup");

// waitForRequest

I.waitForRequest("http://example.com/resource");
I.waitForRequest(
  (request) =>
    request.url() === "http://example.com" && request.method() === "GET"
);

// waitForResponse

I.waitForResponse("http://example.com/resource");
I.waitForResponse(
  (request) =>
    request.url() === "http://example.com" && request.method() === "GET"
);

// waitForText

I.waitForText("Thank you, form has been submitted");
I.waitForText("Thank you, form has been submitted", 5, "#modal");

// waitForValue

I.waitForValue("//input", "GoodValue");

// waitForVisible

I.waitForVisible("#popup");

// waitInUrl

I.waitInUrl("/info", 2);

// waitNumberOfVisibleElements

I.waitNumberOfVisibleElements("a", 3);

// waitToHide

I.waitToHide("#popup");

// waitUntil

I.waitUntil(() => window.requests == 0);
I.waitUntil(() => window.requests == 0, 5);

// waitUrlEquals

I.waitUrlEquals("/info", 2);
I.waitUrlEquals("http://127.0.0.1:8000/info");

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------
