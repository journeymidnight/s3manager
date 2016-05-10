import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

export const i18nextOptions = {
  fallbackLng: 'zh',
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
