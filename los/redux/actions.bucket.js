import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import Wcs, { ACTION_NAMES } from '../services/wcs';
import i18n from '../../shared/i18n';

export function setVisibleBuckets(routerKey, regionId, filters) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.listbuckets, {})
      .promise
      .then((payload) => {
        const { offset, limit, searchWord } = filters;
        if (payload) {
          const matchedBuckets = payload.filter(
            (bucket) => {
              if (searchWord) return bucket.name.indexOf(searchWord) > -1;
              return true;
            }
          );
          const visibleBuckets = matchedBuckets.slice(offset, offset + limit);

          dispatch(extendContext({
            visibleBuckets,
            total: matchedBuckets.length,
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
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.deletebucket, { bucket: bucketName })
      .promise
      .then(() => {
        dispatch(notify(i18n.t('bucketDeletedSuccess')));
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
      s3.putBucketAcl(params, (error) => {
        if (error) {
          reject();
        } else {
          dispatch(notify(i18n.t('pageBucket.putAclSuccess')));
          resolve();
        }
      });
    });
  };
}

export function requestGetBucketAcl(s3, bucketName, routerKey) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
      };

      s3.getBucketAcl(params, (error, data) => {
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
        const usageByNow = JSON.parse(payload).usage.hasOwnProperty('rgw.main') ? JSON.parse(payload).usage['rgw.main'].size_kb_actual : 0;
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

      s3.listObjectsV2(params, (error, data) => {
        if (error) {
          dispatch(notifyAlert(error.message));
          reject();
        } else if (data.Contents.length > 1 || data.CommonPrefixes.length > 1) {
          reject(bucketName);
        }
        resolve();
      });
    });
  };
}

// Pass bucket name and creation date to bucket detail page. The action will be handled by rootReducer and put date into this.props.global.bucketName & bucketCreationDate
export function setBucket(data) {
  return {
    type: 'SET_BUCKET',
    data,
  };
}

// Remove this.props.global.bucketName & bucketCreationDate. Clean up of above action
export function removeBucket() {
  return {
    type: 'REMOVE_BUCKET',
  };
}
