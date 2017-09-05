import { notifyAlert, extendContext } from '../../redux/actions';
import Wcs, { ACTION_NAMES } from '../services/wcs';

export function requestGetS3Domain(routerKey, endpoint) {
  return dispatch => {
    return Wcs
      .doAction(endpoint, ACTION_NAMES.gets3domain)
      .promise
      .then((payload) => {
        dispatch(extendContext({ s3Domain: payload.s3Domain }, routerKey));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}
