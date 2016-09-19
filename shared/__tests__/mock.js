import { jsdom } from 'jsdom';
import nock from 'nock';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import i18nextBackend from 'i18next-sync-fs-backend';
import i18n, { i18nextOptions } from '../i18n';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;

window.$ = window.jQuery = require('jquery');

const cookie = require('js-cookie');
cookie.json = true;

expect.extend(expectJSX);

nock.disableNetConnect();

const middlewares = [
  thunkMiddleware,
];
export function mockStore(reducer) {
  const store = configureMockStore(middlewares)(reducer);
  return store;
}

export const mockRequest = nock('http://localhost:80');

i18nextOptions.backend.loadPath = `${__dirname}/../../asset/locales/{{lng}}/{{ns}}.json`;

i18n
.use(i18nextBackend)
.init(i18nextOptions);
