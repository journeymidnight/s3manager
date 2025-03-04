import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { IndexRedirect } from 'react-router';

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
import AccessKeys from './pages/AccessKeys.jsx';
import AccessKeyCreate from './pages/AccessKeyCreate.jsx';
import Services from './pages/Services.jsx';
import Service from './pages/Service.jsx';
import ServiceCreate from './pages/ServiceCreate.jsx';
import ServiceTabBasic from './pages/ServiceTabBasic.jsx';
import ServiceTabProjects from './pages/ServiceTabProjects.jsx';
import RegionTab from './pages/devops/RegionTab.jsx';
import Regions from './pages/Regions.jsx';
import RegionCreate from './pages/RegionCreate.jsx';
import Region from './pages/Region.jsx';
import RegionTabBasic from './pages/RegionTabBasic.jsx';

import BucketList from './los/pages/BucketList.jsx';
import BucketCreate from './los/pages/BucketCreate.jsx';
import Bucket from './los/pages/Bucket.jsx';
import BucketDetail from './los/pages/BucketDetail.jsx';
import ObjectManagement from './los/pages/ObjectManagement.jsx';


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
        <Route path="buckets">
          <IndexRoute component={BucketList} />
          <Route path="create" component={BucketCreate} />
          <Route path=":bucketName" component={Bucket}>
            <IndexRedirect to="detail" />
            <Route path="detail" component={BucketDetail} />
            <Route path="objects" component={ObjectManagement} />
          </Route>
        </Route>
        <Route path="access_keys">
          <IndexRoute component={AccessKeys} />
          <Route path="create" component={AccessKeyCreate} />
        </Route>
        <Route path="services" >
          <IndexRoute component={Services} />
          <Route path="create" component={ServiceCreate} />
          <Route path=":serviceId" component={Service} >
            <IndexRoute component={ServiceTabBasic} />
            <Route path="basic" component={ServiceTabBasic} />
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
