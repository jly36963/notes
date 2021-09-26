// -----------
// -----------
// nuxt
// -----------
// -----------

# create nuxt app
npx create-nuxt-app my-app

# dev
npm run dev

# prod
npm run build
npm run start

// -----------
// -----------
// directory structure
// -----------
// -----------

// https://nuxtjs.org/guides/directory-structure/nuxt

// .nuxt -- build directory
// assets -- uncompiled assets (images, fonts, etc) (processed by webpack)
// components -- reusable child components (not pages)
// content -- static CMS? ( https://nuxtjs.org/blog/creating-blog-with-nuxt-content/ )
// dist -- where `nuxt generate` outputs (static app) (static hosting)
// layouts -- wrapper components (default, error, [...customLayouts])
// middleware -- app middleware
// modules -- packages that customize/extend Nuxt app during boot
// pages -- page components
// static -- static files (not processed by webpack)
// store -- vuex store files (entry point: store/index.js)

// -----------
// -----------
// configuration
// -----------
// -----------

// https://nuxtjs.org/faq/external-resources

// -----------
// -----------
// routes
// -----------
// -----------

pages/
--| index.vue
--| home.vue
--| about.vue
--| blog/
-----| _blogId/
--------| index.vue
--------| comments.vue
--| users/
-----| _userId.vue
-----| _userId/
--------| posts/
-----------| _postId


// -----------
// -----------
// views
// -----------
// -----------

// https://nuxtjs.org/guide/views/

// -----------
// -----------
// routing
// -----------
// -----------

// nuxt link ( nuxt-link, NuxtLink, n-link )

<template>
  <div>
    <NuxtLink to="/">Landing</NuxtLink>
    <a href="https://google.com">Google</a>
  </div>
</template>

// -----------
// -----------
// layout 
// -----------
// -----------

// -----------
// default layout 
// -----------

// have a 'default.vue' file inside the layouts directory
// pages with no specified layout will use this

// -----------
// minimum layout
// -----------

<template>
  <Nuxt />
</template>

// -----------
// layout with navbar / footer
// -----------

<template>
  <div>
    <div class="navbar">...</div>
    <Nuxt />
    <div class="footer">...</div>
  </div>
</template>

// -----------
// specify a layout to use (don't use default in layouts/default.vue)
// -----------

<template>
  <div>Hello</div>
</template>
<script>
  export default {
    layout: 'my-layout'
  }
</script>

// -----------
// default error layout (treat like a page)
// -----------

// layouts/error.vue

<template>
  <div>
    <h1 v-if="error.statusCode === 404">404 | Not found</h1>
    <h1 v-else>An error occurred</h1>
    <NuxtLink to="/">Home page</NuxtLink>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    // layout: 'error' // custom layout
  }
</script>

// -----------
// keep-alive -- save fetch calls on pages already visited
// -----------

<template>
  <Nuxt keep-alive />
</template>

// -----------
// -----------
// nuxt component methods
// -----------
// -----------

// -----------
// asyncData
// -----------

// handle async data before setting component (merges with 'data' property)

<script>
  export default {
    data() {
      return { project: 'default' }
    },
    asyncData(context) {
      return { project: 'nuxt' }
    }
  }
</script>

// -----------
// fetch -- (1) (list of posts)
// -----------

<template>
  <div>
    <h1>Blog posts</h1>
    <p v-if="$fetchState.pending">Fetching posts...</p>
    <p v-else-if="$fetchState.error">
      Error while fetching posts: {{ $fetchState.error.message }}
    </p>
    <ul v-else>
      <li v-for="post of posts" :key="post.id">
        <n-link :to="`/posts/${post.id}`">{{ post.title }}</n-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        posts: []
      }
    },
    async fetch() {
      this.posts = await this.$http.$get(
        'https://jsonplaceholder.typicode.com/posts'
      )
    }
  }
</script>

// -----------
// fetch (2) (post detail)
// -----------

