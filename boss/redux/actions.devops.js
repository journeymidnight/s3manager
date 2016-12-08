import _ from 'lodash';
import { notifyAlert, extendContext } from './actions';
import DevOps from '../services/devops';

export function requestGetMonitorData(routerKey, region, period, params) {
  return dispatch => {
    return DevOps
    .getMonitorData(region, params)
    .promise
    .then((payload) => {
      const d = {};

      _.each(payload, (m) => {
        d[`period-${period}-${m.endpoint}-${m.metric}`] = m;
      });

      dispatch(extendContext(d, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeAlerts(routerKey, region, filters = {}) {
  return dispatch => {
    return DevOps
    .describeAlerts(region, filters)
    .promise
    .then((payload) => {
      payload.alertSet = payload.alarmSet;
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
