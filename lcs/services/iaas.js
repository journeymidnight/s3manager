import { call as rawCall } from '../../shared/services/api';
import { serverErrorHandler } from './ErrorService';

class IaaS {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/r/${regionId}/${action}`, payload);
  }

  doAction(regionId, actionName, data) {
    const promise = this.call(regionId, actionName, data)
      .promise
      .catch((error) => {
        serverErrorHandler(error);
        throw error;
      });
    return { promise };
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
  resizeVolumes: 'ExtendVolumes',
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
  deleteSubnets: 'DeleteSubnets',
  createNetwork: 'CreateNetwork',
  setExternalGateway: 'SetExternalGateway',
  unsetExternalGateway: 'UnsetExternalGateway',
  deleteNetworks: 'DeleteNetworks',
  modifyNetworkAttributes: 'ModifyNetworkAttributes',
  updateExternalGatewayBandwidth: 'UpdateExternalGatewayBandwidth',
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
  changePassword: 'ChangePassword',
  changeKeyPair: 'ChangeKeyPair',
};
export default new IaaS();
