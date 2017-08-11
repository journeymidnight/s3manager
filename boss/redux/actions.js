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
        let auth
        debugger
        if (token.accountId === "") {
          auth = {username: "root"};
        } else {
          auth = {username: token.accountId};
        }
        var context = {};
        context.auth = auth
        dispatch(authLogin(context, token.token));
        if (token.type === 'ROOT') {
          dispatch(push('/users')) 
        } else {
          dispatch(push('/resources')) 
        }
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
      if (payload) {
        console.log(payload.length)
        var userSet = payload.map((entry) => {
          return {
          username: entry.UserName,
          status: entry.Status,
          email:  entry.Email,
          updated: entry.Updated,
          userId: entry.AccountId,
          created: entry.Created,
        }})

        var todispatch = {
          limit: 10000,
          total: payload.length,
          userSet
        }
      } else {
          var todispatch = {
          limit: 10000,
          total: 0,
          userSet:null
        } 
      }
      dispatch(extendContext(todispatch));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeUser(userId) {
  return dispatch => {
    return IAM
    .describeUser({
      userIds: [userId],
    })
    .promise
    .then((data) => {
      var entry = data
      var user = {
          username: entry.UserName,
          status: entry.Status,
          email:  entry.Email,
          updated: entry.Updated,
          userId: entry.AccountId,
          created: entry.Created,
      }

      //iamapi returns a object, not an array
      dispatch(extendContext({
        user
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
