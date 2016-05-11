import expect from 'expect';
import nock from 'nock';
import * as Actions from '../actions';
import * as ActionTypes from '../constants';
import { mockStore, mockRequest } from '../../../shared/__tests__/mock';
import i18n from '../../../shared/i18n';

const userId = 'idA';
const username = 'usernameA';
const email = 'emailA';
const password = 'passwordA';

describe('UserActions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('#requestDescribeUsers', (done) => {
    const rep = {
      totalCount: 9,
      userSet: [{
        userId,
        username,
        email,
      }],
    };

    const scope = mockRequest
    .post('/api/boss/', {
      action: 'describeUsers',
    })
    .reply(200, {
      data: rep,
      retCode: 0,
      message: null,
    });

    const store = mockStore();
    return store
    .dispatch(Actions.requestDescribeUsers())
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

  it('#requestCreateUserError', (done) => {
    const scope = mockRequest
    .post('/api/boss/', {
      action: 'createUser',
      username,
      email,
      password,
    })
    .reply(200, {
      retCode: 1100,
      message: 'Invalid',
      data: null,
    });

    const store = mockStore();
    return store
    .dispatch(Actions.requestCreateUser({
      username,
      email,
      password,
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

  it('#requestCreateUser', (done) => {
    const scope = mockRequest
    .post('/api/boss/', {
      action: 'createUser',
      username,
      email,
      password,
    })
    .reply(200, {
      data: {
        userId,
      },
      retCode: 0,
      message: null,
    });

    const store = mockStore();

    return store
    .dispatch(Actions.requestCreateUser({
      username,
      email,
      password,
    }))
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual([{
        payload: {
          args: [
            '/users',
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

  it('#requestModifyUser', (done) => {
    const scope = mockRequest
    .post('/api/boss/', {
      action: 'modifyUserAttributes',
      userId,
      username,
    })
    .reply(200, {
      data: {},
      retCode: 0,
      message: null,
    });

    const rep = {
      totalCount: 9,
      userSet: [{
        userId,
        username,
        email,
      }],
    };

    const scope2 = mockRequest
    .post('/api/boss/', {
      action: 'describeUsers',
      users: [userId],
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
        user: rep.userSet[0],
      },
      type: ActionTypes.EXTEND_CONTEXT,
      routerKey: undefined,
    }];

    const store = mockStore();

    return store
    .dispatch(Actions.requestModifyUser({
      userId,
      username,
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
});
