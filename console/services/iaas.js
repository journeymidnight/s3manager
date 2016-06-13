import { call as rawCall } from '../../shared/services/api';

class IaaS {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/r/${regionId}/${action}`, payload);
  }
  describeKeyPairs(regionId, filter = {}) {
    return this.call(regionId, 'DescribeKeyPairs', filter);
  }
  createKeyPair(regionId, keyPair) {
    return this.call(regionId, 'CreateKeyPair', keyPair);
  }
  deleteKeyPairs(regionId, keyPairIds) {
    return this.call(regionId, 'DeleteKeyPairs', {
      keyPairIds,
    });
  }
  modifyKeyPairAttributes(regionId, keyPairId, name, description) {
    return this.call(regionId, 'ModifyKeyPairAttributes', {
      keyPairId,
      name,
      description,
    });
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
  createSubnet(regionId, subnet) {
    return this.call(regionId, 'CreateSubnet', subnet);
  }
  deleteSubnets(regionId, subnetIds) {
    return this.call(regionId, 'DeleteSubnets', {
      subnetIds,
    });
  }
  createNetwork(regionId, network) {
    return this.call(regionId, 'CreateNetwork', network);
  }
  deleteNetworks(regionId, networkIds) {
    return this.call(regionId, 'DeleteNetworks', {
      networkIds,
    });
  }
  modifyNetworkAttributes(regionId, networkId, name, description) {
    return this.call(regionId, 'ModifyNetworkAttributes', {
      networkId,
      name,
      description,
    });
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
