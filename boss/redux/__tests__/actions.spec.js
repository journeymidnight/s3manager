import expect from 'expect';
import * as Actions from '../actions';
import * as ActionTypes from '../constants';
import { mockStore, mockRequest } from '../../../shared/__tests__/mock';

describe('Actions', () => {
  it('#authLogin', () => {
    const token = {
    };

    const context = {
    };

    const expectedAction = [{
      type: ActionTypes.AUTH_LOGIN,
      context,
      token,
    }];

    const store = mockStore();
    store.dispatch(Actions.authLogin(context, token));

    expect(store.getActions()).toEqual(expectedAction);
  });

  it('#requestLogout', () => {
    const expectedActions = [
      { type: ActionTypes.AUTH_LOGOUT },
      {
        payload: {
          args: [
            '/login',
          ],
          method: 'push',
        },
        type: '@@router/CALL_HISTORY_METHOD',
      },
    ];

    const store = mockStore();
    store.dispatch(Actions.requestLogout());

    expect(store.getActions()).toEqual(expectedActions);
  });

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

    const expectedActions = [{
      payload: {
        tenant: {},
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
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
