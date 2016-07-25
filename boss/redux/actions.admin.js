import { notify, notifyAlert, extendContext } from './actions';
import { push } from 'react-router-redux';
import BOSS from '../services/boss';
import i18n from '../../shared/i18n';

export function requestDescribeAdmins() {
  return dispatch => {
    return BOSS
    .describeAdmins()
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    });
  };
}

export function requestDescribeAdmin(adminId) {
  return dispatch => {
    return BOSS
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
    return BOSS
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
    return BOSS
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
