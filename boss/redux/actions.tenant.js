import { push } from 'react-router-redux';
import { notifyAlert, notify, extendContext } from './actions';
import BOSS from '../services/boss';
import i18n from '../../shared/i18n';

export function requestDescribeTenants(routerKey) {
  return dispatch => {
    return BOSS
    .describeTenants()
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
      tenants: [tenantId],
    })
    .promise
    .then((data) => {
      dispatch(extendContext({
        tenant: data.tenantSet[0],
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
      dispatch(notify(i18n.t('addSuccessed')));
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
      dispatch(notify(i18n.t('saveSuccessed')));
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
      dispatch(notify(i18n.t('addSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteTenantRole(tenantId, userId) {
  return (dispatch) => {
    return BOSS
    .deleteTenantRole(tenantId, userId)
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
      dispatch(extendContext({
        roles: payload,
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
