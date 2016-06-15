import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import BOSS from '../services/boss';
import i18n from '../../shared/i18n';

export function requestDescribeRegions() {
  return dispatch => {
    return BOSS
    .describeRegions()
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
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
      regionIds: [regionId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        quotas: payload,
      }));
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
      regionIds: [regionId],
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
      regions: [regionId],
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
