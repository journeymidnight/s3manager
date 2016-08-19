import expect from 'expect';
import * as Actions from '../actions';
import * as ActionTypes from '../../../console-common/redux/constants';
import { mockStore } from '../../../shared/__tests__/mock';

describe('AuthActions', () => {
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
});
