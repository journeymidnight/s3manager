import * as ActionTypes from './constants';
import { push } from 'react-router-redux';
import BOSS from '../services/boss';

export function extendContext(payload) {
  return {
    type: ActionTypes.EXTEND_CONTEXT,
    payload,
  };
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

    return dispatch(extendContext({
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

export function requestDescribeTenants() {
  return dispatch => {
    return BOSS
    .describeTenants()
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    });
  };
}

export function requestDescribeTenant(tenantId) {
  return dispatch => {
    return BOSS
    .describeTenants({
      tenants: [tenantId],
    })
    .promise
    .then((data) => {
      dispatch(extendContext({
        tenant: data.tenantSet[0],
      }));
    });
  };
}

export function requestCreateTenant(tenant) {
  return dispatch => {
    return BOSS
    .createTenant(tenant)
    .promise
    .then((res) => {
      dispatch(extendContext({
        tenant: {
          id: res.tenantId,
        },
      }));
      dispatch(push('/tenants'));
      dispatch(notify('Created!'));
    });
  };
}

export function requestModifyTenant(tenant) {
  return (dispatch) => {
    return BOSS
    .modifyTenant(tenant)
    .promise
    .then(() => {
      dispatch(notify('Saved!'));
      return dispatch(requestDescribeTenant(tenant.tenantId));
    });
  };
}
