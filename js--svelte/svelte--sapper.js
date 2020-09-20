// ------------
// sapper
// ------------

// pages are svelte components
// create pages by adding files to src/routes
// SSR for faster first visit, client-side app takes over.

// ------------
// setup
// ------------

// rollup
`
npx degit "sveltejs/sapper-template#rollup" my-app
cd my-app
npm install
npm run dev
` // webpack
`
npx degit "sveltejs/sapper-template#webpack" my-app
cd my-app
npm install
npm run dev
`// app structure // ------------
// ------------

// initial structure

`
├ package.json
├ src
│ ├ routes
│ │ ├ # your routes here
│ │ ├ _error.svelte
│ │ └ index.svelte
│ ├ client.js
│ ├ server.js
│ ├ service-worker.js
│ └ template.html
├ static
│ ├ # your files here
└ rollup.config.js || webpack.config.js
`// cypress -- directory and files that are related to testing // __sapper__ -- created on first run, contains generated files

// ------------
// usage
// ------------

`
# start dev server
npm run dev 

# build production app
npm run build

# start app in production mode (use prod build)
npm start

# create static version (if applicable)
npm run export

# serve static app
npx serve __sapper__/export
`;

// ------------
// entry points
// ------------

// src/client.js -- create sapper middleware
// src/server.js -- server that uses sapper middleware
// src/service-worker.js -- proxy server, gives fine-grained control over handling network requests.
// src/template.html -- html template. sapper will inject content for specific tags
// %sapper.base% -- base element
// %sapper.styles% -- critical CSS for page being requested
// %sapper.head% -- html representing page-specific head contents (ie: title)
// %sapper.html% -- html representing body of page being rendered
// %sapper.scripts% -- script tags for the client-side app

// ------------
// server
// ------------

// static
// 'static/favicon.png' will be served as '/favicon.png'
// sapper doesn't serve static files by default, use a middleware like 'sirv'

// sapper
// use sappper middleware in server

import "dotenv/config";
import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import bodyParser from "body-parser";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

polka()
  .use(bodyParser.json())
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware({})
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });

// ------------
// routing
// ------------

// https://sapper.svelte.dev/docs#Routing

// ------------
// config (rollup & webpack)
// ------------

// rollup and webpack are options for bundling the app
// loaders/plugins can be added here for custom bundling.

// ------------
// routing
// ------------

// two types of routes -- pages and server routes

// pages
// src/routes/index.svelte -- /
// src/routes/about.svelte -- /about
// src/routes/about/index.svelte -- /about
// src/routes/users/[id].svelte -- /users/:id (page.params.id) (available in preload)

// server routes
// src/routes/users/[id].js -- users/;id (req.params.id)

// neither
// src/routes/_error.svelte -- underscore signifies not a route

// ------------
// features
// ------------

// client api
// https://sapper.svelte.dev/docs#Client_API

// preloading
// https://sapper.svelte.dev/docs#Preloading

// links
// https://sapper.svelte.dev/docs#Link_options

// ------------
// static site generation (sapper export)
// ------------

// https://sapper.svelte.dev/docs#sapper_export

// ------------
//
// ------------

// ------------
//
// ------------
