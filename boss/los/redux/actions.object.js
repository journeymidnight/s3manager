import { notify, notifyAlert, extendContext } from '../../redux/actions';
import i18n from '../../../shared/i18n';
import { performS3Action } from '../services/s3';

export function setVisibleObjects(s3, bucketName, routerKey, filters) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        Prefix: filters.searchWord,
        Delimiter: '/',
      };
      const s3Action = () => s3.listObjectsV2(params, (error, data) => {
        if (error) {
          dispatch(notifyAlert(error.message));
          reject(error);
        } else {
          let { offset } = filters;
          const { limit } = filters;
          const matchedFolders = data.CommonPrefixes;
          const matchedFiles = data.Contents.filter((object) => object.Key !== filters.searchWord || !object.Key.endsWith('/'));
          const matchedObjects = matchedFolders.concat(matchedFiles);
          const total = matchedObjects.length;
          if (offset >= total && offset !== 0) {
            offset -= limit;
          }
          const visibleObjects = matchedObjects.slice(offset, offset + limit);

          dispatch(extendContext({
            folderNames: matchedFolders.map(prefix => prefix.Prefix.slice(0, -1)),
            fileNames: matchedFiles.map(file => file.Key),
            visibleObjects,
            total,
            currentPage: parseInt(offset / limit, 10) + 1,
          }, routerKey));
          resolve();
        }
      });

      performS3Action(s3Action);
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
      const s3Action = () => s3.listObjectsV2(params, (error, data) => {
        if (error) {
          dispatch(notifyAlert(error.message));
          reject(error);
        } else if (data.Contents.filter((object) => object.Key !== folderName).length > 0 || data.CommonPrefixes.length > 0) {
          reject(folderName);
        }
        resolve();
      });

      performS3Action(s3Action);
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
      const s3Action = () => s3.putObjectAcl(params, (error) => {
        if (error) {
          dispatch(notifyAlert(i18n.t('objectPropertyPage.aclFail')));
          reject();
        } else {
          dispatch(notify(i18n.t('objectPropertyPage.aclSuccess'), 'notice', 1000));
          resolve();
        }
      });

      performS3Action(s3Action);
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
      const s3Action = () => s3.getObjectAcl(params, (error, data) => {
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

      performS3Action(s3Action);
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
