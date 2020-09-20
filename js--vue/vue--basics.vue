<!-- --------------- -->
<!-- vue (v3) -->
<!-- --------------- -->

<!-- setup and use -->

<!-- install cli -->
npm i -g @vue/cli @vue/cli-service-global

<!-- create app -->
vue create my-app

<!-- npm commands -->
npm run serve
npm run build
npm run lint

<!-- additional packages -->
npm i --save vue-router
npm i --save vuex
npm i --save @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props

<!-- --------------- -->
<!-- about -->
<!-- --------------- -->

<!-- src/main.js -- mounts component to public/index.html -->

// imports
import { createApp } from 'vue'
import App from './App.vue'
// mount
createApp(App).mount('#app')

<!-- src/App.vue -->

A component has the following structure:

* template -- where html (and custom components) go
* style -- css
* script -- js logic
  * components are imported (dependencies for current component)
  * component is exported (for use in other components)
  * components are defined (properties -- name (s), components (obj), props (obj))
    * name -- name of component
    * components -- components used (dependencies)
    * props -- props from parent
    * data -- state
    * computed -- values dependent on state
    * watch -- functions to run when specific state changes
    * methods -- functions to use for event handlers (and more)
    * [...lifecycle] -- functions that get executed at specified lifecycle events
    * inject/provide -- provide context and inject context into a component.

<!-- --------------- -->
<!--  declarative rendering  -->
<!-- --------------- -->

<!-- state is in 'data' method -->

<template>
  <div id="counter">
    Count: {{ count }}
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        count: 1
      }
    }
  }
</script>

<!-- --------------- -->
<!--  mount  -->
<!-- --------------- -->

<template>
  <div id="counter">
    Count: {{ count }}
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        count: 1
      }
    },
    mounted: function() {
      setInterval(() => {
        this.count++
      }, 1000)
    }
  }
</script>


<!-- --------------- -->
<!--  bind title (tooltip)  -->
<!-- --------------- -->


<template>
  <div>
    <span v-bind:title="message">
      Hover to see dynamically bound title
    </span>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        message: `You loaded this page on ${ new Date().toLocaleString() }`
      }
    }
  }
</script>


<!-- --------------- -->
<!-- on click (event)  -->
<!-- --------------- -->

<template>
  <div>
    <p>{{ count }}</p>
    <button v-on:click="incrementCount">+</button>
    <button v-on:click="decrementCount">-</button>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        count: 0
      }
    },
    methods: {
      incrementCount: function() {
        this.count++
      },
      decrementCount: function() {
        this.count--
      }
    }
  }
</script>


<!-- --------------- -->
<!--  two way binding (form input)  -->
<!-- --------------- -->

<template>
  <div>
    <p>{{ message }}</p>
    <input v-model="message"/>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        message: ""
      }
    }
  }
</script>

<!-- --------------- -->
<!-- if  -->
<!-- --------------- -->

<template>
  <div>
    <p v-if="loggedIn">Hello!</p>
    <p v-else>Please log in!</p>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        loggedIn: true,
      }
    }
  }
</script>

<!-- --------------- -->
<!-- for loop  -->
<!-- --------------- -->

<template>
  <div>
    <p v-for="name in names">
      {{ name }}
    </p>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        names: ['Kakashi', 'Yamato', 'Hiruzen', 'Itachi']
      }
    }
  }
</script>


<!-- --------------- -->
<!--  loop with child component  -->
<!-- --------------- -->

<!-- App.vue -->

<template>
  <div v-for="person in people">
    <Person v-bind:person="person" />
  </div>
</template>

<script>
  import Person from './components/Person.vue';

  export default {
    data: function() {
      return {
        people: [
          { id: 0, name: 'Kakashi'},
          { id: 1, name: 'Yamato'},
          { id: 2, name: 'Hiruzen'},
          { id: 3, name: 'Itachi'}
        ]
      }
    },
    components: {
      Person
    }
  }
</script>

<!-- App.vue -->

<template>
  <div>
    <!-- static prop -->
    <BlogPost title="Hello!" />
    <!-- dynamic prop -->
    <BlogPost :title="title" />
  </div>
</template>

<script>
  import BlogPost from './components/BlogPost';

  export default {
    name: 'App',
    data: function() {
      return {
        title: "Hello!"
      }
    },
    components: { BlogPost }
  }
</script>

<!-- components/BlogPost.vue -->

<template>
  <div>
    <p>
      {{ title }}
    </p>
  </div>
</template>

<script>
  export default {
    name: 'Person',
    props: {
      title: String
    },
  }
