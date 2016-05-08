import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from './pages/App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Tenants from './pages/Tenants.jsx';
import TenantNew from './pages/TenantNew.jsx';
import Tenant from './pages/Tenant.jsx';
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
        <Route path="settings" component={Settings} />
        <Route path="admins" component={Settings} />
        <Route path="regions" component={Settings} />
        <Route path="tenants" >
          <IndexRoute component={Tenants} />
          <Route path="new" component={TenantNew} />
          <Route path=":tenantId" component={Tenant} />
        </Route>
        <Route path="users" component={Settings} />
      </Route>
    </Route>
  );
}
