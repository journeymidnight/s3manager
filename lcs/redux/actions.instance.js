import { notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribePrerequisites(routerKey, regionId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.describeInstanceTypes, {
      status: ['active'],
      limit: 100,
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        instanceTypeSet: payload.instanceTypeSet,
        isPublic: true,
      }, routerKey));

      return IaaS
      .doAction(regionId, ACTION_NAMES.describeImages, {
        status: ['active'],
        isPublic: true,
        limit: 100,
      })
      .promise;
    })
    .then((payload) => {
      dispatch(extendContext({
        publicImageSet: payload.imageSet,
      }, routerKey));

      return IaaS
      .doAction(regionId, ACTION_NAMES.describeImages, {
        status: ['active'],
        isPublic: false,
        limit: 100,
      })
      .promise;
    })
    .then((payload) => {
      dispatch(extendContext({
        privateImageSet: payload.imageSet,
      }, routerKey));

      return IaaS
      .doAction(regionId, ACTION_NAMES.describeNetworks, {
        status: ['active'],
        limit: 100,
        verbose: true,
      })
      .promise;
    })
    .then((payload) => {
      dispatch(extendContext({
        networkSet: payload.networkSet,
      }, routerKey));

      return IaaS
      .doAction(regionId, ACTION_NAMES.describeKeyPairs, {
        status: ['active'],
        limit: 100,
      })
      .promise;
    })
    .then((payload) => {
      dispatch(extendContext({
        keyPairSet: payload.keyPairSet,
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
    .doAction(regionId, ACTION_NAMES.describeInstances, filters)
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
    .doAction(regionId, ACTION_NAMES.describeInstances, {
      instanceIds: [instanceId],
      verbose: true,
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
    .doAction(regionId, ACTION_NAMES.createInstances, params)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('createSuccessed')));
    });
  };
}

export function requestStartInstances(routerKey, regionId, instanceIds) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.startInstances, {
      instanceIds,
    })
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
    .doAction(regionId, ACTION_NAMES.stopInstances, {
      instanceIds,
    })
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
    .doAction(regionId, ACTION_NAMES.restartInstances, {
      instanceIds,
    })
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
    .doAction(regionId, ACTION_NAMES.deleteInstances, {
      instanceIds,
    })
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
    .doAction(regionId, ACTION_NAMES.modifyInstanceAttributes, {
      instanceId,
      name,
      description,
    })
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

export function requestResetInstances(routerKey, regionId, instanceIds, loginMode, loginPassword, keyPairId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.resetInstances, {
      instanceIds,
      loginMode,
      loginPassword,
      keyPairId,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('resetPending')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestResizeInstances(routerKey, regionId, instanceIds, instanceTypeId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.resizeInstances, {
      instanceIds,
      instanceTypeId,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('resizePending')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestConnectVNC(routerKey, regionId, instanceId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.connectVNC, {
      instanceId,
    })
    .promise
    .then((payload) => {
      const top = window.top.outerHeight / 4 + window.top.screenY;
      const left = window.top.outerWidth / 4 + window.top.screenX;
      const width = 740;
      const height = 430;

      const { host, port, token } = payload;
      const url = `/vnc/${host}/${port}/${token}`;
      const id = Math.random().toString(36).slice(2);

      const newWindow = window.open(url, id, `height=${height},width=${width},modal=yes,alwaysRaised=yes,top=${top},left=${left}`);

      if (newWindow) {
        newWindow.focus();
      }
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}


export function requestInstanceOutput(routerKey, regionId, instanceId) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.getInstanceOutput, {
      instanceId,
    })
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCaptureInstance(routerKey, regionId, instanceId, name) {
  return dispatch => {
    return IaaS
    .doAction(regionId, ACTION_NAMES.captureInstance, {
      instanceId,
      name,
    })
    .promise
    .then(() => {
      dispatch(notify(i18n.t('capturePending')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
