// ------------
// NEXT.JS
// ------------

// SSR and SEO for React SPA

// ------------
// setup
// ------------

// create 'client' directory
`
mkdir client; cd client
`
// initialize package.json (requires input)
`
npm init 
`
// install react & next
`
npm install --save react react-dom next
`
// add scripts in package.json

`
{
  "scripts": {
    "dev": "next",
    "built": "next build",
    "start": "next start"
  }
}
`

// with development proxy
  // https://github.com/zeit/next.js/tree/master/examples/with-custom-reverse-proxy
  // server.js -- holds the development server's logic
  `
{
  "scripts": {
    "dev": "node server.js",
    "built": "next build",
    "start": "next start"
  }
}
`


// ------------
// server routing
// ------------

// MANDATORY -- make directory '/src/pages'
  // ** originally it was '/pages' **
  // then create entry point (index.js)
  // '/' route -- index.js
`
mkdir -p /src/pages; cd /src/pages; touch index.js
`

// create additional pages
  // name file according to route
  // '/about' route -- 'about.js' or '/about/index.js/'
  // '/contact' route -- 'contact.js' or '/contact/index.js'
  // from inside 'src//pages':
`
touch about.js contact.js
`

// create components used by routes
  // put components in '/src/components' 
`
mkdir components
`

// public files
  // put public files in '/public'
`
mkdir public
`

// ------------
// routing
// ------------

// docs
  // https://nextjs.org/docs/routing/introduction

// ------------
// link (client-side navigation)
// ------------

import Link from "next/link";

<Link href='/about'>
  <button>About Page</button>
</Link>

// ------------
// getInitialProps
// ------------

// docs
  // https://nextjs.org/docs/api-reference/data-fetching/getInitialProps

// limitations
  // can only be used in a page's default export (no children components)

// if present
  // initial render -- execute on server only
  // only executed on client when navigating client-side.

// hooks + getInitialProps
  // https://spectrum.chat/next-js/general/static-getinitialprops-in-react-hooks~bf6f053e-3248-410e-b0bc-f200d3092b86

// axios + getInitialProps
  // https://github.com/zeit/next.js/issues/8160#issuecomment-516124692

// isomorphic unfetch
  // switches between unfetch & node-fetch
  // https://www.npmjs.com/package/isomorphic-unfetch

// ------------
// overriding default _app
// ------------

// create/edit '/src/pages/_app.js'

function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp

// ------------
// use query (getInitialProps)
// ------------

// access query string in stateless component
  // pathname (path of URL), query (query as object), asPath (path and query), req, res, err

// query string
<Link href={`/post?id=${post.id}`}>
  {post.title}
</Link>

const Post = ({ id }) => (
  <h1>Post id: {id}</h1>
)
Post.getInitialProps = async ({ query }) => query;
export default Post;


// ------------
// router
// ------------

// docs
  // https://nextjs.org/docs/api-reference/next/router

// router has:
  // route, pathname, query, asPath

// withRouter
import { withRouter } from "next/router";
const Post = ({ query }) => (<h1>id: {query.id}</h1>);
export default withRouter(Post);

// useRouter
import { useRouter } from 'next/router';
const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  return (<h1>id: {id}</h1>);
}

// ------------
// using custom routes
// ------------

// IMPORTANT!!! -- custom server removes important performance optimizations

// client-side
  // link as
  // https://nextjs.org/docs/api-reference/next/link

// server-side (node.js -- no express)
  // https://nextjs.org/docs/advanced-features/custom-server

// ------------
// custom routes (server-side with express)
// ------------

// imports
const express = require('express');
const next = require('next');
// env
const dev = proces.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000;
// handler
app = next({ dev });
const handle = app.getRequestHandler();
// next.js app
app.prepare().then(() => {
  // express server
  const server = express();
  // custom route (req.params --> query string)
  server.get("/p/:id", (req, res) => {
    app.render(req, res, "/post", { id: req.params } );
  })
  // catch all
  server.get("*", (req, res) => {
    return handle(req, res);
  })
  // start express server
  server.listen(port, err => {
    if (err) throw err;
    console.log(`Now serving on localhost:${port}`);
  })
})


// ------------
// _document (custom document)
// ------------

// docs
  // https://nextjs.org/docs/advanced-features/custom-document


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


