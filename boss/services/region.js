import { call as rawCall } from '../../shared/services/api';

class Region {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/r/${regionId}/${action}`, payload);
  }
}

export default new Region();
