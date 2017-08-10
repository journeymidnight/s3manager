import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password) {
    return call('post', '/iamapi', {
      action: 'ConnectService',
      user: 'root',
      password: 'admin',
    },undefined, true);
  }
  describeToken(token) {
    return call('post', '/api/DescribeToken', {}, (options) => {
      options.headers['X-IAM-Token'] = token;
    });
  }
}

export default new Auth();
