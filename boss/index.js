import '../shared/scss/main.scss';
import './scss/sub.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import DevTools from '../shared/components/DevTools';
import API from '../shared/services/api';
import { configureStore } from './redux/store';
import Auth from './services/auth';
import configureRoutes from './routes';

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

function renderPage(state) {
  const store = configureStore(state);
  const history = syncHistoryWithStore(browserHistory, store);
  const routes = configureRoutes(store);

  render((
    <Provider store={store}>
      <div>
        <Router history={history} routes={routes} />
      </div>
    </Provider>
  ), dest);

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

API.fetchEnv()
.promise
.then((env) => {
  const state = {
    env,
  };

  const store = require('store');
  const token = store.get('token');
  if (token) {
    Auth.describeContext(token.token)
    .promise
    .then((context) => {
      state.auth = context.auth;

      renderPage(state);
      removeLoader();
    })
    .catch(() => {
      store.remove('token');
      renderPage(state);
      removeLoader();
    });
  } else {
    renderPage(state);
    removeLoader();
  }
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
