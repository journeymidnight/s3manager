import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeInstances(routerKey, regionId) {
  return dispatch => {
    return IaaS
    .describeInstances(regionId)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateInstance(routerKey, regionId, instance) {
  return dispatch => {
    return IaaS
    .createInstance(regionId, instance)
    .promise
    .then(() => {
      dispatch(push(`/${regionId}/instances`));
      dispatch(notify(i18n.t('addSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
