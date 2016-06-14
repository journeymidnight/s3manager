import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribePrerequisites(routerKey, regionId) {
  return dispatch => {
    return IaaS
    .describeInstanceTypes(regionId)
    .promise
    .then((payload) => {
      dispatch(extendContext({
        instanceTypeSet: payload.instanceTypeSet,
      }, routerKey));

      return IaaS
      .describeImages(regionId)
      .promise;
    })
    .then((payload) => {
      dispatch(extendContext({
        imageSet: payload.imageSet,
      }, routerKey));

      return IaaS
      .describeSubnets(regionId)
      .promise;
    })
    .then((payload) => {
      dispatch(extendContext({
        subnetSet: payload.subnetSet,
      }, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeInstances(routerKey, regionId, filters) {
  return dispatch => {
    return IaaS
    .describeInstances(regionId, filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeInstance(routerKey, regionId, instanceId) {
  return dispatch => {
    return IaaS
    .describeInstances(regionId, {
      instanceIds: [instanceId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        instance: payload.instanceSet[0],
      }, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateInstances(routerKey, regionId, params) {
  return dispatch => {
    return IaaS
    .createInstances(regionId, params)
    .promise
    .then(() => {
      dispatch(push(`/${regionId}/instances`));
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestStartInstances(routerKey, regionId, instanceIds) {
  return dispatch => {
    return IaaS
    .startInstances(regionId, instanceIds)
    .promise
    .then(() => {
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestStopInstances(routerKey, regionId, instanceIds) {
  return dispatch => {
    return IaaS
    .stopInstances(regionId, instanceIds)
    .promise
    .then(() => {
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestRestartInstances(routerKey, regionId, instanceIds) {
  return dispatch => {
    return IaaS
    .restartInstances(regionId, instanceIds)
    .promise
    .then(() => {
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteInstances(routerKey, regionId, instanceIds) {
  return dispatch => {
    return IaaS
    .deleteInstances(regionId, instanceIds)
    .promise
    .then(() => {
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyInstanceAttributes(routerKey, regionId, instanceId, name, description) {
  return dispatch => {
    return IaaS
    .modifyInstanceAttributes(regionId, instanceId, name, description)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeInstance(routerKey, regionId, instanceId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
