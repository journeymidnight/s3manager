import { notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';

export function requestGetMonitor(routerKey, regionId, resourceId, metric, period) {
  return dispatch => {
    return IaaS
    .getMonitor(regionId, resourceId, metric, period)
    .promise
    .then((payload) => {
      const d = {};
      d[`period-${payload.period}-${payload.metric}`] = payload.data;

      dispatch(extendContext(d, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
