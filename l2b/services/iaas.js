import { call as rawCall } from '../../shared/services/api';

class IaaS {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/r/${regionId}/${action}`, payload);
  }

  doAction(regionId, actionName, data) {
    const promise = this.call(regionId, actionName, data).promise;
    return { promise };
  }
}

export const ACTION_NAMES = {
  describeLoadBalancers: 'DescribeLoadBalancers',
  deleteLoadBalancers: 'DeleteLoadBalancers',
  describeNetworks: 'DescribeNetworks',
  createLoadBalancer: 'CreateLoadBalancer',
};
export default new IaaS();
