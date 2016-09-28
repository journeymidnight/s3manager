import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import App from '../console-common/pages/App.jsx';
import NotFound from '../shared/pages/NotFound.jsx';
import Test from './pages/Test.jsx';

export default function configureRoutes(store) {
  function requireAuth() {
    if (!store.getState().global || !store.getState().global.auth) {
      window.location = '/g/';
    }
  }

  return (
    <Route>
      <Route path="/" component={App} onEnter={requireAuth} >
        <IndexRedirect to="test" />
        <Route path="test" component={Test} />
      </Route>
      <Route path="*" component={NotFound} />
    </Route >
  );
}
