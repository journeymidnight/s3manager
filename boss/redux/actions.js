import * as ActionTypes from './constants';
import { push } from 'react-router-redux';
import BOSS from '../services/boss';

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

export function extendContext(payload) {
  return {
    type: ActionTypes.EXTEND_CONTEXT,
    payload,
  };
}

export function requestLogout() {
  return dispatch => {
    dispatch(authLogout());
    dispatch(push('/login'));
  };
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
    });
  };
}

export function requestModifyTenant(id, tenant) {
  return dispatch => {
    return BOSS
    .modifyTenant(id, tenant)
    .promise
    .then((res) => {
      dispatch(extendContext({
        tenant: res,
      }));
    });
  };
}
