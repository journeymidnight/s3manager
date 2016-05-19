import { call as rawCall } from '../../shared/services/api';

class IaaS {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/proxy/r/${regionId}/${action}`, payload);
  }
  describeKeyPairs(regionId) {
    return this.call(regionId, 'describeKeyPairs', {});
  }
}

export default new IaaS();
