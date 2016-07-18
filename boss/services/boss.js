import { call as rawCall } from '../../shared/services/api';

export const projectRoleAdmin = 1;
export const projectRoleUser = 2;

class Boss {
  call(action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/iam/${action}`, payload);
  }
  describeProjects(filters = {}) {
    return this.call('DescribeProjects', filters);
  }
  deleteProjects(filters = {}) {
    return this.call('DeleteProjects', filters);
  }
  createProject(project) {
    return this.call('CreateProject', project);
  }
  modifyProject(project) {
    return this.call('ModifyProjectAttributes', project);
  }
  describeProjectRoles(projectId) {
    return this.call('DescribeProjectRoles', {
      projectId,
    });
  }
  describeUserRoles(userId) {
    return this.call('DescribeUserRoles', {
      userId,
    });
  }
  createProjectRole(projectId, userId, role) {
    return this.call('CreateProjectRole', {
      projectId,
      userId,
      role,
    });
  }
  deleteProjectRole(projectId, userIds) {
    return this.call('DeleteProjectRole', {
      projectId,
      userIds,
    });
  }
  describeUsers(filters = {}) {
    return this.call('DescribeUsers', filters);
  }
  deleteUsers(userIds) {
    return this.call('DeleteUsers', {
      userIds,
    });
  }
  createUser(user) {
    return this.call('CreateUser', user);
  }
  modifyUser(user) {
    return this.call('ModifyUserAttributes', user);
  }
  describeRegions(filters = {}) {
    return this.call('DescribeRegions', filters);
  }
  createRegion(region) {
    return this.call('CreateRegion', region);
  }
  modifyRegion(region) {
    return this.call('ModifyRegionAttributes', region);
  }
  describeProjectQuotas(filters = {}) {
    return this.call('DescribeProjectQuotas', filters);
  }
  assignProjectQuota(regionId, projectId, quota) {
    return this.call('AssignProjectQuota', {
      regionId,
      projectId,
      ...quota,
    });
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

export default new Boss();
