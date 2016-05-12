import expect from 'expect';
import nock from 'nock';
import * as RegionActions from '../actions.region';
import * as ActionTypes from '../constants';
import { mockStore, mockRequest } from '../../../shared/__tests__/mock';
import i18n from '../../../shared/i18n';

const regionId = 'idA';
const name = 'nameA';
const opKeystoneEndpoint = 'opKeystoneEndpointA';
const opAdminName = 'opAdminNameA';
const opAdminPassword = 'opAdminPasswordA';

describe('RegionActions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('#requestDescribeRegions', (done) => {
    const rep = {
      totalCount: 9,
      regionSet: [{
        regionId,
        name,
        opKeystoneEndpoint,
        opAdminName,
      }],
    };

    const scope = mockRequest
    .post('/api/boss/', {
      action: 'describeRegions',
    })
    .reply(200, {
      data: rep,
      retCode: 0,
      message: null,
    });

    const store = mockStore();
    return store
    .dispatch(RegionActions.requestDescribeRegions())
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual([{
        payload: rep,
        type: ActionTypes.EXTEND_CONTEXT,
        routerKey: undefined,
      }]);
      done();
    })
    .catch((error) => {
      done(error);
    });
  });

  it('#requestCreateRegionError', (done) => {
    const scope = mockRequest
    .post('/api/boss/', {
      action: 'createRegion',
      name,
      opKeystoneEndpoint,
      opAdminName,
      opAdminPassword,
    })
    .reply(200, {
      retCode: 1100,
      message: 'Invalid',
      data: null,
    });

    const store = mockStore();
    return store
    .dispatch(RegionActions.requestCreateRegion({
      name,
      opKeystoneEndpoint,
      opAdminName,
      opAdminPassword,
    }))
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual([{
        payload: {
          notify: {
            message: 'Invalid',
            type: 'alert',
          },
        },
        type: ActionTypes.EXTEND_CONTEXT,
        routerKey: undefined,
      }]);
      done();
    })
    .catch((error) => {
      done(error);
    });
  });

  it('#requestCreateRegion', (done) => {
    const scope = mockRequest
    .post('/api/boss/', {
      action: 'createRegion',
      name,
      opKeystoneEndpoint,
      opAdminName,
      opAdminPassword,
    })
    .reply(200, {
      data: {
        regionId,
      },
      retCode: 0,
      message: null,
    });

    const store = mockStore();

    return store
    .dispatch(RegionActions.requestCreateRegion({
      name,
      opKeystoneEndpoint,
      opAdminName,
      opAdminPassword,
    }))
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual([{
        payload: {
          args: [
            '/regions',
          ],
          method: 'push',
        },
        type: '@@router/CALL_HISTORY_METHOD',
      }, {
        payload: {
          notify: {
            message: i18n.t('addSuccessed'),
            type: 'notice',
          },
        },
        type: ActionTypes.EXTEND_CONTEXT,
        routerKey: undefined,
      }]);
      done();
    })
    .catch((error) => {
      done(error);
    });
  });

  it('#requestModifyRegion', (done) => {
    const scope = mockRequest
    .post('/api/boss/', {
      action: 'modifyRegionAttributes',
      regionId,
      name,
    })
    .reply(200, {
      data: {},
      retCode: 0,
      message: null,
    });

    const rep = {
      totalCount: 9,
      regionSet: [{
        regionId,
        name,
        opKeystoneEndpoint,
      }],
    };

    const scope2 = mockRequest
    .post('/api/boss/', {
      action: 'describeRegions',
      regions: [regionId],
    })
    .reply(200, {
      data: rep,
      retCode: 0,
      message: null,
    });

    const expectedActions = [{
      payload: {
        notify: {
          message: i18n.t('saveSuccessed'),
          type: 'notice',
        },
      },
      type: ActionTypes.EXTEND_CONTEXT,
      routerKey: undefined,
    }, {
      payload: {
        region: rep.regionSet[0],
      },
      type: ActionTypes.EXTEND_CONTEXT,
      routerKey: undefined,
    }];

    const store = mockStore();

    return store
    .dispatch(RegionActions.requestModifyRegion({
      regionId,
      name,
    }))
    .then(() => {
      scope.isDone();
      scope2.isDone();
      expect(store.getActions()).toEqual(expectedActions);
      done();
    })
    .catch((error) => {
      done(error);
    });
  });

  it('#requestDescribeAssignedQuotas', () => {
    // TODO
  });

  it('#requestAssignTenantQuota', () => {
    // TODO
  });

  it('#requestDeleteTenantQuota', () => {
    // TODO
  });
});
