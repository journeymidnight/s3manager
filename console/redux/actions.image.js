import { notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';

export function requestDescribeImages(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .describeImages(regionId, filters)
      .promise
      .then((payload) => {
        dispatch(extendContext(Object.assign(payload, {
          currentPage: parseInt(payload.offset / payload.limit, 10) + 1,
          size: payload.limit,
          totalPage: parseInt((payload.total - 1) / payload.limit, 10) + 1,
        })));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}
