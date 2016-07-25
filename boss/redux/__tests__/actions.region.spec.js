import expect from 'expect';
import nock from 'nock';
import * as ServiceActions from '../actions.service';
import * as ActionTypes from '../constants';
import { mockStore, mockRequest } from '../../../shared/__tests__/mock';
import i18n from '../../../shared/i18n';

const serviceId = 'idA';
const name = 'nameA';
const publicEndpoint = 'publicEndpointA';
const manageEndpoint = 'manageEndpointA';
const manageKey = 'manageKeyA';
const manageSecret = 'manageSecretA';

describe('ServiceActions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('#requestDescribeServices', (done) => {
    const rep = {
      totalCount: 9,
      serviceSet: [{
        serviceId,
        name,
        publicEndpoint,
        manageEndpoint,
        manageKey,
      }],
    };

    const scope = mockRequest
    .post('/p/api/iam/DescribeServices', {
    })
    .reply(200, {
      data: rep,
      retCode: 0,
      message: null,
    });

    const store = mockStore();
    return store
    .dispatch(ServiceActions.requestDescribeServices())
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

  it('#requestCreateServiceError', (done) => {
    const scope = mockRequest
    .post('/p/api/iam/CreateService', {
      name,
      publicEndpoint,
      manageEndpoint,
      manageKey,
      manageSecret,
    })
    .reply(200, {
      retCode: 1100,
      message: 'Invalid',
      data: null,
    });

    const store = mockStore();
    return store
    .dispatch(ServiceActions.requestCreateService({
      name,
      publicEndpoint,
      manageEndpoint,
      manageKey,
      manageSecret,
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

  it('#requestCreateService', (done) => {
    const scope = mockRequest
    .post('/p/api/iam/CreateService', {
      name,
      publicEndpoint,
      manageEndpoint,
      manageKey,
      manageSecret,
    })
    .reply(200, {
      data: {
        serviceId,
      },
      retCode: 0,
      message: null,
    });

    const store = mockStore();

    return store
    .dispatch(ServiceActions.requestCreateService({
      name,
      publicEndpoint,
      manageEndpoint,
      manageKey,
      manageSecret,
    }))
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual([{
        payload: {
          args: [
            '/services',
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
    })
    .catch((error) => {
      done(error);
    });
  });

  it('#requestModifyService', (done) => {
    const scope = mockRequest
    .post('/p/api/iam/ModifyServiceAttributes', {
      serviceId,
      name,
    })
    .reply(200, {
      data: {},
      retCode: 0,
      message: null,
    });

    const rep = {
      totalCount: 9,
      serviceSet: [{
        serviceId,
        name,
        publicEndpoint,
        manageEndpoint,
      }],
    };

    const scope2 = mockRequest
    .post('/p/api/iam/DescribeServices', {
      serviceIds: [serviceId],
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
        service: rep.serviceSet[0],
      },
      type: ActionTypes.EXTEND_CONTEXT,
      routerKey: undefined,
    }];

    const store = mockStore();

    return store
    .dispatch(ServiceActions.requestModifyService({
      serviceId,
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

  it('#requestDescribeProjectQuota', () => {
    // TODO
  });

  it('#requestAssignProjectQuota', () => {
    // TODO
  });

  it('#requestDeleteProjectQuota', () => {
    // TODO
  });
});
