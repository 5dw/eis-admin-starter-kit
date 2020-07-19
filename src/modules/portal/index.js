export default {
  config: {
    dependencies: [
      'demo',
    ],
  },
  routers: [
    {
      path: '/',
      component: () => import('./view/index.vue'),
      children: [
        {
          ref: 'demo>demo',
          path: 'demo',
        },
      ],
    },
  ],
};
