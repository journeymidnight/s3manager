import * as ActionTypes from './constants';
import { push } from 'react-router-redux';

export function extendContext(payload, routerKey = undefined) {
  return {
    type: ActionTypes.EXTEND_CONTEXT,
    payload,
    routerKey,
  };
}

export function setHeader(title, link) {
  return {
    type: ActionTypes.EXTEND_CONTEXT,
    payload: {
      header: {
        title,
        link,
      },
    },
  };
}

export function cleanNotify() {
  return extendContext({
    notify: null,
  });
}

export function notify(message, type = 'notice', delay = undefined) {
  return (dispatch) => {
    if (delay) {
      setTimeout(() => {
        dispatch(cleanNotify());
      }, delay);
    }

    dispatch(extendContext({
      notify: {
        message,
        type,
      },
    }));
  };
}

export function notifyAlert(message, delay = undefined) {
  return notify(message, 'alert', delay);
}

export function authLogin(context, token) {
  return {
    type: ActionTypes.AUTH_LOGIN,
    context,
    token,
  };
}

export function authLogout() {
  return {
    type: ActionTypes.AUTH_LOGOUT,
  };
}

export function requestLogout() {
  return dispatch => {
    dispatch(authLogout());
    dispatch(push('/login'));
  };
}
