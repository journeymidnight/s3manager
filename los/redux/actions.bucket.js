import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import Wcs, { ACTION_NAMES } from '../services/wcs';
import i18n from '../../shared/i18n';

export function setVisibleBuckets(routerKey, regionId, filters = {}) {
  return dispatch => {
    return Wcs
      .doAction(regionId, ACTION_NAMES.listbuckets, filters)
      .promise
      .then((payload) => {
        const { offset, limit, searchWord } = filters;
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

export function listBuckets(routerKey, regionId, filters = {}) {
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
  return () => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        ACL: acl,
      };

      s3.putBucketAcl(params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
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
          dispatch(extendContext({
            acl: data.Grants[0].Permission,
          }, routerKey));
          resolve(data);
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

// Pass bucket creation date to bucket detail page. The action will be handled by rootReducer and put date into this.props.global.currentBucketCreationDate
export function setBucket(data) {
  return {
    type: 'SET_BUCKET',
    data,
  };
}

// Remove this.props.global.currentBucketCreationDate. Clean up of above action
export function removeBucket() {
  return {
    type: 'REMOVE_BUCKET',
  };
}
