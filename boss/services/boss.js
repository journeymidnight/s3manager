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
    return this.call('modifyTenantAttributes', tenant);
  }
  describeUsers(filters = {}) {
    return this.call('describeUsers', filters);
  }
  createUser(user) {
    return this.call('createUser', user);
  }
  modifyUser(user) {
    return this.call('modifyUserAttributes', user);
  }
  describeRegions(filters = {}) {
    return this.call('describeRegions', filters);
  }
  createRegion(region) {
    return this.call('createRegion', region);
  }
  modifyRegion(region) {
    return this.call('modifyRegionAttributes', region);
  }
  describeAdmins(filters = {}) {
    return this.call('describeAdmins', filters);
  }
  createAdmin(admin) {
    return this.call('createAdmin', admin);
  }
  modifyAdmin(admin) {
    return this.call('modifyAdminAttributes', admin);
  }
}

export default new Boss();
