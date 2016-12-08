import * as ActionTypes from './constants';
import { push } from 'react-router-redux';
import IAM from '../services/iam';
import Auth from '../services/auth';
import i18n from '../../shared/i18n';

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

export function requestLogin(email, password) {
  return dispatch => {
    return Auth.authorize(email, password)
    .promise
    .then((token) => {
      return Auth.describeToken(token.token)
      .promise
      .then((context) => {
        dispatch(authLogin(context, token));
        dispatch(push('/'));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
    })
    .catch((error) => {
      if (error.retCode === 1200) {
        dispatch(notifyAlert(i18n.t('authorizeFailed')));
      } else {
        dispatch(notifyAlert(error.message));
      }
    });
  };
}

export function requestLogout() {
  return dispatch => {
    dispatch(authLogout());
    dispatch(push('/login'));
  };
}

export function requestDescribeUserRoles(userId) {
  return (dispatch) => {
    return IAM
    .describeUserRoles(userId)
    .promise
    .then((payload) => {
      dispatch(extendContext({
        roles: payload,
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeUsers(filters = {}) {
  return dispatch => {
    return IAM
    .describeUsers(filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeUser(userId) {
  return dispatch => {
    return IAM
    .describeUsers({
      userIds: [userId],
    })
    .promise
    .then((data) => {
      dispatch(extendContext({
        user: data.userSet[0],
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestUserByEmail(email) {
  return dispatch => {
    return IAM
    .describeUsers({
      searchWord: email,
      size: 0,
    })
    .promise
    .then((res) => {
      if (res.total > 0) {
        let user;
        res.userSet.forEach((u) => {
          if (u.email === email) {
            user = u;
          }
        });
        return user;
      }
      return null;
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateUser(user) {
  return dispatch => {
    return IAM
    .createUser(user)
    .promise
    .then(() => {
      dispatch(push('/users'));
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyUser(user) {
  return (dispatch) => {
    return IAM
    .modifyUser(user)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeUser(user.userId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeAdmins() {
  return dispatch => {
    return IAM
    .describeAdmins()
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    });
  };
}

export function requestDescribeAdmin(adminId) {
  return dispatch => {
    return IAM
    .describeAdmins({
      admins: [adminId],
    })
    .promise
    .then((data) => {
      dispatch(extendContext({
        admin: data.adminSet[0],
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateAdmin(admin) {
  return dispatch => {
    return IAM
    .createAdmin(admin)
    .promise
    .then(() => {
      dispatch(push('/admins'));
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyAdmin(admin) {
  return (dispatch) => {
    return IAM
    .modifyAdmin(admin)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeAdmin(admin.adminId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
