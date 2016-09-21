import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeNetwork(routerKey, regionId, networkId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.describeNetworks, {
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
    .doAction(regionId, ACTION_NAMES.describeNetworks, filters)
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
    .doAction(regionId, ACTION_NAMES.describeSubnets, filters)
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
      .doAction(regionId, ACTION_NAMES.createNetwork, network)
      .promise
      .then(() => {
        setTimeout(() => {
          dispatch(notify(i18n.t('createSuccessed')));
        }, 1000);
      });
  };
}

export function requestDeleteNetworks(routerKey, regionId, networkIds) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.deleteNetworks, {
      networkIds,
    })
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
    .doAction(regionId, ACTION_NAMES.modifyNetworkAttributes, {
      networkId,
      name,
      description,
    })
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

export function requestUpdateExternalGatewayBandwidth(routerKey, regionId, networkId, bandwidth) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.updateExternalGatewayBandwidth, {
        networkIds: [networkId],
        bandwidth,
      })
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
    .doAction(regionId, ACTION_NAMES.deleteSubnets, {
      subnetIds,
    })
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
    .doAction(regionId, ACTION_NAMES.createSubnet, subnet)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('createSuccessed')));
    });
  };
}

export function requestSetExternalGateway(routerKey, regionId, networkIds) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.setExternalGateway, {
      networkIds,
    })
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
    .doAction(regionId, ACTION_NAMES.unsetExternalGateway, {
      networkIds,
    })
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
    .doAction(regionId, ACTION_NAMES.describePortForwardings, filters)
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
    .doAction(regionId, ACTION_NAMES.createPortForwarding, portForwarding)
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
    .doAction(regionId, ACTION_NAMES.deletePortForwardings, {
      portForwardingIds,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
