import { notify, notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeEip(routerKey, regionId, eipId) {
  return dispatch => {
    return IaaS
    .describeEips(regionId, {
      eipIds: [eipId],
      verbose: true,
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        eip: payload.eipSet[0],
      }, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeEips(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .describeEips(regionId, filters)
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

export function requestCreateEip(routerKey, regionId, eip) {
  return dispatch => {
    return IaaS
      .allocateEips(regionId, eip)
      .promise
      .then(() => {
        dispatch(notify(i18n.t('createSuccessed')));
      });
  };
}

export function requestModifyEipAttributes(routerKey, regionId, eipId, name, description) {
  return dispatch => {
    return IaaS
    .modifyEipAttributes(regionId, eipId, name, description)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeEip(routerKey, regionId, eipId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestReleaseEips(routerKey, regionId, eipIds) {
  return dispatch => {
    return IaaS
    .releaseEips(regionId, eipIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestAssociateEip(routerKey, regionId, eipId, instanceId) {
  return dispatch => {
    return IaaS
    .associateEip(regionId, eipId, instanceId)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('associateSuccessed')));
      return dispatch(requestDescribeEip(routerKey, regionId, eipId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDissociateEips(routerKey, regionId, eipIds) {
  return dispatch => {
    return IaaS
    .dissociateEips(regionId, eipIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('dissociateSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

