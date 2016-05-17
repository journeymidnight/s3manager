import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password) {
    return call('post', '/boss/authorize', {
      email,
      password,
    });
  }
  describeContext(token) {
    return call('post', '/boss/describeContext', {}, (options) => {
      options.headers['X-Le-Token'] = token;
    });
  }
}

export default new Auth();
