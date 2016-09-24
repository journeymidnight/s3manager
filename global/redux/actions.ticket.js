import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import Auth from '../../console-common/services/auth';
import i18n from '../../shared/i18n';

export function requestDescribeTicket(routerKey, ticketId) {
  return dispatch => {
    return Auth
      .describeTickets({
        ticketIds: [ticketId],
      })
      .promise
      .then((payload) => {
        dispatch(extendContext({
          ticket: payload.ticketSet[0],
        }, routerKey));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDescribeTickets(routerKey, filters) {
  return dispatch => {
    return Auth
      .describeTickets(filters)
      .promise
      .then((payload) => {
        dispatch(extendContext(payload, routerKey));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDescribeTicketReplies(routerKey, ticketId, filters) {
  return dispatch => {
    return Auth
    .describeTicketReplies(ticketId, filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateTicket(title, content) {
  return dispatch => {
    return Auth
    .createTicket(title, content)
    .promise
    .then(() => {
      setTimeout(() => {
        dispatch(notify(i18n.t('createSuccessed')));
      }, 1000);
    });
  };
}

export function requestCreateTicketReply(routerKey, ticketId, content) {
  return dispatch => {
    return Auth
    .createTicketReply(ticketId, content)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('pageTicket.reply') + i18n.t('success')));
    });
  };
}

export function requestCloseTickets(routerKey, ticketIds) {
  return dispatch => {
    return Auth
    .closeTickets(ticketIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('closeSuccessed')));
    });
  };
}
