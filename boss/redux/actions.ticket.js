import { notify, notifyAlert, extendContext } from './actions';
import BOSS from '../services/boss';
import i18n from '../../shared/i18n';

export function requestDescribeTicket(routerKey, ticketId) {
  return dispatch => {
    return BOSS
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
    return BOSS
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
    return BOSS
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

export function requestCreateTicketReply(routerKey, ticketId, content) {
  return dispatch => {
    return BOSS
    .createTicketReply(ticketId, content)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('createSuccessed')));
    });
  };
}

export function requestCloseTickets(routerKey, ticketIds) {
  return dispatch => {
    return BOSS
    .closeTickets(ticketIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
