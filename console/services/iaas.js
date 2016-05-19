import { call as rawCall } from '../../shared/services/api';

class IaaS {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/proxy/r/${regionId}/${action}`, payload);
  }
  describeRegions(regionId) {
    return this.call(regionId, 'describeRegions', {});
  }
}

export default new IaaS();
