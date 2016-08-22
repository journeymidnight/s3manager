import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Login from '../console-common/pages/Login.jsx';
import Logout from '../console-common/pages/Logout.jsx';
import NotFound from '../shared/pages/NotFound.jsx';
import App from '../console-common/pages/App.jsx';
import Demo from './pages/Demo.jsx';

export default function configureRoutes(store) {
  function requireAuth(nextState, replace) {
    if (!store.getState().global || !store.getState().global.auth) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }

  return (
    <Route>
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/" component={App} onEnter={requireAuth} >
        <IndexRedirect to="demo" />
        <Route path="demo" component={Demo} />
      </Route>
      <Route path="*" component={NotFound} />
    </Route >
  );
}
