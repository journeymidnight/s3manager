import _ from 'lodash';
import { notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';

export function requestGetMonitor(routerKey, regionId, resourceId, metrics, period) {
  return dispatch => {
    return IaaS
    .getMonitor(regionId, [resourceId], metrics, period)
    .promise
    .then((payload) => {
      const d = {};

      _.each(payload.monitorSet, (m) => {
        d[`period-${period}-${m.metric}`] = m;
      });

      dispatch(extendContext(d, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
