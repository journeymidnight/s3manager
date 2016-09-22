import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeEip(routerKey, regionId, eipId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.describeEips, {
      eipIds: [eipId],
      verbose: true,
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        eip: payload.eipSet[0],
      }, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeEips(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeEips, filters)
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

export function requestCreateEip(routerKey, regionId, eip) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.allocateEips, eip)
      .promise
      .then(() => {
        setTimeout(() => {
          dispatch(notify(i18n.t('createSuccessed')));
        }, 1000);
      });
  };
}

export function requestModifyEipAttributes(routerKey, regionId, eipId, name, description) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.modifyEipAttributes, {
      eipId,
      name,
      description,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeEip(routerKey, regionId, eipId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestReleaseEips(routerKey, regionId, eipIds) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.releaseEips, {
      eipIds,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      if (error.retCode === 4702) {
        dispatch(notifyAlert(i18n.t('errorMsg.4702')));
      } else {
        dispatch(notifyAlert(error.message));
      }
      throw error;
    });
  };
}

export function requestAssociateEip(routerKey, regionId, eipId, instanceId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.associateEip, {
      eipId,
      instanceId,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('associateSuccessed')));
      return dispatch(requestDescribeEip(routerKey, regionId, eipId));
    });
  };
}

export function requestDissociateEips(routerKey, regionId, eipIds) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.dissociateEips, {
        eipIds,
      })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('dissociateSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestUpdateBandwidth(routerKey, regionId, eipIds, bandwidth) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.updateBandwidth, {
        eipIds,
        bandwidth,
      })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('updateBandwidthSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

