import { notifyAlert, extendContext } from './actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';

export function requestGetMonitor(routerKey, regionId, resourceId, metric, period) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.getMonitor, {
      resourceId,
      metric,
      period,
    })
    .promise
    .then((payload) => {
      const d = {};
      d[`period-${payload.period}-${payload.metric}`] = payload;

      dispatch(extendContext(d, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
