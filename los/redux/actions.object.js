import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import i18n from '../../shared/i18n';

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
          const matchedObjects = data.CommonPrefixes.concat(data.Contents.filter((object) => object.Key !== filters.searchWord || !object.Key.endsWith('/')));
          const visibleObjects = matchedObjects.slice(offset, offset + limit);

          dispatch(extendContext({
            data,
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
        } else if (data.Contents.length > 1 || data.CommonPrefixes.length > 1) {
          reject(folderName);
        }
        resolve();
      });
    });
  };
}

export function requestPutObjectAcl(s3, bucketName, objectName, acl) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        Key: objectName,
        ACL: acl,
      };
      s3.putObjectAcl(params, (error) => {
        if (error) {
          dispatch(notifyAlert(i18n.t('objectPropertyPage.aclFail')));
          reject();
        } else {
          dispatch(notify(i18n.t('objectPropertyPage.aclSuccess')));
          resolve();
        }
      });
    });
  };
}

export function requestGetObjectAcl(s3, bucketName, objectName, routerKey) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        Key: objectName,
      };

      s3.getObjectAcl(params, (error, data) => {
        if (error) {
          dispatch(notifyAlert(error.message));
          reject();
        } else {
          // Below 3 lines of code may lead to bug in future
          const acls = data.Grants.map((Grant) => Grant.Permission);
          let acl = 'private';
          if (acls.includes('READ')) acl = 'public-read';

          dispatch(extendContext({ objectName, objectAcl: acl }, routerKey));
          resolve();
        }
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
