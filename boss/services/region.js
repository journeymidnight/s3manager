import { call as rawCall } from '../../shared/services/api';

class Region {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/r/${regionId}/${action}`, payload);
  }
  describeImages(regionId, filters = {}) {
    return this.call(regionId, 'describeImages', filters);
  }
  syncImages(regionId, filters = {}) {
    return this.call(regionId, 'syncImages', filters);
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
