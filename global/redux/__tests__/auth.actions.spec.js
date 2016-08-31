import expect from 'expect';
import * as Actions from '../../../console-common/redux/actions';
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
<<<<<<< HEAD:global/redux/__tests__/auth.actions.spec.js
=======
      {
        payload: {
          args: [
            '/',
          ],
          method: 'push',
        },
        type: '@@router/CALL_HISTORY_METHOD',
      },
>>>>>>> 9ad097915462551f4b1b9874cc3d223e42565025:global/redux/__tests__/auth.actions.spec.js
    ];

    const store = mockStore();
    store.dispatch(Actions.requestLogout());

    expect(store.getActions()).toEqual(expectedActions);
  });
});
