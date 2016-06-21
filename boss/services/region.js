import { call as rawCall } from '../../shared/services/api';

class Region {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/r/${regionId}/${action}`, payload);
  }

  describeInstanceTypes(regionId, filters = {}) {
    return this.call(regionId, 'describeInstanceTypes', filters);
  }
  createInstanceType(regionId, instanceType) {
    return this.call(regionId, 'createInstanceType', instanceType);
  }
  generateInstanceTypes(regionId) {
    return this.call(regionId, 'generateInstanceTypes');
  }
  deleteInstanceTypes(regionId, instanceTypeIds) {
    return this.call(regionId, 'deleteInstanceTypes', {
      instanceTypeIds,
    });
  }

  describeImages(regionId, filters = {}) {
    return this.call(regionId, 'describeImages', filters);
  }
  syncImages(regionId) {
    return this.call(regionId, 'syncImages');
  }
  deleteImages(regionId, imageIds) {
    return this.call(regionId, 'deleteImages', {
      imageIds,
    });
  }
  modifyImageAttributes(regionId, image) {
    return this.call(regionId, 'modifyImageAttributes', image);
  }
}

export default new Region();
