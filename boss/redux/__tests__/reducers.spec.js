import expect from 'expect';
import deepFreeze from 'deep-freeze';
import * as Reducer from '../reducers';
import * as ActionTypes from '../constants';

describe('AuthReducer', () => {
  it('#AUTH_LOGIN', () => {
    const stateBefore = null;
    const stateAfter = {
      name: 'prank',
    };

    const action = {
      type: ActionTypes.AUTH_LOGIN,
      token: {
        token: '123',
      },
      context: {
        auth: {
          name: 'prank',
        },
      },
    };

    deepFreeze(action);
    expect(stateAfter).toEqual(Reducer.authReducer(stateBefore, action));
  });
});

describe('rootReducer', () => {
  it('#EXTEND_CONTEXT', () => {
    const stateBefore = {
      context: {},
    };
    const stateAfter = {
      context: {
        id: 'idA',
      },
    };

    const action = {
      type: ActionTypes.EXTEND_CONTEXT,
      payload: {
        id: 'idA',
      },
    };

    deepFreeze(action);
    expect(stateAfter).toEqual(Reducer.rootReducer(stateBefore, action));
  });
});
