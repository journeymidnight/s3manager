import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeEips(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .describeEips(regionId, filters)
      .promise
      .then((payload) => {
        dispatch(extendContext(Object.assign(payload, {
          currentPage: payload.offset / payload.limit + 1,
          size: payload.limit
        })));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestCreateEip(routerKey, regionId, eip) {
  return dispatch => {
    return IaaS
      .allocateEips(regionId, eip)
      .promise
      .then(() => {
        dispatch(push(`/${regionId}/eips`));
        dispatch(notify(i18n.t('createSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDescribeKeyPair(routerKey, regionId, keyPairId) {
  return dispatch => {
    return IaaS
      .describeKeyPairs(regionId)
      .promise
      .then((payload) => {
        dispatch(extendContext({
          keyPair2: payload.keyPairSet.filter(
            (keyPair) => keyPair.keyPairId === keyPairId
          )[0]
        }));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

