import { call as rawCall } from '../../shared/services/api';

export const projectRoleAdmin = 1;
export const projectRoleUser = 2;

class Boss {
  call(action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/${action}`, payload);
  }
  describeProjects(filters = {}) {
    return this.call('describeProjects', filters);
  }
  deleteProjects(filters = {}) {
    return this.call('deleteProjects', filters);
  }
  createProject(project) {
    return this.call('createProject', project);
  }
  modifyProject(project) {
    return this.call('modifyProjectAttributes', project);
  }
  describeProjectRoles(projectId) {
    return this.call('describeProjectRoles', {
      projectId,
    });
  }
  describeUserRoles(userId) {
    return this.call('describeUserRoles', {
      userId,
    });
  }
  createProjectRole(projectId, userId, role) {
    return this.call('createProjectRole', {
      projectId,
      userId,
      role,
    });
  }
  deleteProjectRole(projectId, userIds) {
    return this.call('deleteProjectRole', {
      projectId,
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
  describeProjectQuotas(filters = {}) {
    return this.call('describeProjectQuotas', filters);
  }
  assignProjectQuota(regionId, projectId, quota) {
    return this.call('assignProjectQuota', {
      regionId,
      projectId,
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
