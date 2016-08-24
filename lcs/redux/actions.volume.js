import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeVolume(routerKey, regionId, volumeId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.describeVolumes, {
      volumeIds: [volumeId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        volume: payload.volumeSet[0],
      }, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeVolumes(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeVolumes, filters)
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

export function requestCreateVolume(routerKey, regionId, volume) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.createVolumes, volume)
      .promise
      .then((payload) => {
        dispatch(extendContext({ volume: payload }));
        setTimeout(() => {
          dispatch(notify(i18n.t('createSuccessed')));
        }, 1000);
      });
  };
}

export function requestModifyVolumeAttributes(routerKey, regionId, volumeId, name, description) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.modifyVolumeAttributes, {
      volumeId,
      name,
      description,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeVolume(routerKey, regionId, volumeId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestAttachVolume(routerKey, regionId, volumeId, instanceId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.attachVolume, {
      volumeId,
      instanceId,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('attachSuccessed')));
      return dispatch(requestDescribeVolume(routerKey, regionId, volumeId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDetachVolumes(routerKey, regionId, volumeIds, instanceId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.detachVolumes, {
      volumeIds,
      instanceId,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('detachSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestResizeVolumes(routerKey, regionId, volumeIds, size) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.resizeVolumes, {
      volumeIds,
      size,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('resizeSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateSnapshots(routerKey, regionId, snapshot) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.createSnapshots, snapshot)
      .promise
      .then((payload) => {
        dispatch(extendContext({ snapshot: payload }));
        setTimeout(() => {
          dispatch(notify(i18n.t('createSuccessed')));
        }, 1000);
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDeleteVolumes(routerKey, regionId, volumeIds) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.deleteVolumes, { volumeIds })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

