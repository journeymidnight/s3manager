import i18n from 'i18next';
import store from 'store';
import zh from '../asset/locales/zh/common.json';
import en from '../asset/locales/en/common.json';

const lng = store.get('lng') || 'zh';

export const i18nextOptions = {
  fallbackLng: lng,
  ns: ['common'],
  defaultNS: 'common',
  debug: true,
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  resources: {
    en: { common: en },
    zh: { common: zh },
  },
};

i18n
.init(i18nextOptions);

export default i18n;
