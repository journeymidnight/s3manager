import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import Login from '../console-common/pages/Login.jsx';
import Logout from '../console-common/pages/Logout.jsx';
import NotFound from '../shared/pages/NotFound.jsx';
import App from '../console-common/pages/App.jsx';
import BucketList from './pages/BucketList.jsx';
import BucketCreate from './pages/BucketCreate.jsx';
import Bucket from './pages/Bucket.jsx';
import BucketDetail from './pages/BucketDetail.jsx';
import ObjectManagement from './pages/ObjectManagement.jsx';

export default function configureRoutes(store) {
  function requireAuth() {
    if (!store.getState().global || !store.getState().global.auth) {
      window.location = '/g/';
    }
  }

  return (
    <Route>
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/" component={App} onEnter={requireAuth}>
        <IndexRedirect to="buckets" />
        <Route path="buckets">
          <IndexRoute component={BucketList} />
          <Route path="create" component={BucketCreate} />
          <Route path=":bucketName" component={Bucket}>
            <IndexRedirect to="detail" />
            <Route path="detail" component={BucketDetail} />
            <Route path="objects" component={ObjectManagement} />
          </Route>
        </Route>
      </Route>
      <Route path="*" component={NotFound} />
    </Route >
  );
}
