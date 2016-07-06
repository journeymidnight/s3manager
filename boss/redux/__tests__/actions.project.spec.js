import expect from 'expect';
import nock from 'nock';
import * as ProjectActions from '../actions.project';
import * as ActionTypes from '../constants';
import { mockStore, mockRequest } from '../../../shared/__tests__/mock';
import i18n from '../../../shared/i18n';

const projectId = 'idA';
const name = 'nameA';
const description = 'descriptionA';

describe('ProjectActions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('#requestDescribeProjects', (done) => {
    const rep = {
      totalCount: 9,
      projectSet: [{
        projectId,
        name,
      }],
    };

    const scope = mockRequest
    .post('/p/api/describeProjects', {
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
    .dispatch(ProjectActions.requestDescribeProjects())
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('#requestCreateProjectError', (done) => {
    const scope = mockRequest
    .post('/p/api/createProject', {
      name,
    })
    .reply(200, {
      retCode: 1100,
      message: 'Invalid',
    });

    const store = mockStore();

    return store
    .dispatch(ProjectActions.requestCreateProject({
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

  it('#requestCreateProject', (done) => {
    const scope = mockRequest
    .post('/p/api/createProject', {
      name,
      description,
    })
    .reply(200, {
      data: {
        projectId: name,
      },
      retCode: 0,
      message: null,
    });

    const store = mockStore();

    return store
    .dispatch(ProjectActions.requestCreateProject({
      name,
      description,
    }))
    .then(() => {
      scope.isDone();
      expect(store.getActions()).toEqual([{
        payload: {
          project: {
            id: name,
          },
        },
        type: ActionTypes.EXTEND_CONTEXT,
        routerKey: undefined,
      }, {
        payload: {
          args: [
            '/projects',
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

  it('#requestModifyProject', (done) => {
    const scope = mockRequest
    .post('/p/api/modifyProjectAttributes', {
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
      projectSet: [{
        projectId,
        name,
      }],
    };

    const scope2 = mockRequest
    .post('/p/api/describeProjects', {
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
        project: {
          projectId,
          name,
        },
      },
      type: ActionTypes.EXTEND_CONTEXT,
      routerKey: undefined,
    }];

    const store = mockStore();

    return store
    .dispatch(ProjectActions.requestModifyProject({
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

  it('#requestDescribeProjectRoles', () => {
    // TODO
  });

  it('#requestCreateProjectRole', () => {
    // TODO
  });

  it('#requestDeleteProjectRole', () => {
    // TODO
  });
});
