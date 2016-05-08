import { call as rawCall } from '../../shared/services/api';

class Boss {
  call(action, params) {
    const payload = Object.assign(params, {
      action,
    });

    return rawCall('post', '/boss/', payload);
  }
  describeTenants(filters = {}) {
    return this.call('describeTenants', filters);
  }
  createTenant(tenant) {
    return this.call('createTenant', tenant);
  }
  modifyTenant(tenant) {
    return this.call('modifyTenant', tenant);
  }
}

export default new Boss();
