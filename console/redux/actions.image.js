import { notify, notifyAlert, extendContext } from './actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeImages(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeImages, filters)
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

export function requestDescribeImage(routerKey, regionId, imageId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.describeImages, {
      imageIds: [imageId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        image: payload.imageSet[0],
      }, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteImages(routerKey, regionId, imageIds) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.deleteImages, {
      imageIds,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyImageAttributes(routerKey, regionId, imageId, name, description) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.modifyImageAttributes, {
      imageId,
      name,
      description,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeImage(routerKey, regionId, imageId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
