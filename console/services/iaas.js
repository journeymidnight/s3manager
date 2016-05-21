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
  describeNetworks(regionId) {
    return this.call(regionId, 'describeNetworks', {});
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
  describeInstances(regionId) {
    return this.call(regionId, 'describeInstances', {});
  }
  createInstance(regionId, instance) {
    return this.call(regionId, 'createInstance', instance);
  }
}

export default new IaaS();
