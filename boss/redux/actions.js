import * as ActionTypes from './constants';
import { push } from 'react-router-redux';
import BOSS from '../services/boss';
import Auth from '../services/auth';

export function extendContext(payload) {
  return {
    type: ActionTypes.EXTEND_CONTEXT,
    payload,
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

export function requestLogin(email, password) {
  return dispatch => {
    return Auth.authorize(email, password)
    .promise
    .then((token) => {
      Auth.describeContext(token.token)
      .promise
      .then((context) => {
        dispatch(authLogin(context, token));
        dispatch(push('/'));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
    }).catch((error) => {
      dispatch(notifyAlert(error.message));
    });
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

export function requestDescribeUsers() {
  return dispatch => {
    return BOSS
    .describeUsers()
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    });
  };
}

export function requestDescribeUser(userId) {
  return dispatch => {
    return BOSS
    .describeUsers({
      users: [userId],
    })
    .promise
    .then((data) => {
      dispatch(extendContext({
        user: data.userSet[0],
      }));
    });
  };
}

export function requestCreateUser(user) {
  return dispatch => {
    return BOSS
    .createUser(user)
    .promise
    .then((res) => {
      dispatch(extendContext({
        user: {
          id: res.userId,
        },
      }));
      dispatch(push('/users'));
      dispatch(notify('Created!'));
    });
  };
}

export function requestModifyUser(user) {
  return (dispatch) => {
    return BOSS
    .modifyUser(user)
    .promise
    .then(() => {
      dispatch(notify('Saved!'));
      return dispatch(requestDescribeUser(user.userId));
    });
  };
}
