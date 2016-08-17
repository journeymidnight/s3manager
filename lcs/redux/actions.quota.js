import { notifyAlert, extendContext } from './actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';

export function requestDescribeQuotas(regionId) {
  return dispatch => {
    return IaaS
      .doAction(regionId, ACTION_NAMES.describeQuotas)
      .promise
      .then((payload) => {
        dispatch(extendContext(payload));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}
