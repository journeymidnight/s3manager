import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import IAM from '../services/iam';
import i18n from '../../shared/i18n';

export function requestDescribeRegions(routerKey, filters) {
  return dispatch => {
    return IAM
    .describeRegions(filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeRegion(regionId) {
  return dispatch => {
    return IAM
    .describeRegions({
      regionIds: [regionId],
    })
    .promise
    .then((data) => {
      let regions = data.regionSet.filter(region => region.regionId == regionId)
      dispatch(extendContext({
        region: regions[0],
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateRegion(region) {
  return dispatch => {
    return IAM
    .createRegion(region)
    .promise
    .then(() => {
      dispatch(push('/regions'));
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyRegion(region) {
  return (dispatch) => {
    return IAM
    .modifyRegion(region)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed'), 'notice', 1000));
      return dispatch(requestDescribeRegion(region.regionId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteRegions(routerKey, regionIds) {
  return dispatch => {
    return IAM
    .deleteRegions(regionIds)
    .promise
    .then((payload) => {
      dispatch(notify(i18n.t('deleteSuccessed')));
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
