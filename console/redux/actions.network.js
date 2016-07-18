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
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeSubnets(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
    .describeSubnets(regionId, filters)
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

export function requestDeleteSubnets(routerKey, regionId, subnetIds) {
  return dispatch => {
    return IaaS
    .deleteSubnets(regionId, subnetIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateSubnet(routerKey, regionId, subnet) {
  return dispatch => {
    return IaaS
    .createSubnet(regionId, subnet)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestSetExternalGateway(routerKey, regionId, networkIds) {
  return dispatch => {
    return IaaS
    .setExternalGateway(regionId, networkIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestUnsetExternalGateway(routerKey, regionId, networkIds) {
  return dispatch => {
    return IaaS
    .unsetExternalGateway(regionId, networkIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribePortForwardings(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
    .describePortForwardings(regionId, filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreatePortForwarding(routerKey, regionId, portForwarding) {
  return dispatch => {
    return IaaS
    .createPortForwarding(regionId, portForwarding)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeletePortForwardings(routerKey, regionId, portForwardingIds) {
  return dispatch => {
    return IaaS
    .deletePortForwardings(regionId, portForwardingIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
