import { notifyAlert, extendContext } from '../../console-common/redux/actions';

export function setVisibleObjects(s3, bucketName, routerKey, filters = {}) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        Prefix: filters.searchWord,
      };

      s3.listObjectsV2(params, (error, data) => {
        if (error) {
          dispatch(notifyAlert(error.message));
          reject(error);
        } else {
          const { offset, limit } = filters;
          const visibleObjects = data.Contents.slice(offset, offset + limit);

          dispatch(extendContext({
            objects: data.Contents,
            visibleObjects,
            total: data.Contents.length,
          }, routerKey));
          resolve(data);
        }
      });
    });
  };
}
