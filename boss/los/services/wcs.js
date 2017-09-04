import { call as rawCall } from '../../../shared/services/api';

class Wcs {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    payload.regionId = regionId;
    return rawCall('post', `/losapi/${action}`, payload, undefined, true);
  }
  doAction(regionId, actionName, data) {
    return this.call(regionId, actionName, data);
  }
}

export const ACTION_NAMES = {
  createbucket: 'CreateBucket',
  deletebucket: 'DeleteBucket',
  putcors: 'PutCors',
  listbuckets: 'ListBuckets',
  getusagebyhour: 'GetUsageByHour',
  getopbyhour: 'GetOpByHour',
  getflowbyhour: 'GetFlowByHour',
  getstaticsbyday: 'GetStaticsByDay',
  gets3domain: 'GetS3Domain',
  getbucketstats: 'GetBucketStats',
};

export default new Wcs();
