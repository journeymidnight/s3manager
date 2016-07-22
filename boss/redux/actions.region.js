import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import IAM from '../services/iam';
import Region from '../services/region';
import i18n from '../../shared/i18n';

export function requestDescribeRegions(routerKey, filters) {
  return dispatch => {
    return IAM
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
    return IAM
    .describeProjectQuotas({
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

export function requestDescribeProjectQuota(regionId, projectId) {
  return dispatch => {
    return IAM
    .describeProjectQuotas({
      regionId,
      projectIds: [projectId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        quota: payload.projectQuotaSet[0],
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestAssignProjectQuota(regionId, projectId, quota) {
  return dispatch => {
    return IAM
    .assignProjectQuota(regionId, projectId, quota)
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
    return IAM
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
    return IAM
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
    return IAM
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


export function requestDescribeInstanceTypes(routerKey, regionId, filters) {
  return (dispatch) => {
    return Region
    .describeInstanceTypes(regionId, filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestGenerateInstanceTypes(routerKey, regionId) {
  return (dispatch) => {
    return Region
    .generateInstanceTypes(regionId)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestDeleteInstanceTypes(routerKey, regionId, instanceTypeIds) {
  return (dispatch) => {
    return Region
    .deleteInstanceTypes(regionId, instanceTypeIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestCreateInstanceType(routerKey, regionId, instanceType) {
  return dispatch => {
    return Region
    .createInstanceType(regionId, instanceType)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
