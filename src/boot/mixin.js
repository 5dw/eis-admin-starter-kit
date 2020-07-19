import Vue from 'vue';

const globalMixin = {
  methods: {
    getModule(name) {
      return this.ctx && this.ctx.modules && this.ctx.modules[name];
    },
  },
};

Vue.mixin(globalMixin);