<template>
  <div v-if="$fetchState.pending">Fetching post #{{$route.params.id}}...</div>
  <div v-else>
    <h1>{{ post.title }}</h1>
    <pre>{{ post.body }}</pre>
    <p><n-link to="/">Back to posts</n-link></p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        post: {}
      }
    },
    async fetch() {
      this.post = await this.$http.$get(
        `https://jsonplaceholder.typicode.com/posts/${this.$route.params.id}`
      )
    }
  }
</script>

// -----------
// fetch (3) (watch query, fetch again)
// -----------

<script>
  export default {
    watch: {
      '$route.query': '$fetch'
    },
    async fetch() {
      // Called also on query changes
    }
  }
</script>

// -----------
// head (set meta tags for head)
// -----------

<template>
  <h1>{{ title }}</h1>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Hello World!'
      }
    },
    head() {
      return {
        title: this.title,
        meta: [
          // hid is used as unique identifier. Do not use `vmid` for it as it will not work
          {
            hid: 'description',
            name: 'description',
            content: 'My custom description'
          }
        ]
      }
    }
  }
</script>

// -----------
// layout (specify layout to use (layouts/default.vue if none provided))
// -----------

<script>
  export default {
    // method 1
    layout: 'blog',
    // method 2
    layout(context) {
      return 'blog'
    }
  }
</script>

// -----------
// loading (1) (show nuxt loading component)
// -----------

<template>
  <h1>My page</h1>
</template>

<script>
  export default {
    loading: false
  }
</script>

// -----------
// loading (2) (start / finish)
// -----------

<script>
  export default {
    mounted() {
      this.$nextTick(() => {
        // start loader
        this.$nuxt.$loading.start()
        // stop loader
        setTimeout(() => this.$nuxt.$loading.finish(), 500)
      })
    }
  }

</script>

// -----------
// middleware 
// -----------

// https://nuxtjs.org/guides/directory-structure/middleware

// -----------
// scrollToTop 
// -----------

// https://nuxtjs.org/guides/components-glossary/pages-scrolltotop

// -----------
// transition 
// -----------

// https://v3.vuejs.org/guide/transitions-enterleave.html#transitioning-single-elements-components
// https://nuxtjs.org/guides/features/transitions

// -----------
// validate 
// -----------

<script>
  export default {
    validate({ params, query, store }) {
      const condition = true
      return condition;
    }
  }
</script>

// -----------
// -----------
// context and helpers
// -----------
// -----------

// https://nuxtjs.org/guides/concepts/context-helpers

function(context) {
  // both
  const { app, store, route, params, query, env, /* ... */ } = context;
  // client
  if (process.client) {
    const { from, nuxtState } = context;
  }
  // server
  if (process.server) {
    const { req, res, beforeNuxtRender } = context;
  }
}

// server-side

req -- 
res -- 
beforeNuxtRender -- 

// client-side

from -- 
nuxtState -- 

// both 

app -- 
store -- 
route -- 
params -- 
query -- 
env -- 
isDev -- 
isHMR -- 
redirect -- 
error -- 

// -----------
// -----------
// nuxt lifecycle
// -----------
// -----------

// https://nuxtjs.org/guides/concepts/nuxt-lifecycle

// -----------
// -----------
// api
// -----------
// -----------

// https://nuxtjs.org/api/configuration-servermiddleware/
// https://github.com/nuxt-community/express-template/tree/master/template/api

// -----------
// nuxt.config.js
// -----------

import serveStatic from 'serve-static'

export default {
  serverMiddleware: [
    // Will register redirect-ssl npm package
    'redirect-ssl',

    // Will register file from project api directory to handle /api/* requires
    { path: '/api', handler: '~/api/index.js' },

    // We can create custom instances too
    { path: '/static2', handler: serveStatic(__dirname + '/static2') }
  ]
}

// -----------
// -----------
//
// -----------
// -----------



// -----------
// -----------
//
// -----------
// -----------



// -----------
// -----------
//
// -----------
// -----------



// -----------
// -----------
//
// -----------
// -----------



// -----------
// -----------
//
// -----------
// -----------



// -----------
// -----------
//
// -----------
// -----------



// -----------
// -----------
//
// -----------
// -----------



// -----------
// -----------
//
// -----------
// -----------



// -----------
// -----------
//
// -----------
// -----------




