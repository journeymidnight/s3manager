import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from './pages/App.jsx';
import Index from './pages/Index.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Tenants from './pages/Tenants.jsx';
import TenantNew from './pages/TenantNew.jsx';
import Tenant from './pages/Tenant.jsx';
import Users from './pages/Users.jsx';
import UserNew from './pages/UserNew.jsx';
import User from './pages/User.jsx';
import Admins from './pages/Admins.jsx';
import AdminNew from './pages/AdminNew.jsx';
import Admin from './pages/Admin.jsx';
import Regions from './pages/Regions.jsx';
import RegionNew from './pages/RegionNew.jsx';
import Region from './pages/Region.jsx';
import TenantQuotaNew from './pages/TenantQuotaNew.jsx';
import TenantQuota from './pages/TenantQuota.jsx';
import Profile from './pages/Profile.jsx';

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
        <IndexRoute component={Index} />
        <Route path="profile" component={Profile} />
        <Route path="admins" >
          <IndexRoute component={Admins} />
          <Route path="new" component={AdminNew} />
          <Route path=":adminId" component={Admin} />
        </Route>
        <Route path="regions" >
          <IndexRoute component={Regions} />
          <Route path="new" component={RegionNew} />
          <Route path=":regionId" >
            <IndexRoute component={Region} />
            <Route path="new" component={TenantQuotaNew} />
            <Route path=":tenantId" component={TenantQuota} />
          </Route>
        </Route>
        <Route path="tenants" >
          <IndexRoute component={Tenants} />
          <Route path="new" component={TenantNew} />
          <Route path=":tenantId" component={Tenant} />
        </Route>
        <Route path="users" >
          <IndexRoute component={Users} />
          <Route path="new" component={UserNew} />
          <Route path=":userId" component={User} />
        </Route>
      </Route>
    </Route>
  );
}
