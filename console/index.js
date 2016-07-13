import './scss/sub.scss';

import Auth from './services/auth';
import rootReducer from './redux/reducers';
import configureStore from '../shared/redux/store';
import configureRoutes from './routes';

import bootstrap from '../shared/bootstrap';

bootstrap((token, state, callback) => {
  document.title = state.env.appName;
  window.$('body').toggleClass('ui_charcoal ui_console');

  let store = configureStore(rootReducer, state);
  let routes = configureRoutes(store);

  if (token) {
    Auth.describeContext(token.token)
    .promise
    .then((context) => {
      state.global = context;

      store = configureStore(rootReducer, state);
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
