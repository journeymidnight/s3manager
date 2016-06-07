import { call as rawCall } from '../../shared/services/api';

class IaaS {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/proxy/r/${regionId}/${action}`, payload);
  }
  describeKeyPairs(regionId, filter = {}) {
    return this.call(regionId, 'DescribeKeyPairs', filter);
  }
  createKeyPair(regionId, keyPair) {
    return this.call(regionId, 'CreateKeyPair', keyPair);
  }
  describeEips(regionId, filter = {}) {
    return this.call(regionId, 'DescribeEips', filter);
  }
  allocateEips(regionId, eip) {
    return this.call(regionId, 'AllocateEips', eip);
  }
  describeNetworks(regionId, filter = {}) {
    return this.call(regionId, 'DescribeNetworks', filter);
  }
  describeSubnets(regionId, filter = {}) {
    return this.call(regionId, 'DescribeSubnets', filter);
  }
  createNetwork(regionId, keyPair) {
    return this.call(regionId, 'CreateNetwork', keyPair);
  }
  describeImages(regionId) {
    return this.call(regionId, 'describeImages', {});
  }
  describeInstanceTypes(regionId) {
    return this.call(regionId, 'describeInstanceTypes', {});
  }
  describeInstances(regionId, filter = {}) {
    return this.call(regionId, 'describeInstances', filter);
  }
  createInstances(regionId, params) {
    return this.call(regionId, 'createInstances', params);
  }
  startInstances(regionId, instances) {
    return this.call(regionId, 'startInstances', {
      instances,
    });
  }
  stopInstances(regionId, instances) {
    return this.call(regionId, 'stopInstances', {
      instances,
    });
  }
}

export default new IaaS();
