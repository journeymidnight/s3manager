import { call as rawCall } from '../../shared/services/api';

class Wcs {
  call(regionId, action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/r/${regionId}/${action}`, payload);
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
  getuserinfo: 'getusageinfo',
  getusagebyhour: 'GetUsageByHour',
  getopbyhour: 'GetOpByHour',
  getflowbyhour: 'GetFlowByHour',
  getstaticsbyday: 'GetStaticsByDay',
  gets3domain: 'GetS3Domain',
};

export default new Wcs();
