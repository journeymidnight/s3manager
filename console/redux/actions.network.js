import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeNetwork(routerKey, regionId, networkId) {
  return dispatch => {
    return IaaS
    .describeNetworks(regionId, {
      networkIds: [networkId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        network: payload.networkSet[0],
      }, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeNetworks(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
    .describeNetworks(regionId, filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(Object.assign(payload, {
        currentPage: parseInt(payload.offset / payload.limit, 10) + 1,
        size: payload.limit,
        totalPage: parseInt((payload.total - 1) / payload.limit, 10) + 1,
      }), routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeSubnets(routerKey, regionId) {
  return dispatch => {
    return IaaS
    .describeSubnets(regionId)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateNetwork(routerKey, regionId, network) {
  return dispatch => {
    return IaaS
    .createNetwork(regionId, network)
    .promise
    .then(() => {
      dispatch(push(`/${regionId}/networks`));
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteNetworks(routerKey, regionId, networkIds) {
  return dispatch => {
    return IaaS
    .deleteNetworks(regionId, networkIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyNetworkAttributes(routerKey, regionId, networkId, name, description) {
  return dispatch => {
    return IaaS
    .modifyNetworkAttributes(regionId, networkId, name, description)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeNetwork(routerKey, regionId, networkId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
