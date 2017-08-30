import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password, projectId) {
    return call('post', '/iamapi', {
      action: 'ConnectService',
      email,
      password,
      projectId,
    }, undefined, true);
  }
  describeToken(token) {
    return call('post', '/api/DescribeToken', {}, (options) => {
      options.headers['X-IAM-Token'] = token;
    });
  }

  createAccessKey(projectId, name, description) {
    return call('post', '/iamapi/CreateAccessKey', {
      projectId,
      name,
      description,
    }, undefined, true);
  }
  describeAccessKeys(filter = {}, projectId) {
    return call('post', '/iamapi/ListAccessKeysByProject', filter, undefined, true, projectId);
  }

  describeAutogenAccessKeys(filter = {}, projectId) {
    return call('post', '/iamapi/GetAutogenkeysByProjectId', filter, undefined, true, projectId);
  }

  deleteAccessKeys(accessKeys) {
    return call('post', '/iamapi/DeleteAccessKey', {
      accessKeys,
    }, undefined, true);
  }
}

export default new Auth();
