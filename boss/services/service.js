import { call as rawCall } from '../../shared/services/api';

class Service {
  call(service, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/s/${service}/${action}`, payload, (options) => {
      options.headers['X-Le-Endpoint'] = service.manageEndpoint;
    });
  }

  describeInstanceTypes(service, filters = {}) {
    return this.call(service, 'DescribeInstanceTypes', filters);
  }
  createInstanceType(service, instanceType) {
    return this.call(service, 'CreateInstanceType', instanceType);
  }
  generateInstanceTypes(service) {
    return this.call(service, 'GenerateInstanceTypes');
  }
  deleteInstanceTypes(service, instanceTypeIds) {
    return this.call(service, 'DeleteInstanceTypes', {
      instanceTypeIds,
    });
  }

  describeImages(service, filters = {}) {
    return this.call(service, 'DescribeImages', filters);
  }
  syncImages(service) {
    return this.call(service, 'SyncImages');
  }
  deleteImages(service, imageIds) {
    return this.call(service, 'DeleteImages', {
      imageIds,
    });
  }
  modifyImageAttributes(service, image) {
    return this.call(service, 'ModifyImageAttributes', image);
  }
}

export default new Service();
