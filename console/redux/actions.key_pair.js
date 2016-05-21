import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeKeyPairs(routerKey, regionId) {
  return dispatch => {
    return IaaS
    .describeKeyPairs(regionId)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateKeyPair(routerKey, regionId, keyPair) {
  return dispatch => {
    return IaaS
    .createKeyPair(regionId, keyPair)
    .promise
    .then(() => {
      dispatch(push(`/${regionId}/key_pairs`));
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
