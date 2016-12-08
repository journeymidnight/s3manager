import './scss/sub.scss';

import Auth from './services/auth';
import rootReducer from './redux/reducers';
import { hashHistory } from 'react-router';
import configureStore from '../shared/redux/store';
import configureRoutes from './routes';

import bootstrap from '../shared/bootstrap';

bootstrap((token, state, callback) => {
  document.title = `${state.env.appName} | Boss`;
  window.$('body').toggleClass('ui_charcoal ui_boss');

  let store = configureStore(rootReducer, state, hashHistory);
  let routes = configureRoutes(store);

  if (token) {
    Auth.describeToken(token.token)
    .promise
    .then((context) => {
      state.auth = context.auth;

      store = configureStore(rootReducer, state, hashHistory);
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
