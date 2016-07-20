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
import Regions from './pages/Regions.jsx';
import RegionCreate from './pages/RegionCreate.jsx';
import Region from './pages/Region.jsx';
import RegionTabBasic from './pages/RegionTabBasic.jsx';
import RegionTabImages from './pages/RegionTabImages.jsx';
import RegionTabInstanceTypes from './pages/RegionTabInstanceTypes.jsx';
import RegionTabProjects from './pages/RegionTabProjects.jsx';
import ProjectQuotaCreate from './pages/ProjectQuotaCreate.jsx';
import ProjectQuota from './pages/ProjectQuota.jsx';
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
            <Route path="projects" component={RegionTabProjects} />
            <Route path="images" component={RegionTabImages} />
            <Route path="instance_types" component={RegionTabInstanceTypes} />
          </Route>
        </Route>
        <Route path="q/:regionId" >
          <Route path="create" component={ProjectQuotaCreate} />
          <Route path=":projectId" component={ProjectQuota} />
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
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  );
}
