import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeLoadBalancer(routerKey, regionId, loadBalancerId) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeLoadBalancers, {
        loadBalancerIds: [loadBalancerId],
      })
      .promise
      .then((payload) => {
        dispatch(extendContext({
          loadBalancer: payload.loadBalancerSet[0],
        }, routerKey));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDescribeLoadBalancers(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeLoadBalancers, filters)
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

export function requestDeleteLoadBalancers(routerKey, regionId, loadBalancerIds) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.deleteLoadBalancers, { loadBalancerIds })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateLoadBalancer(routerKey, regionId, loadBalancer) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.createLoadBalancer, loadBalancer)
      .promise
      .then((payload) => {
        dispatch(extendContext({ loadBalancer: payload }));
        setTimeout(() => {
          dispatch(notify(i18n.t('createSuccessed')));
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          dispatch(notifyAlert(error.message));
        }, 1000);
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

export function requestModifyLoadBalancer(routerKey, regionId, loadBalancerId, name, description) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.modifyLoadBalancer, { loadBalancerId, name, description })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('updateSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestUpdateLoadBalancerBandwidth(routerKey, regionId, loadBalancerId, bandwidth) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.updateLoadBalancerBandwidth, { loadBalancerIds: [loadBalancerId], bandwidth })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('updateSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDescribeLbListeners(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeLoadBalancerListeners, filters)
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

export function requestCreateLbListener(routerKey, regionId, loadBalancer) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.createLoadBalancerListener, loadBalancer)
      .promise
      .then((payload) => {
        dispatch(extendContext({ listener: payload }));
        setTimeout(() => {
          dispatch(notify(i18n.t('createSuccessed')));
        }, 1000);
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDeleteLbListeners(routerKey, regionId, listenerIds) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.deleteLoadBalancerListeners, { loadBalancerListenerIds: listenerIds })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('deleteSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestModifyLoadBalancerListener(routerKey, regionId, loadBalancerListenerId, name, description) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.modifyLoadBalancerListener, { loadBalancerListenerId, name, description })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('updateSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestUpdateLoadBalancerListener(routerKey, regionId, loadBalancerListenerId, params) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.updateLoadBalancerListener, { loadBalancerListenerId, ...params })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('updateSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDescribeLbBackends(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeLoadBalancerBackends, filters)
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

export function requestCreateLbBackend(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.createLoadBalancerBackend, filters)
      .promise
      .then(() => {
        dispatch(notify(i18n.t('createSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDeleteLbBackends(routerKey, regionId, backendsIds) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.deleteLoadBalancerBackends, { loadBalancerBackendIds: backendsIds })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('deleteSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestModifyLoadBalancerBackend(routerKey, regionId, loadBalancerBackendId, name, description) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.modifyLoadBalancerBackend, { loadBalancerBackendId, name, description })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('updateSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestUpdateLoadBalancerBackend(routerKey, regionId, loadBalancerBackendId, params) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.updateLoadBalancerBackend, { loadBalancerBackendId, ...params })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('updateSuccessed')));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function disable() {
  return dispatch => {
    dispatch(notifyAlert(i18n.t('pageLoadBalancer.disablePrompt')));
  };
}
