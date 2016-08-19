import './scss/sub.scss';

import Auth from '../console-common/services/auth';
import rootReducer from '../console-common/redux/reducers';
import { hashHistory } from 'react-router';
import configureStore from '../shared/redux/store';
import configureRoutes from './routes';

import bootstrap from '../shared/bootstrap';

bootstrap((token, state, callback) => {
  document.title = state.env.appName;
  window.$('body').toggleClass('ui_charcoal ui_console');

  let store = configureStore(rootReducer, state);
  let routes = configureRoutes(store);

  if (token) {
    Auth.describeToken(token.token)
    .promise
    .then((context) => {
      state.global = context;

      store = configureStore(rootReducer, state);
      routes = configureRoutes(store);
      callback(store, routes, hashHistory);
    })
    .catch(() => {
      callback(store, routes, hashHistory);
    });
  } else {
    callback(store, routes, hashHistory);
  }
});
