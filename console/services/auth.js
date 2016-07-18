import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password, projectId) {
    return call('post', '/api/iam/authorize', {
      email,
      password,
      projectId,
    });
  }
  describeContext(token) {
    return call('post', '/api/iam/DescribeContext', {}, (options) => {
      options.headers['X-Le-Token'] = token;
    });
  }
  connectService(serviceKey, regionId) {
    return call('post', '/api/iam/ConnectService', {
      serviceKey,
      regionId,
    });
  }
  createAccessKey(name, description) {
    return call('post', '/api/iam/CreateAccessKey', {
      name,
      description,
    });
  }
  describeAccessKeys(filter = {}) {
    return call('post', '/api/iam/DescribeAccessKeys', filter);
  }
  deleteAccessKeys(accessKeys) {
    return call('post', '/api/iam/DeleteAccessKeys', {
      accessKeys,
    });
  }
}

export default new Auth();
