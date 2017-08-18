import { notify, notifyAlert, extendContext } from '../../redux/actions';
import Wcs, { ACTION_NAMES } from '../services/wcs';
import { performS3Action } from '../services/s3';
import i18n from '../../../shared/i18n';

export function setVisibleBuckets(routerKey, regionId, filters) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.listbuckets, {})
      .promise
      .then((payload) => {
        const { limit, searchWord } = filters;
        let { offset } = filters;
        if (payload) {
          const matchedBuckets = payload.filter(
            (bucket) => {
              if (searchWord) return bucket.name.indexOf(searchWord) > -1;
              return true;
            }
          );
          const total = matchedBuckets.length;
          if (offset >= total && offset !== 0) {
            offset -= limit;
          }
          const visibleBuckets = matchedBuckets.slice(offset, offset + limit);

          dispatch(extendContext({
            visibleBuckets,
            total,
            currentPage: parseInt(offset / limit, 10) + 1,
          }, routerKey));
        } else {
          dispatch(extendContext({
            visibleBuckets: [],
            total: 0,
            currentPage: 1,
          }, routerKey));
        }
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function listBuckets(routerKey, regionId) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.listbuckets, {})
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

export function requestDeleteBucket(routerKey, regionId, bucketName) {
  debugger
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.deletebucket, { bucket: bucketName })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('bucketDeletedSuccess'), 'notice', 1000));
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestCreateBucket(routerKey, regionId, bucketName) {
  return () => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.createbucket, { bucket: bucketName })
      .promise;
  };
}

export function requestPutCors(routerKey, regionId, bucketName) {
  return () => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.putcors, { bucket: bucketName })
      .promise;
  };
}

export function requestPutBucketAcl(s3, bucketName, acl) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        ACL: acl,
      };
      const s3Action = () => s3.putBucketAcl(params, (error) => {
        if (error) {
          reject();
        } else {
          dispatch(notify(i18n.t('pageBucket.putAclSuccess')));
          resolve();
        }
      });

      performS3Action(s3Action, true);
    });
  };
}

export function requestGetBucketAcl(s3, bucketName, routerKey) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
      };

      const s3Action = () => s3.getBucketAcl(params, (error, data) => {
        if (error) {
          dispatch(notifyAlert(error.message));
          reject();
        } else {
          // Below 3 lines of code may lead to bug in future
          const acls = data.Grants.map((Grant) => Grant.Permission);
          let acl = 'private';
          if (acls.includes('READ')) acl = 'public-read';

          dispatch(extendContext({
            acl,
          }, routerKey));
          resolve();
        }
      });

      performS3Action(s3Action, true);
    });
  };
}

export function requestGetUsageByHour(routerKey, regionId, bucketName, startDate, endDate) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.getusagebyhour, { bucket: bucketName, region: regionId, startdate: startDate, enddate: endDate })
      .promise
      .then((payload) => {
        dispatch(extendContext({ usagebyhour: payload }, routerKey));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestGetOpByHour(routerKey, regionId, bucketName, startDate, endDate) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.getopbyhour, { bucket: bucketName, region: regionId, startdate: startDate, enddate: endDate })
      .promise
      .then((payload) => {
        dispatch(extendContext({ opbyhour: payload }, routerKey));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestGetFlowByHour(routerKey, regionId, bucketName, startDate, endDate) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.getflowbyhour, { bucket: bucketName, region: regionId, startdate: startDate, enddate: endDate })
      .promise
      .then((payload) => {
        dispatch(extendContext({ flowbyhour: payload }, routerKey));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestGetStaticsByDay(routerKey, regionId, bucketName, startDate, endDate) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.getstaticsbyday, { bucket: bucketName, region: regionId, startdate: startDate, enddate: endDate })
      .promise
      .then((payload) => {
        dispatch(extendContext({ staticsbyday: payload }, routerKey));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function requestGetUsageByNow(routerKey, regionId, bucketName, projectId) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.getbucketstats, { bucket: bucketName, projectId })
      .promise
      .then((payload) => {
        const usageByNow = JSON.parse(payload).usage.hasOwnProperty('rgw.main') ? JSON.parse(payload).usage['rgw.main'].size_kb : 0;
        dispatch(extendContext({ usageByNow }, routerKey));
      }).catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  };
}

export function isBucketEmpty(s3, bucketName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
      };
      const s3Action = () => s3.listObjectsV2(params, (error, data) => {
        if (error) {
          dispatch(notifyAlert(error.message));
          reject();
        } else if (data.Contents.length > 0 || data.CommonPrefixes.length > 0) {
          console.log(bucketName)
          reject(bucketName);
        } else {
          resolve();
        }
      });

      performS3Action(s3Action, true);
    });
  };
}
