import { call as rawCall } from '../../shared/services/api';

class BOSS {
  call(action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/${action}`, payload);
  }
  describeAdmins(filters = {}) {
    return this.call('DescribeAdmins', filters);
  }
  createAdmin(admin) {
    return this.call('CreateAdmin', admin);
  }
  modifyAdmin(admin) {
    return this.call('ModifyAdminAttributes', admin);
  }
}

export default new BOSS();
