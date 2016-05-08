import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import DevTools from './components/DevTools';
import API from './services/api';

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

function renderPage(store, state, routes) {
  const history = syncHistoryWithStore(browserHistory, store);

  render((
    <Provider store={store}>
      <div>
        <Router history={history} routes={routes} />
      </div>
    </Provider>
  ), dest);
  removeLoader();

  if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger

    render(
      <Provider store={store} key="provider">
        <div>
          <Router history={history} routes={routes} />
          <DevTools />
        </div>
      </Provider>,
      dest
    );
  }
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
      <div>
        <h1>服务暂时不可用。</h1>
        <pre>
        Url: {error.config.url}<br />
        Status: {error.status}<br />
        Message: {JSON.stringify(error.data)}
        </pre>
      </div>
    );

    render(errorPage, dest);
    removeLoader();
  });
}
