import { notifyAlert, extendContext } from './actions';
import DevOps from '../services/devops';

export function requestGetMonitorData(routerKey, region) {
  return dispatch => {
    return DevOps
    .getMonitorData(region)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
