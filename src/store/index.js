import Vue from 'vue';
import Vuex from 'vuex';

import app from './module-app';

Vue.use(Vuex);

const Store = new Vuex.Store({
  modules: {
    app,
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV,
});

export default Store;
