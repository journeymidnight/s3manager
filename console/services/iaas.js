import { call as rawCall } from '../../shared/services/api';

class IaaS {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/r/${regionId}/${action}`, payload);
  }
  doAction(regionId, actionName, data) {
    return this.call(regionId, actionName, data);
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
  updateBandwidth(regionId, eipIds, bandwidth) {
    return this.call(regionId, 'UpdateBandwidth', {
      eipIds,
      bandwidth,
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
  deleteImages(regionId, imageIds) {
    return this.call(regionId, 'DeleteImages', {
      imageIds,
    });
  }
  modifyImageAttributes(regionId, imageId, name, description) {
    return this.call(regionId, 'ModifyImageAttributes', {
      imageId,
      name,
      description,
    });
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
  setExternalGateway(regionId, networkIds) {
    return this.call(regionId, 'SetExternalGateway', {
      networkIds,
    });
  }
  unsetExternalGateway(regionId, networkIds) {
    return this.call(regionId, 'UnsetExternalGateway', {
      networkIds,
    });
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
  resetInstances(regionId, instanceIds, loginMode, loginPassword, keyPairId) {
    return this.call(regionId, 'ResetInstances', {
      instanceIds,
      loginMode,
      loginPassword,
      keyPairId,
    });
  }
  resizeInstances(regionId, instanceIds, instanceTypeId) {
    return this.call(regionId, 'ResizeInstances', {
      instanceIds,
      instanceTypeId,
    });
  }
  captureInstance(regionId, instanceId, name) {
    return this.call(regionId, 'CaptureInstance', {
      instanceId,
      name,
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
  describeSnapshots(regionId, filter = {}) {
    return this.call(regionId, 'DescribeSnapshots', filter);
  }
  createSnapshots(regionId, snapshot) {
    return this.call(regionId, 'CreateSnapshots', snapshot);
  }
  deleteSnapshots(regionId, snapshotIds) {
    return this.call(regionId, 'DeleteSnapshots', {
      snapshotIds,
    });
  }
  modifySnapshotAttributes(regionId, snapshotId, name, description) {
    return this.call(regionId, 'ModifySnapshotAttributes', {
      snapshotId,
      name,
      description,
    });
  }
  describeJobs(regionId, filter = {}) {
    return this.call(regionId, 'DescribeJobs', filter);
  }
  describeOperations(regionId, filter = {}) {
    return this.call(regionId, 'DescribeOperations', filter);
  }
  describeQuotas(regionId) {
    return this.call(regionId, 'DescribeQuotas');
  }
  describePortForwardings(regionId, filter = {}) {
    return this.call(regionId, 'DescribePortForwardings', filter);
  }
  createPortForwarding(regionId, portForwarding) {
    return this.call(regionId, 'CreatePortForwarding', portForwarding);
  }
  deletePortForwardings(regionId, portForwardingIds) {
    return this.call(regionId, 'DeletePortForwardings', {
      portForwardingIds,
    });
  }
}

export const ACTION_NAMES = {
  describeKeyPairs: 'DescribeKeyPairs',
  createKeyPair: 'CreateKeyPair',
  deleteKeyPairs: 'DeleteKeyPairs',
  modifyKeyPairAttributes: 'ModifyKeyPairAttributes',
  describeVolumes: 'DescribeVolumes',
  createVolumes: 'CreateVolumes',
  deleteVolumes: 'DeleteVolumes',
  modifyVolumeAttributes: 'ModifyVolumeAttributes',
  attachVolume: 'AttachVolume',
  detachVolumes: 'DetachVolumes',
  resizeVolumes: 'ResizeVolumes',
  describeEips: 'DescribeEips',
  allocateEips: 'AllocateEips',
  releaseEips: 'ReleaseEips',
  associateEip: 'AssociateEip',
  dissociateEips: 'DissociateEips',
  updateBandwidth: 'UpdateBandwidth',
  modifyEipAttributes: 'ModifyEipAttributes',
  describeImages: 'DescribeImages',
  deleteImages: 'DeleteImages',
  modifyImageAttributes: 'ModifyImageAttributes',
  describeNetworks: 'DescribeNetworks',
  describeSubnets: 'DescribeSubnets',
  createSubnet: 'CreateSubnet',
  DeleteSubnets: 'DeleteSubnets',
  createNetwork: 'CreateNetwork',
  setExternalGateway: 'SetExternalGateway',
  unsetExternalGateway: 'UnsetExternalGateway',
  deleteNetworks: 'DeleteNetworks',
  modifyNetworkAttributes: 'ModifyNetworkAttributes',
  describeInstanceTypes: 'DescribeInstanceTypes',
  describeInstances: 'DescribeInstances',
  createInstances: 'CreateInstances',
  modifyInstanceAttributes: 'ModifyInstanceAttributes',
  startInstances: 'StartInstances',
  stopInstances: 'StopInstances',
  restartInstances: 'RestartInstances',
  resetInstances: 'ResetInstances',
  resizeInstances: 'ResizeInstances',
  captureInstance: 'CaptureInstance',
  deleteInstances: 'DeleteInstances',
  connectVNC: 'ConnectVNC',
  getInstanceOutput: 'GetInstanceOutput',
  getMonitor: 'GetMonitor',
  describeSnapshots: 'DescribeSnapshots',
  createSnapshots: 'CreateSnapshots',
  deleteSnapshots: 'DeleteSnapshots',
  modifySnapshotAttributes: 'ModifySnapshotAttributes',
  describeJobs: 'DescribeJobs',
  describeOperations: 'DescribeOperations',
  describeQuotas: 'DescribeQuotas',
  describePortForwardings: 'DescribePortForwardings',
  createPortForwarding: 'CreatePortForwarding',
  deletePortForwardings: 'DeletePortForwardings',
};
export default new IaaS();
