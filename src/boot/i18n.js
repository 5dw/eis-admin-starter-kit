import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Quasar } from 'quasar';
import store from '../store';

const messages = {
  'en-us': {
    error404: 'Sorry, nothing here...',
    goback: 'Go Back',
    LOGIN: 'Login',
    LOGOUT: 'Logout',
    REGISTER: 'Register',
    SETTINGS: 'Settings',
  },
  'zh-cn': {
    error404: '抱歉，此页面不存在...',
    goback: '返回',
    LOGIN: '登录',
    LOGOUT: '退出登录',
    REGISTER: '注册',
    SETTINGS: '设置',
  },
};

Vue.use(VueI18n);

const DEFAULT_LANGUAGE = store.getters['app/getLocale'] || Quasar.lang.getLocale().toLowerCase() || 'zh-cn';

const i18n = new VueI18n({
  locale: DEFAULT_LANGUAGE,
  fallbackLocale: DEFAULT_LANGUAGE,
});

// eslint-disable-next-line no-underscore-dangle
Vue.prototype._i18n = i18n;

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n;

  if (app.store && app.store.i18nMessages) {
    Object.keys(app.store.i18nMessages).forEach((ik) => {
      i18n.setLocaleMessage(ik, { ...app.store.i18nMessages[ik], ...(messages[ik] || {}) });
    });
  }
};

export { i18n };
