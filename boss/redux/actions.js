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

export function setRegionSet(regionSet) {
  return {
    type: ActionTypes.REGIONSET,
    regionSet,
  };
}

export function setCurrentProject(projectId) {
  return {
    type: ActionTypes.CURRENT_PROJECT,
    projectId,
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
        //actually there is only one root
        if (token.type === "ROOT") {
          auth = {username: "u-root"};
        } else {
          auth = {username: token.accountId};
        }

        var context = {};
        context.auth = auth
        dispatch(authLogin(context, token.token));
        if (token.type === 'ROOT') {
          dispatch(push('/users')) 
        } else {
          // for accounts, we should let them select a project right now
          IAM.describeRegions()
          .promise
          .then((rgs) => 
          {
              var region = { //fixme: this is ugly
              accessKey:  "tjhKTEkZ6wzteqYNPvas",
              accessSecret: "VLZsBahNvgsC9x5mfsRgUhwgn4HPyPV4JaAaSzNZ",
              endpoint: "http://127.0.0.1:8888",
              name: "华北一区",
              regionId: "cn-north-1"
            };
            dispatch(selectService({
              serviceKey: '',
              servicePath: '',
              region
            }));

            dispatch(push('/buckets')) 
          })
        }
      })
    .catch((error) => {
      if (error.retCode === 1200) {
        dispatch(notifyAlert(i18n.t('authorizeFailed')));
      } else if (error.retCode === 4102) {
        dispatch(Actions.extendContext({ projectSet: error.data.projectSet}))
        dispatch(push('/login')) 
      } else {
        dispatch(notifyAlert(error.message));
      }
    });
  };
}


export function selectService(service) {
  return {
    type: ActionTypes.SELECT_SERVICE,
    service,
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
        // filter users according to the offset
        let alreadyGet = 0;
        let i = filters.offset;
        let userSet = [];

        for (; i<payload.length; i++) {
          if (alreadyGet < filters.limit) {
            alreadyGet++
            var entry = payload[i];
            userSet.push({
              username: entry.UserName,
              status: entry.Status,
              email:  entry.Email,
              updated: entry.Updated,
              userId: entry.AccountId,
              created: entry.Created,
            })
          } else {
            break;
          }
        }

        var todispatch = {
          limit: 20,
          offset: filters.offset, 
          total: payload.length,
          userSet
        }
      } else {
          var todispatch = {
          limit: 20,
          total: 0,
          offset: 0, 
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
      if (res.length> 0) {
        let user;
        res.forEach((u) => {
          if (u.Email === email) {
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
      dispatch(notify(i18n.t('createSuccessed'), 'notice', 1000));
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
