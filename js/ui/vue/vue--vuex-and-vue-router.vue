// -----------
// vuex and vue-router (vue 3)
// -----------

// npm i --save vuex vue-router


// -----------
// store and router
// -----------

// *** do async inside actions, not mutations ***

// stores/index.js

import { createStore } from 'vuex'
import countStore from './count';

export default createStore({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    countStore
  }
});

// stores/count.js

const countStore = {
  namespaced: true,
  state: {
    count: 1,
  },
  getters: {
    doubledCount: state => state.count * 2,
    quadrupledCount: (state, getters) => getters.doubledCount * 2,
  },
  mutations: {
    setCount: (state, newCount) => state.count = newCount,
  },
  actions: {
    setCount: function ({ commit }, newCount) {
      commit('setCount', newCount)
    },
  }
};

export default countStore;

// App.vue

<template>
  <p><router-link to="/">Index</router-link></p>
  <router-view />
</template>

<script>
  export default {
    name: 'App'
  };
</script>

// components/index.js

<template>
  <div>
    <h1>Landing</h1>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubledCount }}</p>
    <p>Quadrupled: {{ quadrupledCount }}</p>
    <p>
      <button @click="incrementCount">+</button>
      <button @click="decrementCount">-</button>
    </p>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState({ 
        count: (state) => state.countStore.count 
      }),
      ...mapGetters({ 
        doubledCount: 'countStore/doubledCount', 
        quadrupledCount: 'countStore/quadrupledCount' 
      }),
    },
    methods: {
      ...mapActions({
        setCount: 'countStore/setCount' 
      }),
      // local methods
      incrementCount: function() {
        this.setCount(this.count + 1)
      },
      decrementCount: function() {
        this.setCount(this.count - 1)
      },
    }
  }
</script>


// -----------
//
// -----------




// -----------
//
// -----------




// -----------
//
// -----------



