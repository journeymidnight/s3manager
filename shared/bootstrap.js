import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import DevTools from './components/DevTools';
import API from './services/api';
import i18n from './i18n';

const dest = document.getElementById('root');

window.$ = window.jQuery = require('jquery');
window._ = require('lodash');
require('bootstrap');

window.paceOptions = {
  ajax: true,
  document: true,
  eventLag: true,
  elements: true,
  restartOnRequestAfter: false,
};
require('../shared/venders/pace');
require('../shared/venders/jquery.nicescroll');

function removeLoader() {
  let i = 0;
  function handleLoader() {
    if (i < 2) {
      setTimeout(() => {
        document.querySelector('.sp-container').classList.add(`sp-${i}`);
        i++;
        handleLoader();
      }, 500);
    }
  }
  handleLoader();
}

function renderPage(store, routes) {
  const history = syncHistoryWithStore(browserHistory, store);

  if (process.env.NODE_ENV !== 'production') {
    render(
      <Provider store={store} key="provider">
        <div>
          <I18nextProvider i18n={i18n}>
            <Router history={history} routes={routes} />
          </I18nextProvider>
          <DevTools />
        </div>
      </Provider>,
      dest
    );
  } else {
    render((
      <Provider store={store}>
        <div>
          <I18nextProvider i18n={i18n}>
            <Router history={history} routes={routes} />
          </I18nextProvider>
        </div>
      </Provider>
    ), dest);
  }

  removeLoader();
}

export default function bootstrap(callback) {
  API.fetchEnv()
  .promise
  .then((env) => {
    const state = {
      env,
    };

    const store = require('store');
    const token = store.get('token');

    callback(token, state, renderPage);
  })
  .catch((error) => {
    const errorPage = (
      <div className="container">
        <h3>服务暂时不可用。</h3>
        <pre>
          RetCode: {JSON.stringify(error.retCode)}
          <br />
          Message: {JSON.stringify(error.message)}
        </pre>
      </div>
    );

    render(errorPage, dest);
    removeLoader();
  });
}
