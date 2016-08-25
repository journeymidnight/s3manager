import './scss/sub.scss';

import Auth from './services/auth';
import rootReducer from './redux/reducers';
import { browserHistory } from 'react-router';
import configureStore from '../shared/redux/store';
import configureRoutes from './routes';

import bootstrap from '../shared/bootstrap';

bootstrap((token, state, callback) => {
  document.title = `${state.env.appName} | Boss`;
  window.$('body').toggleClass('ui_charcoal ui_boss');

  let store = configureStore(rootReducer, state);
  let routes = configureRoutes(store);

  if (token) {
    Auth.describeToken(token.token)
    .promise
    .then((context) => {
      state.auth = context.auth;

      store = configureStore(rootReducer, state);
      routes = configureRoutes(store);
      callback(store, routes, browserHistory);
    })
    .catch(() => {
      callback(store, routes, browserHistory);
    });
  } else {
    callback(store, routes, browserHistory);
  }
});
