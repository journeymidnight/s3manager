import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import BOSS from '../services/boss';
import Region from '../services/region';
import i18n from '../../shared/i18n';

export function requestDescribeRegions(routerKey, filters) {
  return dispatch => {
    return BOSS
    .describeRegions(filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeAssignedQuotas(regionId) {
  return dispatch => {
    return BOSS
    .describeTenantQuotas({
      regionId,
    })
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeTenantQuota(regionId, tenantId) {
  return dispatch => {
    return BOSS
    .describeTenantQuotas({
      regionId,
      tenantIds: [tenantId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        quota: payload.tenantQuotaSet[0],
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestAssignTenantQuota(regionId, tenantId, quota) {
  return dispatch => {
    return BOSS
    .assignTenantQuota(regionId, tenantId, quota)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeRegion(regionId) {
  return dispatch => {
    return BOSS
    .describeRegions({
      regionIds: [regionId],
    })
    .promise
    .then((data) => {
      dispatch(extendContext({
        region: data.regionSet[0],
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateRegion(region) {
  return dispatch => {
    return BOSS
    .createRegion(region)
    .promise
    .then(() => {
      dispatch(push('/regions'));
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyRegion(region) {
  return (dispatch) => {
    return BOSS
    .modifyRegion(region)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeRegion(region.regionId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeImages(routerKey, regionId, filters) {
  return (dispatch) => {
    return Region
    .describeImages(regionId, filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestDeleteImages(routerKey, regionId, imageIds) {
  return (dispatch) => {
    return Region
    .deleteImages(regionId, imageIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestSyncImages(routerKey, regionId) {
  return (dispatch) => {
    return Region
    .syncImages(regionId)
    .promise
    .then((payload) => {
      dispatch(notify(i18n.t('syncSuccessed')));
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestModifyImageAttributes(routerKey, regionId, image) {
  return (dispatch) => {
    return Region
    .modifyImageAttributes(regionId, image)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
