import { call as rawCall } from '../../shared/services/api';

class IaaS {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/proxy/r/${regionId}/${action}`, payload);
  }
  describeKeyPairs(regionId) {
    return this.call(regionId, 'describeKeyPairs', {});
  }
  createKeyPair(regionId, keyPair) {
    return this.call(regionId, 'createKeyPair', keyPair);
  }
  describeNetworks(regionId, filter = {}) {
    return this.call(regionId, 'describeNetworks', filter);
  }
  describeSubnets(regionId, filter = {}) {
    return this.call(regionId, 'describeSubnets', filter);
  }
  createNetwork(regionId, keyPair) {
    return this.call(regionId, 'createNetwork', keyPair);
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
