import { notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';

export function requestDescribeImages(routerKey, regionId) {
  return dispatch => {
    return IaaS
    .describeImages(regionId)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
