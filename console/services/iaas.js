import { call as rawCall } from '../../shared/services/api';

class IaaS {
  call(action, params) {
    const payload = Object.assign(params, {
      action,
    });

    return rawCall('post', '/iaas/', payload);
  }
  describeRegions() {
    return this.call('describeRegions', {});
  }
}

export default new IaaS();
