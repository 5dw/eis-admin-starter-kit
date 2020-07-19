import Vue from 'vue';
import VueI18n from 'vue-i18n';
import config from '../config';

let messages = {
  'en-us': {
    error404: 'Sorry, nothing here...',
    goback: 'Go Back',
  },
  'zh-cn': {
    error404: '抱歉，此页面不存在...',
    goback: '返回',
  },
};

// import translations from modules
const context = require.context('../modules', true, /\/i18n\/[^/]+\/[^/]+\.js$/);
const contextKeys = context.keys();
for (let i = 0; i < contextKeys.length; i += 1) {
  const key = contextKeys[i];

  const pathList = key.split('/');
  const i18nIndex = pathList.lastIndexOf('i18n');

  if (i18nIndex >= 0 || i18nIndex < pathList.length - 2) {
    const lang = pathList[i18nIndex + 1];
    const langDict = context(key).default;

    const langKeys = Object.keys(messages);
    if (langKeys.indexOf(lang) >= 0) {
      messages[lang] = Object.assign({}, messages[lang], langDict);
    } else {
      messages[lang] = langDict;
    }
  }
}

// load messages from the configuration
messages = Object.merge(messages, config.i18n);

Vue.use(VueI18n);

const DEFAULT_LANGUAGE = 'zh-cn';

const i18n = new VueI18n({
  locale: DEFAULT_LANGUAGE,
  fallbackLocale: DEFAULT_LANGUAGE,
  messages,
});

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n;
};

export { i18n };
