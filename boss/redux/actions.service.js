import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import BOSS from '../services/boss';
import Service from '../services/service';
import i18n from '../../shared/i18n';

export function requestDescribeServices(routerKey, filters) {
  return dispatch => {
    return BOSS
    .describeServices(filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeAssignedQuotas(serviceKey, regionId) {
  return dispatch => {
    return BOSS
    .describeQuotas({
      serviceKeys: [serviceKey],
      regionIds: [regionId],
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

export function requestDescribeQuota(serviceId, projectId) {
  return dispatch => {
    return BOSS
    .describeQuotas({
      serviceId,
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

export function requestAssignQuota(serviceId, projectId, quota) {
  return dispatch => {
    return BOSS
    .assignQuota(serviceId, projectId, quota)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeService(serviceId) {
  return dispatch => {
    return BOSS
    .describeServices({
      serviceIds: [serviceId],
    })
    .promise
    .then((data) => {
      dispatch(extendContext({
        service: data.serviceSet[0],
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateService(service) {
  return dispatch => {
    return BOSS
    .createService(service)
    .promise
    .then(() => {
      dispatch(push('/services'));
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyService(service) {
  return (dispatch) => {
    return BOSS
    .modifyService(service)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeService(service.serviceId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeImages(routerKey, service, filters) {
  return (dispatch) => {
    return Service
    .describeImages(service, filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteImages(routerKey, service, imageIds) {
  return (dispatch) => {
    return Service
    .deleteImages(service, imageIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestSyncImages(routerKey, service) {
  return (dispatch) => {
    return Service
    .syncImages(service)
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


export function requestModifyImageAttributes(routerKey, service, image) {
  return (dispatch) => {
    return Service
    .modifyImageAttributes(service, image)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestDescribeInstanceTypes(routerKey, service, filters) {
  return (dispatch) => {
    return Service
    .describeInstanceTypes(service, filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestGenerateInstanceTypes(routerKey, service) {
  return (dispatch) => {
    return Service
    .generateInstanceTypes(service)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestDeleteInstanceTypes(routerKey, service, instanceTypeIds) {
  return (dispatch) => {
    return Service
    .deleteInstanceTypes(service, instanceTypeIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestCreateInstanceType(routerKey, service, instanceType) {
  return dispatch => {
    return Service
    .createInstanceType(service, instanceType)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
