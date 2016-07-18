import { call as rawCall } from '../../shared/services/api';

class Region {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/r/${regionId}/${action}`, payload);
  }

  describeInstanceTypes(regionId, filters = {}) {
    return this.call(regionId, 'DescribeInstanceTypes', filters);
  }
  createInstanceType(regionId, instanceType) {
    return this.call(regionId, 'CreateInstanceType', instanceType);
  }
  generateInstanceTypes(regionId) {
    return this.call(regionId, 'GenerateInstanceTypes');
  }
  deleteInstanceTypes(regionId, instanceTypeIds) {
    return this.call(regionId, 'DeleteInstanceTypes', {
      instanceTypeIds,
    });
  }

  describeImages(regionId, filters = {}) {
    return this.call(regionId, 'DescribeImages', filters);
  }
  syncImages(regionId) {
    return this.call(regionId, 'SyncImages');
  }
  deleteImages(regionId, imageIds) {
    return this.call(regionId, 'DeleteImages', {
      imageIds,
    });
  }
  modifyImageAttributes(regionId, image) {
    return this.call(regionId, 'ModifyImageAttributes', image);
  }
}

export default new Region();
