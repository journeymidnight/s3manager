import { notify, notifyAlert, extendContext } from './actions';
import Auth from '../services/auth';
import i18n from '../../shared/i18n';

export function requestDescribeAccessKeys(filters) {
  return dispatch => {
    return Auth
      .describeAccessKeys(filters)
      .promise
      .then((payload) => {
        dispatch(extendContext(Object.assign(payload, {
          currentPage: parseInt(payload.offset / payload.limit, 10) + 1,
          size: payload.limit,
          totalPage: parseInt((payload.total - 1) / payload.limit, 10) + 1,
        })));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestCreateAccessKey(name, description) {
  return dispatch => {
    return Auth
      .createAccessKey(name, description)
      .promise
      .then((payload) => {
        dispatch(extendContext({ accessKey: payload }));
        setTimeout(() => {
          dispatch(notify(i18n.t('createSuccessed')));
        }, 1000);
      });
  };
}

export function requestDeleteAccessKeys(accessKeys) {
  return dispatch => {
    return Auth
    .deleteAccessKeys(accessKeys)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
