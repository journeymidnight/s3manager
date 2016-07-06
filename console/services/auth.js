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
    return call('post', '/api/iam/describeContext', {}, (options) => {
      options.headers['X-Le-Token'] = token;
    });
  }
  connectRegion(regionId) {
    return call('post', '/api/iam/connectRegion', {
      regionId,
    });
  }
  createAccessKey(name, description) {
    return call('post', '/api/iam/createAccessKey', {
      name,
      description,
    });
  }
  describeAccessKeys(filter = {}) {
    return call('post', '/api/iam/describeAccessKeys', filter);
  }
  deleteAccessKeys(accessKeys) {
    return call('post', '/api/iam/deleteAccessKeys', {
      accessKeys,
    });
  }
}

export default new Auth();
