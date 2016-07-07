import { notifyAlert, extendContext } from './actions';
import Iaas from '../services/iaas';

export function requestDescribeQuotas(regionId) {
  return dispatch => {
    return Iaas
      .describeQuotas(regionId)
      .promise
      .then((payload) => {
        dispatch(extendContext(payload));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}
