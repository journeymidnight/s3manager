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
export const cnTest1 = 'cn-test-1';
export const cnTest2 = 'cn-test-2';

class IAM {
  call(action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', action, payload, undefined, true);
  }

  authorize(email, password) {
    return rawCall('post', '/iamapi', {
      action: 'ConnectService',
      email,
      password
    }, undefined, true);
  }

  describeProjects(filters = {}) {
    return this.call('/iamapi/ListProjects', filters); //turn to ListProjects for iamapi
  }
  createProject(project) {
    return this.call('/iamapi/CreateProject', project);
  }
  modifyProject(project) {
    return this.call('/iamapi/ModifyProjectAttributes', project);
  }
  deleteProjects(projectIds) {
    return this.call('/iamapi/DeleteProjects', { //only support delete single project for now
      projectIds,
    });
  }
  describeProjectRoles(projectId) {
    return this.call('/iamapi/DescribeProjectRoles', {
      projectId,
    });
  }
  describeUserRoles(userId) {
    return this.call('/iamapi/DescribeUserRoles', {
      userId,
    });
  }
  createProjectRole(projectId, userId, role) {
    return this.call('/iamapi/CreateProjectRole', {
      projectId,
      userId,
      role,
    });
  }
  deleteProjectRole(projectId, userIds) {
    return this.call('/iamapi/DeleteProjectRoles', {
      projectId,
      userIds,
    });
  }

  describeUsers(filters = {}) {
    return this.call('/iamapi/ListAccounts', filters);
  }
  describeUser(filters = {}) {
    return this.call('/iamapi/DescribeAccount', filters);
  }

  deleteUsers(userIds) {
    return this.call('/iamapi/DeleteAccount', {
      userIds,
    });
  }
  createUser(user) {
    return this.call('/iamapi/CreateAccount', user);
  }
  activeUsers(userIds) {
    return this.call('/iamapi/ActivateAccount', {
      userIds,
    });
  }
  deactiveUsers(userIds) {
    return this.call('/iamapi/DeactivateAccount', {
      userIds,
    });
  }
  modifyUser(user) {
    return this.call('ModifyUserAttributes', user);
  }
  describeServices(filters = {}) {
    return this.call('/iamapi/DescribeServices', filters);
  }
  createService(service) {
    return this.call('/iamapi/CreateService', service);
  }
  modifyService(service) {
    return this.call('/iamapi/ModifyServiceAttributes', service);
  }
  deleteServices(serviceIds) {
    return this.call('/iamapi/DeleteServices', {
      serviceIds,
    });
  }
  describeRegions(filters = {}) {
    return this.call('/iamapi/DescribeRegions', filters);
  }
  createRegion(region) {
    return this.call('/iamapi/CreateRegion', region);
  }
  modifyRegion(region) {
    return this.call('/iamapi/ModifyRegionAttributes', region);
  }
  deleteRegions(regionIds) {
    return this.call('/iamapi/DeleteRegions', {
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
