import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

i18n
.use(XHR)
.init({
  fallbackLng: 'zh',
  ns: ['common'],
  defaultNS: 'common',
  debug: true,
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  backend: {
    loadPath: 'asset/locales/{{lng}}/{{ns}}.json',
  },
});

export default i18n;
