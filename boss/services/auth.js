import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password) {
    return call('post', '/iamapi', {
      action: 'ConnectService',
      email,
      password
    },undefined, true);
  }
  describeToken(token) {
    return call('post', '/api/DescribeToken', {}, (options) => {
      options.headers['X-IAM-Token'] = token;
    });
  }

  createAccessKey(name, description) {
    return call('post', '/iamapi/CreateAccessKey', {
      name,
      description,
    }, undefined, true);
  }
  describeAccessKeys(filter = {}) {
    return call('post', '/iamapi/DescribeAccessKeysWithToken', filter, undefined, true);
  }
  deleteAccessKeys(accessKeys) {
    return call('post', '/iamapi/DeleteAccessKey', {
      accessKeys,
    }, undefined, true);
  }
}

export default new Auth();
