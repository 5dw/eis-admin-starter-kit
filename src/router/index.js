import Vue from 'vue';
import VueRouter from 'vue-router';
import core from 'eis-admin-core';
import config from '../config';

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

export default async (ctx) => {
  const { routes } = core.eisInit({ ...ctx, config });

  routes.push({
    path: '*',
    name: 'page404',
    component: () => import('../modules/Error404.vue') || import('../Error404.vue'),
  });

  const Router = new VueRouter({
    scrollBehavior: async (to, from, savedPosition) => new Promise((resolve) => {
      if (savedPosition) {
        return setTimeout(() => resolve(savedPosition), 500);
      }
      return { x: 0, y: 0 };
    }),
    routes,

    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  Router.afterEach(() => {
    if (config.toTopEveryPage) {
      window.scrollTo(0, 0);
    }
  });

  return Router;
};
