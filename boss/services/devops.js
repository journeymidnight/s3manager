import { call as rawCall } from '../../shared/services/api';

class DevOps {
  call(region, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/s/${region.regionId}/${action}`, payload, (options) => {
      options.headers['X-Le-Endpoint'] = region.devopsEndpoint;
    });
  }

  getMonitorData(region, params) {
    return this.call(region, 'GetMonitorData', params);
  }

  describeAlerts(region, filters = {}) {
    return this.call(region, 'DescribeAlarms', filters);
  }
}

export default new DevOps();
