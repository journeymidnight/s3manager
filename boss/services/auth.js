import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password) {
    return call('post', '/api/authorize', {
      email,
      password,
    });
  }
  describeToken(token) {
    return call('post', '/api/DescribeToken', {}, (options) => {
      options.headers['X-Le-Token'] = token;
    });
  }
}

export default new Auth();
