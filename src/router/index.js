import Vue from 'vue';
import VueRouter from 'vue-router';
import core from 'eis-admin-core';
import config from '../config';

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default async function (ctx) {
  const { routes } = core.eisInit({ ...ctx, config });

  // Always leave this as last one
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      name: 'page404',
      component: () => import('../modules/Error404.vue') || import('../Error404.vue'),
    });
  }

  const Router = new VueRouter({
    scrollBehavior: async (to, from, savedPosition) => new Promise((resolve) => {
      if (savedPosition) {
        return setTimeout(() => resolve(savedPosition), 500);
      }
      return { x: 0, y: 0 };
    }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  return Router;
}
