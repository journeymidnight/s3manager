import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import App from '../console-common/pages/App.jsx';
import NotFound from '../shared/pages/NotFound.jsx';
import LoadBalancers from './pages/LoadBalancers.jsx';
import LoadBalancerCreate from './pages/LoadBalancerCreate.jsx';

export default function configureRoutes(store) {
  function requireAuth() {
    if (!store.getState().global || !store.getState().global.auth) {
      window.location = '/g/';
    }
  }

  return (
    <Route>
      <Route path="/" component={App} onEnter={requireAuth} >
        <IndexRedirect to="load_balancers" />
        <Route path="load_balancers">
          <IndexRoute component={LoadBalancers} />
          <Route path="create" component={LoadBalancerCreate} />
        </Route>
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  );
}
