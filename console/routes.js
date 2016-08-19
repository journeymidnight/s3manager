import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import NotFound from '../shared/pages/NotFound.jsx';
import App from './pages/App.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import GotoDefaultRegion from './pages/GotoDefaultRegion.jsx';
import KeyPair from './pages/KeyPair.jsx';
import KeyPairs from './pages/KeyPairs.jsx';
import KeyPairCreate from './pages/KeyPairCreate.jsx';
import Network from './pages/Network.jsx';
import NetworkTabPortForwarding from './pages/NetworkTabPortForwarding.jsx';
import NetworkTabSubnets from './pages/NetworkTabSubnets.jsx';
import Networks from './pages/Networks.jsx';
import NetworkCreate from './pages/NetworkCreate.jsx';
import VNC from './pages/VNC.jsx';
import Instance from './pages/Instance.jsx';
import InstanceTabMonitor from './pages/InstanceTabMonitor.jsx';
import InstanceTabOutput from './pages/InstanceTabOutput.jsx';
import Instances from './pages/Instances.jsx';
import InstanceCreate from './pages/InstanceCreate.jsx';
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
import Image from './pages/Image.jsx';
import TabVolumeSnapshots from './pages/TabVolumeSnapshots.jsx';
import TabVolumeSnapshot from './pages/TabVolumeSnapshot.jsx';
import Activities from './pages/Activities.jsx';
import Usage from './pages/Usage.jsx';
import AccessKeyCreate from './pages/AccessKeyCreate.jsx';
import AccessKeys from './pages/AccessKeys.jsx';
import TicketCreate from './pages/TicketCreate.jsx';
import Ticket from './pages/Ticket.jsx';
import Tickets from './pages/Tickets.jsx';

export default function configureRoutes(store) {
  function requireAuth(nextState, replace) {
    if (!store.getState().global || !store.getState().global.auth) {
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
        <IndexRedirect to="lcs" />

        <Route path="g" >
          <IndexRedirect to="profile" />

          <Route path="profile" component={Settings} />
          <Route path="access_keys">
            <IndexRoute component={AccessKeys} />
            <Route path="create" component={AccessKeyCreate} />
          </Route>
          <Route path="settings" component={Settings} />
          <Route path="tickets">
            <IndexRoute component={Tickets} />
            <Route path="create" component={TicketCreate} />
            <Route path=":ticketId" component={Ticket} />
          </Route>
          <Route path="security" component={Settings} />
        </Route>
        <Route path="lcs" >
          <IndexRoute component={GotoDefaultRegion} />

          <Route path=":regionId" >
            <IndexRedirect to="overview" />

            <Route path="overview" component={Usage} />
            <Route path="instances" >
              <IndexRoute component={Instances} />
              <Route path="create" component={InstanceCreate} />
              <Route path=":instanceId" component={Instance} >
                <IndexRoute component={InstanceTabMonitor} />
                <Route path="monitor" component={InstanceTabMonitor} />
                <Route path="output" component={InstanceTabOutput} />
              </Route>
            </Route>
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
            <Route path="images/:imageId" component={Image} />
            <Route path="snapshots/:snapshotId" component={TabVolumeSnapshot} />
            <Route path="eips">
              <IndexRoute component={Eips} />
              <Route path="create" component={EipCreate} />
              <Route path=":eipId" component={Eip} />
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
                <Route path="port-forwarding" component={NetworkTabPortForwarding} />
              </Route>
            </Route>
            <Route path="firewalls" component={Settings} />
            <Route path="activities" component={Activities} />
          </Route>
        </Route>
      </Route>
      <Route path="*" component={NotFound} />
    </Route >
  );
}
