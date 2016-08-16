import { call as rawCall } from '../../shared/services/api';

class IaaS {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/r/${regionId}/${action}`, payload);
  }
  doAction(regionId, actionName, data) {
    return this.call(regionId, actionName, data);
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
