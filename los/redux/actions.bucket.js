import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import Wcs, { ACTION_NAMES } from '../services/wcs';
import i18n from '../../shared/i18n';

export function requestListBuckets(routerKey, regionId, filters) {
  filters.verbose = true;
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.listbuckets, filters)
      .promise
      .then((payload) => {
        dispatch(extendContext({
          buckets: payload,
        }, routerKey));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestDeleteBuckets(routerKey, regionId, bucketNames) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.deletebucket, { bucket: bucketNames[0] }) // TODO: Modify to delete all buckets
      .promise
      .then(() => {
        notify(i18n.t('bucketsDeletedSuccess'));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

