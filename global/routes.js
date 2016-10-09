import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import NotFound from '../shared/pages/NotFound.jsx';
import App from '../console-common/pages/App.jsx';
import Login from '../console-common/pages/Login.jsx';
import Logout from '../console-common/pages/Logout.jsx';
import OAuth from '../console-common/pages/OAuth.jsx';
import Settings from '../console-common/pages/Settings.jsx';
import AccessKeyCreate from './pages/AccessKeyCreate.jsx';
import AccessKeys from './pages/AccessKeys.jsx';
import TicketCreate from './pages/TicketCreate.jsx';
import Ticket from './pages/Ticket.jsx';
import Tickets from './pages/Tickets.jsx';

export default function configureRoutes(store) {
  function requireAuth(nextState, replace) {
    if (!store.getState().global || !store.getState().global.auth) {
      if (!window.DEBUG) {
        window.location.href = `http://uc.lecloud.com/login.do?backUrl=${window.location.origin}/p/api/oauth`;
      }

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
      <Route path="/oauth" component={OAuth} />
      <Route path="/" component={App} onEnter={requireAuth} >
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
      <Route path="*" component={NotFound} />
    </Route >
  );
}
