import expect from 'expect';
import nock from 'nock';
import * as Actions from '../actions';
import * as ActionTypes from '../constants';
import { mockStore, mockRequest } from '../../../shared/__tests__/mock';

describe('AuthActions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('#authLogin', () => {
    const token = {};
    const context = {};

    const expectedAction = [{
      type: ActionTypes.AUTH_LOGIN,
      context,
      token,
    }];

    const store = mockStore();
    store.dispatch(Actions.authLogin(context, token));

    expect(store.getActions()).toEqual(expectedAction);
  });

  it('#requestLogin', (done) => {
    const username = 'usernameA';
    const email = 'emailA';
    const password = 'passwordA';
    const token = 'tokenA';
    const context = {
      auth: {
        username,
      },
    };

    const scope = mockRequest
    .post('/p/api/authorize', {
      email,
      password,
    })
    .reply(200, {
      data: {
        token,
      },
      retCode: 0,
      message: null,
    });

    const scope2 = mockRequest
    .post('/p/api/DescribeToken', {
    })
    .reply(200, {
      data: context,
      retCode: 0,
      message: null,
    });

    const store = mockStore();

    return store
    .dispatch(Actions.requestLogin(email, password))
    .then(() => {
      scope.isDone();
      scope2.isDone();
      expect(store.getActions()).toEqual([{
        type: ActionTypes.AUTH_LOGIN,
        context,
        token: { token },
      }, {
        payload: {
          args: ['/'],
          method: 'push',
        },
        type: '@@router/CALL_HISTORY_METHOD',
      }]);
      done();
    });
  });

  it('#requestLogout', () => {
    const expectedActions = [
      { type: ActionTypes.AUTH_LOGOUT },
      {
        payload: {
          args: ['/login'],
          method: 'push',
        },
        type: '@@router/CALL_HISTORY_METHOD',
      },
    ];

    const store = mockStore();
    store.dispatch(Actions.requestLogout());

    expect(store.getActions()).toEqual(expectedActions);
  });
});
