import expect from 'expect';
import deepFreeze from 'deep-freeze';
import reducer from '../reducers';
import * as ActionTypes from '../constants';

describe('AuthReducers', () => {
  it('#AUTH_LOGIN', () => {
    const stateBefore = {
    };

    const stateAfter = {
      context: {},
      env: {},
      form: {},
      global: {
        auth: {
          name: "prank",
        },
      },
      header: {},
      routing: {
        locationBeforeTransitions: null,
      },
      service: null,
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
    expect(stateAfter).toEqual(reducer(stateBefore, action));
  });
});
