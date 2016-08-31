import '../console-common/scss/sub.scss';

import Auth from '../console-common/services/auth';
import rootReducer from '../console-common/redux/reducers';
import { hashHistory } from 'react-router';
import configureStore from '../shared/redux/store';
import configureRoutes from './routes';

import bootstrap from '../shared/bootstrap';

bootstrap((token, state, callback) => {
  document.title = state.env.appName;
  window.$('body').toggleClass('ui_charcoal ui_console');

  let store = configureStore(rootReducer, state, hashHistory);
  let routes = configureRoutes(store);

  if (token) {
    Auth.describeToken(token.token)
    .promise
    .then((context) => {
      state.global = context;

<<<<<<< HEAD
      store = configureStore(rootReducer, state);
=======
      store = configureStore(rootReducer, state, hashHistory);
>>>>>>> 9ad097915462551f4b1b9874cc3d223e42565025
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
