import { call as rawCall } from '../../shared/services/api';

export const tenantRoleAdmin = 1;
export const tenantRoleUser = 2;

class Boss {
  call(action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/${action}`, payload);
  }
  describeTenants(filters = {}) {
    return this.call('describeTenants', filters);
  }
  deleteTenants(filters = {}) {
    return this.call('deleteTenants', filters);
  }
  createTenant(tenant) {
    return this.call('createTenant', tenant);
  }
  modifyTenant(tenant) {
    return this.call('modifyTenantAttributes', tenant);
  }
  describeTenantRoles(tenantId) {
    return this.call('describeTenantRoles', {
      tenantId,
    });
  }
  describeUserRoles(userId) {
    return this.call('describeUserRoles', {
      userId,
    });
  }
  createTenantRole(tenantId, userId, role) {
    return this.call('createTenantRole', {
      tenantId,
      userId,
      role,
    });
  }
  deleteTenantRole(tenantId, userIds) {
    return this.call('deleteTenantRole', {
      tenantId,
      userIds,
    });
  }
  describeUsers(filters = {}) {
    return this.call('describeUsers', filters);
  }
  deleteUsers(userIds) {
    return this.call('deleteUsers', {
      userIds,
    });
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
  describeTenantQuotas(filters = {}) {
    return this.call('describeTenantQuotas', filters);
  }
  assignTenantQuota(regionId, tenantId, quota) {
    return this.call('assignTenantQuota', {
      regionId,
      tenantId,
      ...quota,
    });
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
