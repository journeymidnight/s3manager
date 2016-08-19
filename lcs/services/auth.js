import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password, projectId) {
    return call('post', '/api/iam/authorize', {
      email,
      password,
      projectId,
    });
  }
  describeToken(token) {
    return call('post', '/api/iam/DescribeToken', {}, (options) => {
      options.headers['X-Le-Token'] = token;
    });
  }
  connectService(serviceKey, regionId) {
    return call('post', '/api/iam/ConnectService', {
      serviceKey,
      regionId,
    });
  }
}

export default new Auth();
