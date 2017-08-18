import { notify, notifyAlert, extendContext } from './actions';
import IAM from '../services/iam';
import i18n from '../../shared/i18n';

export function requestDeleteUsers(routerKey, userIds) {
  return dispatch => {
    return IAM
    .deleteUsers(userIds)
    .promise
    .then((payload) => {
      console.log(payload)
      dispatch(notify(i18n.t('deleteSuccessed'), 'notice', 1000));
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestActiveUsers(routerKey, userIds) {
  return dispatch => {
    return IAM
    .activeUsers(userIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed'), 'notice', 1000));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeactiveUsers(routerKey, userIds) {
  return dispatch => {
    return IAM
    .deactiveUsers(userIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed'), 'notice', 1000));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
