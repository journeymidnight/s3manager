import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeNetwork(routerKey, regionId, networkId) {
  return dispatch => {
    return IaaS
    .describeNetworks(regionId, {
      networks: [networkId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        network: payload.networkSet[0],
      }));
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
      dispatch(extendContext(payload, routerKey));
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
      dispatch(extendContext(payload));
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
