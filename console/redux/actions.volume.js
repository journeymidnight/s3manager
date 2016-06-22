import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeVolume(routerKey, regionId, volumeId) {
  return dispatch => {
    return IaaS
    .describeVolumes(regionId, {
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
      .describeVolumes(regionId, filters)
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
      .createVolume(regionId, volume)
      .promise
      .then((payload) => {
        dispatch(extendContext({ volume: payload }));
        setTimeout(() => {
          dispatch(push(`/${regionId}/volumes`));
          dispatch(notify(i18n.t('createSuccessed')));
        }, 1000);
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestModifyVolumeAttributes(routerKey, regionId, volumeId, name, description) {
  return dispatch => {
    return IaaS
    .modifyVolumeAttributes(regionId, volumeId, name, description)
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

export function requestDeleteVolumes(routerKey, regionId, volumeIds) {
  return dispatch => {
    return IaaS
    .deleteVolumes(regionId, volumeIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

