import i18n from 'i18next';
import store from 'store';
import XHR from 'i18next-xhr-backend';

// check json
import '../asset/locales/zh/common.json';
import '../asset/locales/en/common.json';

const lng = store.get('lng') || 'zh';

export const i18nextOptions = {
  fallbackLng: lng,
  ns: ['common'],
  defaultNS: 'common',
  debug: true,
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  backend: {
    loadPath: '/asset/locales/{{lng}}/{{ns}}.json',
  },
};

i18n
.use(XHR)
.init(i18nextOptions);

export default i18n;
