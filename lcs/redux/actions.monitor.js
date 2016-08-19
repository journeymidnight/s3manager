import _ from 'lodash';
import { notifyAlert, extendContext } from '../../console-common/redux/actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';

export function requestGetMonitor(routerKey, regionId, resourceId, metrics, period) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.getMonitor, {
      resourceIds: [resourceId],
      metrics,
      period,
    })
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
