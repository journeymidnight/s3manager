import './scss/sub.scss';

import Auth from './services/auth';
import configureStore from './redux/store';
import configureRoutes from './routes';

import bootstrap from '../shared/bootstrap';

bootstrap((token, state, callback) => {
  document.title = state.env.appName;

  let store = configureStore(state);
  let routes = configureRoutes(store);

  if (token) {
    Auth.describeContext(token.token)
    .promise
    .then((context) => {
      state.auth = context.auth;
      state.regions = [{
        name: '北京2区',
        regionId: 'pek2',
      }, {
        name: '北京1区',
        regionId: 'pek1',
      }, {
        name: '亚太1区',
        regionId: 'ap1',
      }];

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
