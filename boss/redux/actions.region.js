import { push } from 'react-router-redux';
import { notifyAlert, notify, extendContext } from './actions';
import BOSS from '../services/boss';
import i18n from '../../shared/i18n';

export function requestDescribeRegions() {
  return dispatch => {
    return BOSS
    .describeRegions()
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeRegion(regionId) {
  return dispatch => {
    return BOSS
    .describeRegions({
      regions: [regionId],
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
    return BOSS
    .createRegion(region)
    .promise
    .then(() => {
      dispatch(push('/regions'));
      dispatch(notify(i18n.t('addSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyRegion(region) {
  return (dispatch) => {
    return BOSS
    .modifyRegion(region)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('saveSuccessed')));
      return dispatch(requestDescribeRegion(region.regionId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
