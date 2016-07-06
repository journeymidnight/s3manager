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
import NetworkTabRouter from './pages/NetworkTabRouter.jsx';
import NetworkTabSubnets from './pages/NetworkTabSubnets.jsx';
import Networks from './pages/Networks.jsx';
import NetworkCreate from './pages/NetworkCreate.jsx';
import VNC from './pages/VNC.jsx';
import Instance from './pages/Instance.jsx';
import InstanceTabMonitor from './pages/InstanceTabMonitor.jsx';
import InstanceTabOutput from './pages/InstanceTabOutput.jsx';
import Instances from './pages/Instances.jsx';
import InstanceCreate from './pages/InstanceCreate.jsx';
import RegionIndex from './pages/RegionIndex.jsx';
import ImagesAndSnapshots from './pages/ImagesAndSnapshots.jsx';
import Settings from './pages/Settings.jsx';
import Eip from './pages/Eip.jsx';
import Eips from './pages/Eips.jsx';
import EipCreate from './pages/EipCreate.jsx';
import Volumes from './pages/Volumes.jsx';
import Volume from './pages/Volume.jsx';
import VolumeCreate from './pages/VolumeCreate.jsx';
import TabPrivateImages from './pages/TabPrivateImages.jsx';
import TabPublicImages from './pages/TabPublicImages.jsx';
import TabVolumeSnapshots from './pages/TabVolumeSnapshots.jsx';
import Activities from './pages/Activities.jsx';
import Usage from './pages/Usage.jsx';
import AccessKeyCreate from './pages/AccessKeyCreate.jsx';
import AccessKeys from './pages/AccessKeys.jsx';

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
      <Route path="/vnc" onEnter={requireAuth}>
        <Route path=":host/:port/:token" component={VNC} />
      </Route>
      <Route path="/" component={App} onEnter={requireAuth} >
        <IndexRoute component={Home} />
        <Route path="access_keys">
          <IndexRoute component={AccessKeys} />
          <Route path="create" component={AccessKeyCreate} />
        </Route>
        <Route path="settings" component={Settings} />
        <Route path="profile" component={Settings} />
        <Route path=":regionId" >
          <IndexRoute component={RegionIndex} />
          <Route path="volumes">
            <IndexRoute component={Volumes} />
            <Route path="create" component={VolumeCreate} />
            <Route path=":volumeId" component={Volume} />
          </Route>
          <Route path="images_snapshots" component={ImagesAndSnapshots} >
            <IndexRoute component={TabPublicImages} />
            <Route path="public_images" component={TabPublicImages} />
            <Route path="private_images" component={TabPrivateImages} />
            <Route path="volume_snapshots" component={TabVolumeSnapshots} />
          </Route>
          <Route path="eips">
            <IndexRoute component={Eips} />
            <Route path="create" component={EipCreate} />
            <Route path=":eipId" component={Eip} />
          </Route>
          <Route path="instances" >
            <IndexRoute component={Instances} />
            <Route path="create" component={InstanceCreate} />
            <Route path=":instanceId" component={Instance} >
              <IndexRoute component={InstanceTabMonitor} />
              <Route path="monitor" component={InstanceTabMonitor} />
              <Route path="output" component={InstanceTabOutput} />
            </Route>
          </Route>
          <Route path="key_pairs" >
            <IndexRoute component={KeyPairs} />
            <Route path="create" component={KeyPairCreate} />
            <Route path=":keyPairId" component={KeyPair} />
          </Route>
          <Route path="networks" >
            <IndexRoute component={Networks} />
            <Route path="create" component={NetworkCreate} />
            <Route path=":networkId" component={Network} >
              <IndexRoute component={NetworkTabSubnets} />
              <Route path="subnets" component={NetworkTabSubnets} />
              <Route path="router" component={NetworkTabRouter} />
            </Route>
          </Route>
          <Route path="firewalls" component={Settings} />
          <Route path="activities" component={Activities} />
          <Route path="usage" component={Usage} />
        </Route>
      </Route>
    </Route >
  );
}
