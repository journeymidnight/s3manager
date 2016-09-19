import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import Wcs, { ACTION_NAMES } from '../services/wcs';
import i18n from '../../shared/i18n';

export function requestGetS3Domain(routerKey, regionId) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.gets3domain)
      .promise
      .then((payload) => {
        dispatch(extendContext({ s3Domain: payload.s3Domain }, routerKey));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestListBuckets(routerKey, regionId, filters = {}) {
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

export function setVisibleBuckets(routerKey, regionId, filters = {}) {
  filters.verbose = true;
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.listbuckets, filters)
      .promise
      .then((payload) => {
        const { offset, limit, searchWord } = filters;
        console.log(filters);
        const matchedBuckets = payload.filter(
          (bucket) => {
            if (searchWord) return bucket.name.indexOf(searchWord) > -1;
            return true;
          }
        );
        const visibleBuckets = matchedBuckets.slice(offset, offset + limit);

        dispatch(extendContext({
          buckets: payload,
          visibleBuckets,
          total: matchedBuckets.length,
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

export function requestCreateBucket(routerKey, regionId, bucketName) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.createbucket, { bucket: bucketName })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('bucketCreatedSuccess')));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestPutCors(routerKey, regionId, bucketName) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.putcors, { bucket: bucketName })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('bucketPutCorsSuccess')));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestPutBucketAcl(s3, bucketName, acl) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        ACL: acl,
      };

      s3.putBucketAcl(params, (error, data) => {
        if (error) {
          dispatch(notifyAlert(error.message));// TODO: does this error have message?
          reject();
        } else {
          dispatch(notify(i18n.t('bucketPutAclSuccess')));
          resolve(data);
        }
      });
    });
  };
}
