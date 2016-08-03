import React from 'react';
import { IndexRoute, Route } from 'react-router';

import NotFound from '../shared/pages/NotFound.jsx';
import App from './pages/App.jsx';
import Index from './pages/Index.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Projects from './pages/Projects.jsx';
import ProjectCreate from './pages/ProjectCreate.jsx';
import Project from './pages/Project.jsx';
import ProjectTabBasic from './pages/ProjectTabBasic.jsx';
import ProjectTabUsers from './pages/ProjectTabUsers.jsx';
import Users from './pages/Users.jsx';
import UserCreate from './pages/UserCreate.jsx';
import User from './pages/User.jsx';
import Admins from './pages/Admins.jsx';
import AdminCreate from './pages/AdminCreate.jsx';
import Admin from './pages/Admin.jsx';
import Services from './pages/Services.jsx';
import Service from './pages/Service.jsx';
import ServiceCreate from './pages/ServiceCreate.jsx';
import ServiceTabBasic from './pages/ServiceTabBasic.jsx';
import ServiceTabProjects from './pages/ServiceTabProjects.jsx';
import LOS from './pages/los/LOS.jsx';
import LCS from './pages/lcs/LCS.jsx';
import LCSTabImages from './pages/lcs/LCSTabImages.jsx';
import LCSTabInstanceTypes from './pages/lcs/LCSTabInstanceTypes.jsx';
import RegionTab from './pages/devops/RegionTab.jsx';
import DevOpsNodes from './pages/devops/DevOpsNodes.jsx';
import DevOpsAlerts from './pages/devops/DevOpsAlerts.jsx';
import Tickets from './pages/Tickets.jsx';
import Ticket from './pages/Ticket.jsx';
import DevOpsInstances from './pages/devops/DevOpsInstances.jsx';
import DevOpsEips from './pages/devops/DevOpsEips.jsx';
import DevOpsCeph from './pages/devops/DevOpsCeph.jsx';
import DevOpsOpenStack from './pages/devops/DevOpsOpenStack.jsx';
import Regions from './pages/Regions.jsx';
import RegionCreate from './pages/RegionCreate.jsx';
import Region from './pages/Region.jsx';
import RegionTabBasic from './pages/RegionTabBasic.jsx';
import QuotaCreate from './pages/QuotaCreate.jsx';
import Quota from './pages/Quota.jsx';
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
        <Route path="services" >
          <IndexRoute component={Services} />
          <Route path="create" component={ServiceCreate} />
          <Route path=":serviceId" component={Service} >
            <IndexRoute component={ServiceTabBasic} />
            <Route path="basic" component={ServiceTabBasic} />
            <Route path="projects" component={ServiceTabProjects} />
          </Route>
        </Route>
        <Route path="los" >
          <Route path=":serviceId" component={LOS} />
        </Route>
        <Route path="lcs" >
          <Route path=":serviceId" component={LCS} >
            <IndexRoute component={LCSTabImages} />
            <Route path="images" component={LCSTabImages} />
            <Route path="instance_types" component={LCSTabInstanceTypes} />
          </Route>
        </Route>
        <Route path="regions" >
          <IndexRoute component={Regions} />
          <Route path="create" component={RegionCreate} />
          <Route path=":regionId" component={Region} >
            <IndexRoute component={RegionTabBasic} />
            <Route path="basic" component={RegionTabBasic} />
          </Route>
        </Route>
        <Route path="q/:serviceId" >
          <Route path="create" component={QuotaCreate} />
          <Route path=":projectId" component={Quota} />
        </Route>
        <Route path="projects" >
          <IndexRoute component={Projects} />
          <Route path="create" component={ProjectCreate} />
          <Route path=":projectId" component={Project} >
            <IndexRoute component={ProjectTabBasic} />
            <Route path="basic" component={ProjectTabBasic} />
            <Route path="users" component={ProjectTabUsers} />
          </Route>
        </Route>
        <Route path="users" >
          <IndexRoute component={Users} />
          <Route path="create" component={UserCreate} />
          <Route path=":userId" component={User} />
        </Route>
        <Route path="tickets" >
          <IndexRoute component={Tickets} />
          <Route path=":ticketId" component={Ticket} />
        </Route>
        <Route path="devops" >
          <Route path="nodes" component={RegionTab}>
            <Route path=":regionId" component={DevOpsNodes} />
          </Route>
          <Route path="ceph" component={RegionTab}>
            <Route path=":regionId" component={DevOpsCeph} />
          </Route>
          <Route path="openstack" component={RegionTab}>
            <Route path=":regionId" component={DevOpsOpenStack} />
          </Route>
          <Route path="instances" component={RegionTab} >
            <Route path=":regionId" component={DevOpsInstances} />
          </Route>
          <Route path="eips" component={RegionTab} >
            <Route path=":regionId" component={DevOpsEips} />
          </Route>
          <Route path="alerts" component={DevOpsAlerts} />
        </Route>
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  );
}
