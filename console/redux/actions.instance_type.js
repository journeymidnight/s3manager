import { notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';

export function requestDescribeInstanceTypes(routerKey, regionId) {
  return dispatch => {
    return IaaS
    .describeInstanceTypes(regionId)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
