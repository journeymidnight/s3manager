import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password) {
    return call('post', '/boss/authorize', {
      email,
      password,
    });
  }
  describeContext(token) {
    return call('post', '/boss/', {
      action: 'describeContext',
      token,
    });
  }
}

export default new Auth();
