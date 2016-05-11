import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from './pages/App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Settings from './pages/Settings.jsx';

export default function configureRoutes(store) {
  function requireAuth(nextState, replace) {
    if (!store.getState().auth) {
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
        <IndexRoute component={Home} />
        <Route path=":regionId" component={App} >
          <Route path="instances" component={Settings} />
          <Route path="volumes" component={Settings} />
          <Route path="vxnets" component={Settings} />
          <Route path="eips" component={Settings} />
          <Route path="key_pairs" component={Settings} />
          <Route path="firewalls" component={Settings} />
        </Route>
        <Route path="activities" component={Settings} />
        <Route path="access_keys" component={Settings} />
        <Route path="usage" component={Settings} />
        <Route path="settings" component={Settings} />
        <Route path="profile" component={Settings} />
      </Route>
    </Route>
  );
}
