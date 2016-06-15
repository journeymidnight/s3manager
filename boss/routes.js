import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from './pages/App.jsx';
import Index from './pages/Index.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Tenants from './pages/Tenants.jsx';
import TenantCreate from './pages/TenantCreate.jsx';
import Tenant from './pages/Tenant.jsx';
import TenantTabBasic from './pages/TenantTabBasic.jsx';
import TenantTabUsers from './pages/TenantTabUsers.jsx';
import Users from './pages/Users.jsx';
import UserCreate from './pages/UserCreate.jsx';
import User from './pages/User.jsx';
import Admins from './pages/Admins.jsx';
import AdminCreate from './pages/AdminCreate.jsx';
import Admin from './pages/Admin.jsx';
import Regions from './pages/Regions.jsx';
import RegionCreate from './pages/RegionCreate.jsx';
import Region from './pages/Region.jsx';
import RegionTabBasic from './pages/RegionTabBasic.jsx';
import RegionTabImages from './pages/RegionTabImages.jsx';
import RegionTabInstanceTypes from './pages/RegionTabInstanceTypes.jsx';
import RegionTabTenants from './pages/RegionTabTenants.jsx';
import TenantQuotaCreate from './pages/TenantQuotaCreate.jsx';
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
          <Route path="create" component={AdminCreate} />
          <Route path=":adminId" component={Admin} />
        </Route>
        <Route path="regions" >
          <IndexRoute component={Regions} />
          <Route path="create" component={RegionCreate} />
          <Route path=":regionId" component={Region} >
            <IndexRoute component={RegionTabBasic} />
            <Route path="basic" component={RegionTabBasic} />
            <Route path="tenants" component={RegionTabTenants} />
            <Route path="images" component={RegionTabImages} />
            <Route path="instance_types" component={RegionTabInstanceTypes} />
          </Route>
        </Route>
        <Route path="q/:regionId" >
          <Route path="create" component={TenantQuotaCreate} />
          <Route path=":tenantId" component={TenantQuota} />
        </Route>
        <Route path="tenants" >
          <IndexRoute component={Tenants} />
          <Route path="create" component={TenantCreate} />
          <Route path=":tenantId" component={Tenant} >
            <IndexRoute component={TenantTabBasic} />
            <Route path="basic" component={TenantTabBasic} />
            <Route path="users" component={TenantTabUsers} />
          </Route>
        </Route>
        <Route path="users" >
          <IndexRoute component={Users} />
          <Route path="create" component={UserCreate} />
          <Route path=":userId" component={User} />
        </Route>
      </Route>
    </Route>
  );
}
