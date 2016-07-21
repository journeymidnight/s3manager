import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import BOSS from '../services/boss';
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

export function requestDescribeAssignedQuotas(serviceId) {
  return dispatch => {
    return BOSS
    .describeProjectQuotas({
      serviceId,
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

export function requestDescribeProjectQuota(serviceId, projectId) {
  return dispatch => {
    return BOSS
    .describeProjectQuotas({
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

export function requestAssignProjectQuota(serviceId, projectId, quota) {
  return dispatch => {
    return BOSS
    .assignProjectQuota(serviceId, projectId, quota)
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
