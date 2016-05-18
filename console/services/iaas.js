import { call as rawCall } from '../../shared/services/api';

class IaaS {
  call(action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/iaas/${action}`, payload);
  }
  describeRegions() {
    return this.call('describeRegions', {});
  }
}

export default new IaaS();
