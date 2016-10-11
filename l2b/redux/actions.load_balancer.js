import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeLoadBalancer(routerKey, regionId, loadBalancerId) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeLoadBalancers, {
        loadBalancerIds: [loadBalancerId],
        verbose: true,
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

