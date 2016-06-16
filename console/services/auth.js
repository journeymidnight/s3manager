import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password, tenantId) {
    return call('post', '/api/iam/authorize', {
      email,
      password,
      tenantId,
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
}

export default new Auth();
