import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeKeyPair(routerKey, regionId, keyPairId) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeKeyPairs, { keyPairIds: [keyPairId] })
      .promise
      .then((payload) => {
        dispatch(extendContext({ keyPair: payload.keyPairSet[0] }, routerKey));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDescribeKeyPairs(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeKeyPairs, filters)
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

export function requestCreateKeyPair(routerKey, regionId, keyPair) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.createKeyPair, keyPair)
      .promise
      .then((payload) => {
        dispatch(extendContext({ keyPair: payload }));
        setTimeout(() => {
          dispatch(notify(i18n.t('createSuccessed')));
        }, 1000);
      });
  };
}

export function requestModifyKeyPairAttributes(routerKey, regionId, keyPairId, name, description) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.modifyKeyPairAttributes, {
      keyPairId,
      name,
      description,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeKeyPair(routerKey, regionId, keyPairId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteKeyPairs(routerKey, regionId, keyPairIds) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.deleteKeyPairs, { keyPairIds })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

