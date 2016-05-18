import expect from 'expect';
import deepFreeze from 'deep-freeze';
import * as Reducer from '../reducers';
import * as ActionTypes from '../constants';

describe('AuthReducers', () => {
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
