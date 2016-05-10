import expect from 'expect';
import nock from 'nock';
import * as Actions from '../actions';
import * as ActionTypes from '../constants';
import { mockStore, mockRequest } from '../../../shared/__tests__/mock';
import i18n from '../../../shared/i18n';

describe('TenantActions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('#requestDescribeTenants', (done) => {
    const rep = {
      totalCount: 9,
      tenantSet: [{
        id: 'idA',
        name: 'nameA',
      }],
    };

    const scope = mockRequest
    .post('/api/boss/', {
      action: 'describeTenants',
    })
    .reply(200, {
      data: rep,
      retCode: 0,
      message: null,
    });

    const expectedActions = [{
      payload: rep,
      type: ActionTypes.EXTEND_CONTEXT,
    }];

    const store = mockStore();

    return store
    .dispatch(Actions.requestDescribeTenants())
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('#requestCreateTenant', (done) => {
    const scope = mockRequest
    .post('/api/boss/', {
      action: 'createTenant',
      name: 'nameA',
      description: 'descriptionA',
    })
    .reply(200, {
      data: {
        tenantId: 'nameA',
      },
      retCode: 0,
      message: null,
    });

    const expectedActions = [{
      payload: {
        tenant: {
          id: 'nameA',
        },
      },
      type: ActionTypes.EXTEND_CONTEXT,
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
          message: i18n.t('addSuccessed'),
          type: 'notice',
        },
      },
      type: ActionTypes.EXTEND_CONTEXT,

    }];

    const store = mockStore();

    return store
    .dispatch(Actions.requestCreateTenant({
      name: 'nameA',
      description: 'descriptionA',
    }))
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('#requestModifyTenant', (done) => {
    const scope = mockRequest
    .post('/api/boss/', {
      action: 'modifyTenantAttributes',
      name: 'nameA',
      description: 'descriptionA',
    })
    .reply(200, {
      data: {},
      retCode: 0,
      message: null,
    });

    const rep = {
      totalCount: 9,
      tenantSet: [{
        id: 'idA',
        name: 'nameA',
      }],
    };

    const scope2 = mockRequest
    .post('/api/boss/', {
      action: 'describeTenants',
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
    }, {
      payload: {
        tenant: {
          id: 'idA',
          name: 'nameA',
        },
      },
      type: ActionTypes.EXTEND_CONTEXT,
    }];

    const store = mockStore();

    return store
    .dispatch(Actions.requestModifyTenant({
      name: 'nameA',
      description: 'descriptionA',
    }))
    .then(() => {
      scope.isDone();
      scope2.isDone();
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
});
