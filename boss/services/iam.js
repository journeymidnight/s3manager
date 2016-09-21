import { call as rawCall } from '../../shared/services/api';

export const projectRoleAdmin = 1;
export const projectRoleUser = 2;

export const serviceKeyLCS = 'lcs';
export const serviceKeyLOS = 'los';

export const cnNorth1 = 'cn-north-1';
export const cnNorth2 = 'cn-north-2';
export const cnEast1 = 'cn-east-1';
export const cnEast2 = 'cn-east-2';
export const cnSouth1 = 'cn-south-1';
export const cnSouth2 = 'cn-south-2';
export const apHongkong1 = 'ap-hongkong-1';
export const usWest1 = 'us-west-1';
export const usEast1 = 'us-east-1';
export const cnTest1 = 'cn-Test-1';
export const cnTest2 = 'cn-Test-2';

class IAM {
  call(action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/iam/${action}`, payload);
  }
  describeProjects(filters = {}) {
    return this.call('DescribeProjects', filters);
  }
  createProject(project) {
    return this.call('CreateProject', project);
  }
  modifyProject(project) {
    return this.call('ModifyProjectAttributes', project);
  }
  deleteProjects(projectIds) {
    return this.call('DeleteProjects', {
      projectIds,
    });
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
  activeUsers(userIds) {
    return this.call('ActiveUsers', {
      userIds,
    });
  }
  deactiveUsers(userIds) {
    return this.call('DeactiveUsers', {
      userIds,
    });
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
  deleteQuotas(serviceKey, regionId, projectIds) {
    return this.call('DeleteQuotas', {
      projectIds,
      services: [{
        serviceKey,
        regionId,
      }],
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
