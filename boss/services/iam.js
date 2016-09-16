import { call as rawCall } from '../../shared/services/api';

export const projectRoleAdmin = 1;
export const projectRoleUser = 2;

export const serviceKeyLCS = 'lcs';
export const serviceKeyLOS = 'los';

class IAM {
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
    return this.call('DeleteProjectRoles', {
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
  describeServices(filters = {}) {
    return this.call('DescribeServices', filters);
  }
  createService(service) {
    return this.call('CreateService', service);
  }
  modifyService(service) {
    return this.call('ModifyServiceAttributes', service);
  }
  deleteServices(serviceIds) {
    return this.call('DeleteServices', {
      serviceIds,
    });
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
  deleteRegions(regionIds) {
    return this.call('DeleteRegions', {
      regionIds,
    });
  }
  describeQuotas(filters = {}) {
    return this.call('DescribeQuotas', filters);
  }
  assignQuota(serviceKey, regionId, projectId, quota) {
    return this.call('AssignQuota', {
      serviceKey,
      regionId,
      projectId,
      quota,
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

export default new IAM();
