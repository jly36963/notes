// ---------
// rollup.config.js
// ---------

// ---------
// example
// ---------

// rollup.config.js
import svelte from "rollup-plugin-svelte";

config = {
  input: "src/main.js",
  output: {
    file: "public/bundle.js",
    format: "iife",
  },
  plugins: [
    svelte({
      extensions: [".my-custom-extension"], // all .svelte and .html files are compiled. specify additional extensions
      include: "src/components/**/*.svelte", // restrict files by using 'include' and 'exclude
      generate: "ssr", // which compiler -- client-side or SSR
      hydratable: true, // if ssr, ensure extra attributes are added to head. (elements for hydration)
      // optional: preprocess svelte components. https://svelte.dev/docs#svelte_preprocess
      preprocess: {
        style: ({ content }) => {
          return transformStyles(content);
        },
      },
      emitCss: true, // emit CSS as "files" for other plugins to process
      customElement: false, // true -- compile component to custom elements (web elements)
      // Extract CSS into a separate file (recommended).
      css: function (css) {
        console.log(css.code); // the concatenated CSS
        console.log(css.map); // a sourcemap
        // creates `main.css` and `main.css.map`
        // using a falsy name will default to the bundle name
        // — pass `false` as the second argument if you don't want the sourcemap
        css.write("main.css");
      },
      // Warnings are normally passed straight to Rollup. You can
      // optionally handle them here, for example to squelch
      // warnings with a particular code
      onwarn: (warning, handler) => {
        // e.g. don't warn on <marquee> elements, cos they're cool
        if (warning.code === "a11y-distracting-elements") return;
        // let Rollup handle all other warnings normally
        handler(warning);
      },
    }),
  ],
};

export default config;

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------

// ---------
//
// ---------