</script>



<!-- --------------- -->
<!--  lifecycle  -->
<!-- --------------- -->

beforeCreate
created 
beforeMount
mounted
beforeUpdate
updated
beforeDestroy
destroyed

<!-- --------------- -->
<!--  directives  -->
<!-- --------------- -->

<!-- v-if -- conditionally render  -->
<p v-if="notLoggedIn">Please log in</p>
<p v-else-if="notVerified">Please check email and verify account</p>
<p v-else>Hello!</p>

<!-- v-for -- map an array into elements (normal, index, key, range) -->
<div v-for="item of items"><p>{{ item.name }}</p></div>
<div v-for="(item, index) of items"><p>{{ item.name }}</p></div>
<div v-for="item of items" :key="item.id"><p>{{ item.name }}</p></div>
<div v-for="n of 10"><p>{{ n }}</p></div>

<!-- v-once -- only interpolate once -->
<p v-once>Permanent message: {{ msg }}</p>

<!-- v-html -- interpret as html -->
<p v-html="rawHtml"></p>

<!-- v-bind -- vars & attrs (id, disabled, href, dynamic, shorthand) -->
<div v-bind:id="dynamicId"></div>
<button v-bind:disabled="isButtonDisabled">Button</button>
<a v-bind:href="url"> ... </a>
<a v-bind:[attributeName]="url"> ... </a>
<a :href="url"> ... </a>

<!-- v-on -- handle event (regular, dynamic, mod (e), mod (key), shorthand) -->
<!-- event modifiers -- stop, prevent, capture, capture, self, once, passive -->
<!-- key modifiers -- enter, tab, delete, esc, up, down, left, right -->
<a v-on:click="handleClick"> ... </a>
<a v-on:[eventName]="handleEvent"> ... </a>
<form v-on:submit.prevent="handleSubmit"> ... </form>
<input @keyup.enter="handleSubmit" />
<a @click="doSomething"> ... </a>

<!-- v-model -- bind data to inputs -->
<!-- https://v3.vuejs.org/guide/forms.html#checkbox -->
<input type="text" v-model="firstName" placeholder="First name">

<!-- v-slot -- fill component slots (definition) -->
<div class="container">
  <slot></slot>
</div>

<!-- v-slot -- fill component slots (usage) -->
<custom-component v-slot="slotProps">
  <p>{{ slotProps.message }}</p>
</custom-component>


<!-- classes (class, classes obj, classes arr) -->
<div :class="{ active: isActive }"></div>
<div :class="classesObject"></div>
<div :class="[activeClass, errorClass]"></div>

<!-- styles (styles, styles obj) -->
<div :style="{ color: activeColor, fontSize: `${fontSize}px` }"></div>
<div :style="styles"></div>


<!-- --------------- -->
<!-- computed  -->
<!-- --------------- -->

<!-- https://v3.vuejs.org/guide/computed.html#computed-properties -->

<template>
  <div>
    <p v-if="visible">Hello!</p>
    <button v-on:click="toggleVisible">
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        visible: true,
      }
    },
    methods: {
      toggleVisible: function() {
        this.visible = !this.visible
      }
    },
    computed: {
      buttonText: function() {
        return this.visible ? 'hide' : 'show'
      }
    }
  }
</script>


<!-- --------------- -->
<!--  watch  -->
<!-- --------------- -->

<template>
  <div>
    <p>{{ count }}</p>
    <button v-on:click="incrementCount">+</button>
    <button v-on:click="decrementCount">-</button>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        count: 0
      }
    },
    methods: {
      incrementCount: function() {
        this.count++
      },
      decrementCount: function() {
        this.count--
      }
    },
    watch: {
      count: function(newCount, oldCount) {
        console.log('Execute this logic when "count" changes')
        console.log(`Count: ${this.count}`)
      }
    }
  }
</script>


<!-- --------------- -->
<!--  custom events ($emit)  -->
<!-- --------------- -->

<!-- https://v3.vuejs.org/guide/component-custom-events.html#defining-custom-events -->

<!-- --------------- -->
<!--  slots  -->
<!-- --------------- -->

<!--  https://v3.vuejs.org/guide/component-slots.html#destructuring-slot-props  -->

<!--  slots  -->
<div class="container">
  <slot></slot>
</div>

<!--  slots (with default value) -->
<div class="container">
  <slot>
    <p>Hello!</p>
  </slot>
</div>

<!--  slots (named slots) (definition) -->
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot name="main"></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>

