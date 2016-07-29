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
      dispatch(extendContext({
        region: data.regionSet[0],
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
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeRegion(region.regionId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
