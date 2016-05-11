import './scss/sub.scss';

import Auth from './services/auth';
import configureStore from './redux/store';
import configureRoutes from './routes';

import bootstrap from '../shared/bootstrap';

bootstrap((token, state, callback) => {
  document.title = `${state.env.appName} | Boss`;
  window.$('body').toggleClass('ui_charcoal ui_boss');

  let store = configureStore(state);
  let routes = configureRoutes(store);

  if (token) {
    Auth.describeContext(token.token)
    .promise
    .then((context) => {
      state.auth = context.auth;

      store = configureStore(state);
      routes = configureRoutes(store);
      callback(store, routes);
    })
    .catch(() => {
      callback(store, routes);
    });
  } else {
    callback(store, routes);
  }
});
