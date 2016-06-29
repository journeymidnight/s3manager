import { notify, notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribeSnapshot(routerKey, regionId, snapshotId) {
  return dispatch => {
    return IaaS
    .describeSnapshots(regionId, {
      snapshotIds: [snapshotId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        snapshot: payload.snapshotSet[0],
      }, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeSnapshots(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
      .describeSnapshots(regionId, filters)
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

export function requestDeleteSnapshots(routerKey, regionId, snapshotIds) {
  return dispatch => {
    return IaaS
    .deleteSnapshots(regionId, snapshotIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

