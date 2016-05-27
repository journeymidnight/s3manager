import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './pages/App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import KeyPair from './pages/KeyPair.jsx';
import KeyPairs from './pages/KeyPairs.jsx';
import KeyPairCreate from './pages/KeyPairCreate.jsx';
import Network from './pages/Network.jsx';
import Networks from './pages/Networks.jsx';
import NetworkCreate from './pages/NetworkCreate.jsx';
import Instance from './pages/Instance.jsx';
import Instances from './pages/Instances.jsx';
import InstanceCreate from './pages/InstanceCreate.jsx';
import RegionIndex from './pages/RegionIndex.jsx';
import Snapshots from './pages/Snapshots.jsx';
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
        <Route path="activities" component={Settings} />
        <Route path="access_keys" component={Settings} />
        <Route path="usage" component={Settings} />
        <Route path="settings" component={Settings} />
        <Route path="profile" component={Settings} />
        <Route path=":regionId" >
          <IndexRoute component={RegionIndex} />
          <Route path="volumes" component={Settings} />
          <Route path="snapshots" >
            <IndexRoute component={Snapshots} />
          </Route>
          <Route path="eips" component={Settings} />
          <Route path="instances" >
            <IndexRoute component={Instances} />
            <Route path="create" component={InstanceCreate} />
            <Route path=":instanceId" component={Instance} />
          </Route>
          <Route path="key_pairs" >
            <IndexRoute component={KeyPairs} />
            <Route path="create" component={KeyPairCreate} />
            <Route path=":keyPairId" component={KeyPair} />
          </Route>
          <Route path="networks" >
            <IndexRoute component={Networks} />
            <Route path="create" component={NetworkCreate} />
            <Route path=":networkId" component={Network} />
          </Route>
          <Route path="firewalls" component={Settings} />
        </Route>
      </Route>
    </Route>
  );
}
