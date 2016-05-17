import expect from 'expect';
import nock from 'nock';
import * as Actions from '../actions';
import * as ActionTypes from '../constants';
import { mockStore, mockRequest } from '../../../shared/__tests__/mock';
import i18n from '../../../shared/i18n';

const adminId = 'idA';
const username = 'usernameA';
const email = 'emailA';
const password = 'passwordA';

describe('AdminActions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('#requestDescribeAdmins', (done) => {
    const rep = {
      totalCount: 9,
      adminSet: [{
        adminId,
        username,
        email,
      }],
    };

    const scope = mockRequest
    .post('/api/boss/describeAdmins', {
    })
    .reply(200, {
      data: rep,
      retCode: 0,
      message: null,
    });

    const store = mockStore();
    return store
    .dispatch(Actions.requestDescribeAdmins())
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

  it('#requestCreateAdminError', (done) => {
    const scope = mockRequest
    .post('/api/boss/createAdmin', {
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
    .dispatch(Actions.requestCreateAdmin({
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

  it('#requestCreateAdmin', (done) => {
    const scope = mockRequest
    .post('/api/boss/createAdmin', {
      username,
      email,
      password,
    })
    .reply(200, {
      data: {
        adminId,
      },
      retCode: 0,
      message: null,
    });

    const store = mockStore();

    return store
    .dispatch(Actions.requestCreateAdmin({
      username,
      email,
      password,
    }))
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual([{
        payload: {
          args: [
            '/admins',
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

  it('#requestModifyAdmin', (done) => {
    const scope = mockRequest
    .post('/api/boss/modifyAdminAttributes', {
      adminId,
      username,
    })
    .reply(200, {
      data: {},
      retCode: 0,
      message: null,
    });

    const rep = {
      totalCount: 9,
      adminSet: [{
        adminId,
        username,
        email,
      }],
    };

    const scope2 = mockRequest
    .post('/api/boss/describeAdmins', {
      admins: [adminId],
    })
    .reply(200, {
      data: rep,
      retCode: 0,
      message: null,
    });

    const store = mockStore();

    return store
    .dispatch(Actions.requestModifyAdmin({
      adminId,
      username,
    }))
    .then(() => {
      scope.isDone();
      scope2.isDone();
      expect(store.getActions()).toEqual([{
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
          admin: rep.adminSet[0],
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
});
