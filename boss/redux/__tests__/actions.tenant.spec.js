import expect from 'expect';
import nock from 'nock';
import * as TenantActions from '../actions.tenant';
import * as ActionTypes from '../constants';
import { mockStore, mockRequest } from '../../../shared/__tests__/mock';
import i18n from '../../../shared/i18n';

const tenantId = 'idA';
const name = 'nameA';
const description = 'descriptionA';

describe('TenantActions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('#requestDescribeTenants', (done) => {
    const rep = {
      totalCount: 9,
      tenantSet: [{
        tenantId,
        name,
      }],
    };

    const scope = mockRequest
    .post('/api/boss/describeTenants', {
    })
    .reply(200, {
      data: rep,
      retCode: 0,
      message: null,
    });

    const expectedActions = [{
      payload: rep,
      type: ActionTypes.EXTEND_CONTEXT,
      routerKey: undefined,
    }];

    const store = mockStore();

    return store
    .dispatch(TenantActions.requestDescribeTenants())
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('#requestCreateTenantError', (done) => {
    const scope = mockRequest
    .post('/api/boss/createTenant', {
      name,
    })
    .reply(200, {
      retCode: 1100,
      message: 'Invalid',
    });

    const store = mockStore();

    return store
    .dispatch(TenantActions.requestCreateTenant({
      name,
      description,
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
    });
  });

  it('#requestCreateTenant', (done) => {
    const scope = mockRequest
    .post('/api/boss/createTenant', {
      name,
      description,
    })
    .reply(200, {
      data: {
        tenantId: name,
      },
      retCode: 0,
      message: null,
    });

    const store = mockStore();

    return store
    .dispatch(TenantActions.requestCreateTenant({
      name,
      description,
    }))
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual([{
        payload: {
          tenant: {
            id: name,
          },
        },
        type: ActionTypes.EXTEND_CONTEXT,
        routerKey: undefined,
      }, {
        payload: {
          args: [
            '/tenants',
          ],
          method: 'push',
        },
        type: '@@router/CALL_HISTORY_METHOD',
      }, {
        payload: {
          notify: {
            message: i18n.t('createSuccessed'),
            type: 'notice',
          },
        },
        type: ActionTypes.EXTEND_CONTEXT,
        routerKey: undefined,
      }]);
      done();
    });
  });

  it('#requestModifyTenant', (done) => {
    const scope = mockRequest
    .post('/api/boss/modifyTenantAttributes', {
      name,
      description,
    })
    .reply(200, {
      data: {},
      retCode: 0,
      message: null,
    });

    const rep = {
      totalCount: 9,
      tenantSet: [{
        tenantId,
        name,
      }],
    };

    const scope2 = mockRequest
    .post('/api/boss/describeTenants', {
    })
    .reply(200, {
      data: rep,
      retCode: 0,
      message: null,
    });

    const expectedActions = [{
      payload: {
        notify: {
          message: i18n.t('updateSuccessed'),
          type: 'notice',
        },
      },
      type: ActionTypes.EXTEND_CONTEXT,
      routerKey: undefined,
    }, {
      payload: {
        tenant: {
          tenantId,
          name,
        },
      },
      type: ActionTypes.EXTEND_CONTEXT,
      routerKey: undefined,
    }];

    const store = mockStore();

    return store
    .dispatch(TenantActions.requestModifyTenant({
      name,
      description,
    }))
    .then(() => {
      scope.isDone();
      scope2.isDone();
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('#requestDescribeUserRoles', () => {
    // TODO
  });

  it('#requestDescribeTenantRoles', () => {
    // TODO
  });

  it('#requestCreateTenantRole', () => {
    // TODO
  });

  it('#requestDeleteTenantRole', () => {
    // TODO
  });
});
