import { push } from 'react-router-redux';
import { notify, notifyAlert, extendContext } from './actions';
import IaaS from '../services/iaas';
import i18n from '../../shared/i18n';

export function requestDescribePrerequisites(routerKey, regionId) {
  return dispatch => {
    return IaaS
    .describeInstanceTypes(regionId, {
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
      .describeImages(regionId, {
        status: ['active'],
        isPublic: true,
        limit: 100,
      })
      .promise;
    })
    .then((payload) => {
      dispatch(extendContext({
        imageSet: payload.imageSet,
      }, routerKey));

      return IaaS
      .describeNetworks(regionId, {
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
      .describeKeyPairs(regionId, {
        status: ['active'],
        limit: 100,
        verbose: true,
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

export function requestResetInstances(routerKey, regionId, instanceIds) {
  return dispatch => {
    return IaaS
    .resetInstances(regionId, instanceIds)
    .promise
    .then(() => {
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestResizeInstances(routerKey, regionId, instanceIds) {
  return dispatch => {
    return IaaS
    .resizeInstances(regionId, instanceIds)
    .promise
    .then(() => {
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestConnectVNC(routerKey, regionId, instanceId) {
  return dispatch => {
    return IaaS
    .connectVNC(regionId, instanceId)
    .promise
    .then((payload) => {
      const top = window.top.outerHeight / 4 + window.top.screenY;
      const left = window.top.outerWidth / 4 + window.top.screenX;
      const width = 737;
      const height = 425;

      const { host, port, token } = payload;
      const url = `/vnc/${host}/${port}/${token}`;
      const id = Math.random().toString(36).slice(2);

      const newWindow = window.open(url, id, `height=${height},width=${width},modal=yes,alwaysRaised=yes,top=${top},left=${left}`);

      if (window.focus) {
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
    .getInstanceOutput(regionId, instanceId)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