<!--  slots (named slots) (usage) -->
<custom-layout-component>
  <template v-slot:header>
    <h1>Title</h1>
  </template>
  <template v-slot:main>
    <p>Content</p>
  </template>
  <template v-slot:footer>
    <p>Footer</p>
  </template>
</custom-layout-component>

<!-- v-slot -- shorthand (definition) -->
<div class="container">
  <slot></slot>
</div>

<!-- v-slot -- shorthand (usage) -->
<custom-component v-slot="slotProps">
  <p>{{ slotProps.message }}</p>
</custom-component>

<!-- v-slot -- shorthand (usage) (destructuring) -->
<custom-component v-slot="{ message }">
  <p>{{ message }}</p>
</custom-component>

<!-- v-slot -- shorthand (usage) (destructuring) (default) -->
<custom-component v-slot="{ message = 'Hello' }">
  <p>{{ message }}</p>
</custom-component>


<!-- --------------- -->
<!--  provide / inject (like react context)  -->
<!-- --------------- -->

<!-- App.vue -->

<template>
  <div>
    <User />
  </div>
</template>

<script>
  import User from './components/User.vue';
  // import { computed } from 'vue';

  export default {
    data: function() {
      return {
        user: { 
          id: 0, 
          firstName: 'Kakashi',
          lastName: 'Hatake',
        }
      }
    },
    provide: function() {
      return {
        user: this.user
        // user: computed(() => this.user)
      }
    },
    components: {
      User
    }
  }
</script>

<!-- components/User.vue -->

<template>
  <div>
    <p>Name: {{ user.firstName }} {{ user.lastName }}</p>
  </div>
</template>

<script>
  export default {
    inject: ['user'],
    mounted: function() {
      console.log('user', this.user)
    }
  }
</script>


<!-- --------------- -->
<!--  dynamic (keep-alive) and async components -->
<!-- --------------- -->

<!-- https://v3.vuejs.org/guide/component-dynamic-async.html#dynamic-components-with-keep-alive -->

<!-- --------------- -->
<!--  refs  -->
<!-- --------------- -->

<!--  https://v3.vuejs.org/guide/component-template-refs.html  -->

<!-- --------------- -->
<!--  custom directives  -->
<!-- --------------- -->

<!--  https://v3.vuejs.org/guide/custom-directive.html#intro  -->

<!-- --------------- -->
<!--  using jsx  -->
<!-- --------------- -->

https://v3.vuejs.org/guide/render-function.html#jsx
https://github.com/vuejs/jsx#installation


<!-- --------------- -->
<!--  global state (no vuex) (observable) -->
<!-- --------------- -->

<!--  https://michaelnthiessen.com/state-management-without-vuex/  -->
<!--  https://austincooper.dev/2019/08/09/vue-observable-state-store/  -->
<!--  https://medium.com/better-programming/how-to-manage-vues-state-with-vue-observable-25988a88938b  -->

<!--  stores/auth.js  -->

import Vue from "vue";

const store = Vue.observable({
  user: null
});

export const getUser = () => store.user;
export const setUser = (newUser) => (store.user = newUser);

<!-- App.vue  -->

<template>
  <div>
    <p v-if="user">Name: {{ user.name }}</p>
  </div>
</template>

<script>
import { getUser, setUser } from "./stores/auth";

export default {
  name: "User",
  data: function() {
    return {};
  },
  computed: {
    user: getUser
  },
  mounted: async function() {
    const user = await this.fetchUser();
    setUser(user);
  },
  methods: {
    fetchUser: async function() {
      const user = { id: 1, name: "Kakashi" }; // pretend fetch
      return user;
    }
  }
};
</script>


<!-- --------------- -->
<!-- reactive / setup  -->
<!-- --------------- -->

<!-- https://dev.to/blacksonic/you-might-not-need-vuex-with-vue-3-52e4  -->

<!-- stores/count  -->

import { reactive } from 'vue';
export const countStore = reactive({ count: 0 });

<!-- App.vue  -->

<template>
  <div>{{ countStore.count }}</div>
  <button type="button" @click="incrementCount">+</button>
  <button type="button" @click="decrementCount">-</button>
</template>

<script>
  import { countStore } from './stores/count';

  export default {
    setup() {
      return { countStore };
    },
    methods: {
      incrementCount: function() {
        countStore.count++
      },
      decrementCount: function() {
        countStore.count--
      }
    }
  };
</script>

<!-- --------------- -->
<!--    -->
<!-- --------------- -->




<!-- --------------- -->
<!--    -->
<!-- --------------- -->




<!-- --------------- -->
<!--    -->
<!-- --------------- -->




