import { push } from 'react-router-redux';
import { notifyAlert, notify, extendContext } from './actions';
import IAM from '../services/iam';
import i18n from '../../shared/i18n';

export function requestDescribeProjects(routerKey, filters) {
  return dispatch => {
    return IAM
    .describeProjects(filters)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeProject(projectId) {
  return dispatch => {
    return IAM
    .describeProjects({
      projectIds: [projectId],
    })
    .promise
    .then((payload) => {
      dispatch(extendContext({
        project: payload.projectSet[0],
      }));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateProject(project) {
  return dispatch => {
    return IAM
    .createProject(project)
    .promise
    .then((res) => {
      dispatch(extendContext({
        project: {
          id: res.projectId,
        },
      }));
      dispatch(push('/projects'));
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestModifyProject(project) {
  return (dispatch) => {
    return IAM
    .modifyProject(project)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('updateSuccessed')));
      return dispatch(requestDescribeProject(project.projectId));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestCreateProjectRole(projectId, userId, role) {
  return (dispatch) => {
    return IAM
    .createProjectRole(projectId, userId, role)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('createSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteProjectRole(projectId, userIds) {
  return (dispatch) => {
    return IAM
    .deleteProjectRole(projectId, userIds)
    .promise
    .then(() => {
      dispatch(notify(i18n.t('deleteSuccessed')));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDescribeProjectRoles(projectId) {
  return (dispatch) => {
    return IAM
    .describeProjectRoles(projectId)
    .promise
    .then((payload) => {
      dispatch(extendContext(payload));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}

export function requestDeleteProjects(routerKey, projectIds) {
  return dispatch => {
    return IAM
    .deleteProjects(projectIds)
    .promise
    .then((payload) => {
      dispatch(notify(i18n.t('deleteSuccess')));
      dispatch(extendContext(payload, routerKey));
    })
    .catch((error) => {
      dispatch(notifyAlert(error.message));
    });
  };
}
