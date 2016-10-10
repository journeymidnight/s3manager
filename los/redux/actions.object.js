import { notifyAlert, extendContext } from '../../console-common/redux/actions';

export function setVisibleObjects(s3, bucketName, routerKey, filters) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        Prefix: filters.searchWord,
        Delimiter: '/',
      };

      s3.listObjectsV2(params, (error, data) => {
        if (error) {
          dispatch(notifyAlert(error.message));
          reject(error);
        } else {
          const { offset, limit } = filters;
          const matchedObjects = data.CommonPrefixes.concat(data.Contents.filter((object) => object.Key !== filters.searchWord));
          const visibleObjects = matchedObjects.slice(offset, offset + limit);

          dispatch(extendContext({
            visibleObjects,
            total: matchedObjects.length,
          }, routerKey));
          resolve();
        }
      });
    });
  };
}

export function isFolderEmpty(s3, bucketName, folderName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        Prefix: folderName,
      };

      s3.listObjectsV2(params, (error, data) => {
        if (error) {
          dispatch(notifyAlert(error.message));
          reject(error);
        } else if (data.Contents.length > 1) {
          reject(folderName);
        }
        resolve();
      });
    });
  };
}

// Pass folder location to folder create page. The action will be handled by rootReducer and put location into this.props.global.folderLocation
export function setFolderLocation(folderLocation) {
  return {
    type: 'SET_FOLDER_LOCATION',
    folderLocation,
  };
}

// Remove this.props.global.folderLocation. Clean up of above action
export function removeFolderLocation() {
  return {
    type: 'REMOVE_FOLDER_LOCATION',
  };
}
