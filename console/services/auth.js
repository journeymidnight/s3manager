import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password) {
    return call('post', '/auth/authorize', {
      email,
      password,
    });
  }
  describeContext(token) {
    return call('post', '/auth/', {
      action: 'describeContext',
      token,
    });
  }
}

export default new Auth();
