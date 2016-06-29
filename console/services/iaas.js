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
  describeVolumes(regionId, filter = {}) {
    return this.call(regionId, 'DescribeVolumes', filter);
  }
  createVolume(regionId, volume) {
    return this.call(regionId, 'CreateVolumes', volume);
  }
  deleteVolumes(regionId, volumeIds) {
    return this.call(regionId, 'DeleteVolumes', {
      volumeIds,
    });
  }
  modifyVolumeAttributes(regionId, volumeId, name, description) {
    return this.call(regionId, 'ModifyVolumeAttributes', {
      volumeId,
      name,
      description,
    });
  }
  attachVolume(regionId, volumeId, instanceId, mountpoint, mode) {
    return this.call(regionId, 'AttachVolume', {
      volumeId,
      instanceId,
      mountpoint,
      mode,
    });
  }
  detachVolumes(regionId, volumeIds, instanceId) {
    return this.call(regionId, 'DetachVolumes', {
      volumeIds,
      instanceId,
    });
  }
  resizeVolumes(regionId, volumeIds, size) {
    return this.call(regionId, 'ResizeVolumes', {
      volumeIds,
      size,
    });
  }
  describeEips(regionId, filter = {}) {
    return this.call(regionId, 'DescribeEips', filter);
  }
  allocateEips(regionId, eip) {
    return this.call(regionId, 'AllocateEips', eip);
  }
  releaseEips(regionId, eipIds) {
    return this.call(regionId, 'ReleaseEips', {
      eipIds,
    });
  }
  associateEip(regionId, eipId, instanceId) {
    return this.call(regionId, 'AssociateEip', {
      eipId,
      instanceId,
    });
  }
  dissociateEips(regionId, eipIds) {
    return this.call(regionId, 'DissociateEips', {
      eipIds,
    });
  }
  modifyEipAttributes(regionId, eipId, name, description) {
    return this.call(regionId, 'ModifyEipAttributes', {
      eipId,
      name,
      description,
    });
  }
  describeImages(regionId, filter = {}) {
    return this.call(regionId, 'DescribeImages', filter);
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
  describeInstanceTypes(regionId, filter = {}) {
    return this.call(regionId, 'DescribeInstanceTypes', filter);
  }
  describeInstances(regionId, filter = {}) {
    return this.call(regionId, 'DescribeInstances', filter);
  }
  createInstances(regionId, params) {
    return this.call(regionId, 'CreateInstances', params);
  }
  modifyInstanceAttributes(regionId, instanceId, name, description) {
    return this.call(regionId, 'ModifyInstanceAttributes', {
      instanceId,
      name,
      description,
    });
  }
  startInstances(regionId, instanceIds) {
    return this.call(regionId, 'StartInstances', {
      instanceIds,
    });
  }
  stopInstances(regionId, instanceIds) {
    return this.call(regionId, 'StopInstances', {
      instanceIds,
    });
  }
  restartInstances(regionId, instanceIds) {
    return this.call(regionId, 'RestartInstances', {
      instanceIds,
    });
  }
  resetInstances(regionId, instanceIds) {
    return this.call(regionId, 'ResetInstances', {
      instanceIds,
    });
  }
  resizeInstances(regionId, instanceIds) {
    return this.call(regionId, 'ResizeInstances', {
      instanceIds,
    });
  }
  deleteInstances(regionId, instanceIds) {
    return this.call(regionId, 'DeleteInstances', {
      instanceIds,
    });
  }
  connectVNC(regionId, instanceId) {
    return this.call(regionId, 'ConnectVNC', {
      instanceId,
    });
  }
  getInstanceOutput(regionId, instanceId) {
    return this.call(regionId, 'GetInstanceOutput', {
      instanceId,
    });
  }
  getMonitor(regionId, resourceId, metric, period) {
    return this.call(regionId, 'GetMonitor', {
      resourceId,
      metric,
      period,
    });
  }
}

export default new IaaS();
