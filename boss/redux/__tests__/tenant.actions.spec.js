import expect from 'expect';
import * as Actions from '../actions';
import * as ActionTypes from '../constants';
import { mockStore, mockRequest } from '../../../shared/__tests__/mock';

describe('TenantActions', () => {
  it('#requestDescribeTenants', () => {
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
    });
  });

  it('#requestCreateTenant', () => {
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
          message: 'Created!',
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
    });
  });

  it('#requestModifyTenant', () => {
    const scope = mockRequest
    .post('/api/boss/', {
      action: 'modifyTenant',
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
          message: 'Saved!',
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
    });
  });
});
