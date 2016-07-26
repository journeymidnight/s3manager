import { call as rawCall } from '../../shared/services/api';

class DevOps {
  call(region, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/s/${region.regionId}/${action}`, payload, (options) => {
      options.headers['X-Le-Endpoint'] = region.devopsEndpoint;
    });
  }

  getMonitorData(region) {
    return this.call(region, 'GetMonitorData', {
      endpoints: ['ceph'],
      metrics: ['osd_num'],
      start: '2016-07-15T16:53:46Z',
      sample_type: 'Average',
    });
  }
}

export default new DevOps();
