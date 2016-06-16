import { push } from 'react-router-redux';
import { notifyAlert, notify, extendContext } from './actions';
import BOSS from '../services/boss';
import i18n from '../../shared/i18n';

export function requestDescribeTenants(routerKey, filters) {
  return dispatch => {
    return BOSS
    .describeTenants(filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeTenant(tenantId) {
  return dispatch => {
    return BOSS
    .describeTenants({
      tenantIds: [tenantId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        tenant: payload.tenantSet[0],
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateTenant(tenant) {
  return dispatch => {
    return BOSS
    .createTenant(tenant)
    .promise
    .then((res) => {
      dispatch(extendContext({
        tenant: {
          id: res.tenantId,
        },
      }));
      dispatch(push('/tenants'));
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyTenant(tenant) {
  return (dispatch) => {
    return BOSS
    .modifyTenant(tenant)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeTenant(tenant.tenantId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateTenantRole(tenantId, userId, role) {
  return (dispatch) => {
    return BOSS
    .createTenantRole(tenantId, userId, role)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteTenantRole(tenantId, userIds) {
  return (dispatch) => {
    return BOSS
    .deleteTenantRole(tenantId, userIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeTenantRoles(tenantId) {
  return (dispatch) => {
    return BOSS
    .describeTenantRoles(tenantId)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteTenants(routerKey, tenantIds) {
  return dispatch => {
    return BOSS
    .deleteTenants(tenantIds)
    .promise
    .then((payload) => {
      dispatch(notify(i18n.t('deleteSuccess')));
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
