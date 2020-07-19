import FloatingWindow from '@/components/FloatingWindow/index.vue';
import SelectLocales from '@/components/SelectLocales/index.vue';
import demoBtn from './view/index.vue';
import TestF from './view/testf.vue';

export default {
  config: {
    age: 20,
    backendDependencies: [
      'demo',
    ],
  },
  routers: [{
    path: '',
    name: 'demo',
    component: () => import('./view'),
  }],
  components: {
    FirstDemo: demoBtn,
    FloatingWindow,
    SelectLocales,
  },
  fieldComponents: {
    TestF,
  },
};
