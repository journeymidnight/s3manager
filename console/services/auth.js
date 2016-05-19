import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password) {
    return call('post', '/proxy/iam/authorize', {
      email,
      password,
    });
  }
  describeContext(token) {
    return call('post', '/proxy/iam/describeContext', {}, (options) => {
      options.headers['X-Le-Token'] = token;
    });
  }
  describeRegions(regionId) {
    return call('post', '/proxy/iam/describeRegions', {
      regions: [regionId],
    });
  }
}

export default new Auth();
