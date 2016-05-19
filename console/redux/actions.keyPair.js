import { notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';

export function requestDescribeKeyPairs(routerKey, regionId) {
  return dispatch => {
    return IaaS
    .describeKeyPairs(regionId)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
