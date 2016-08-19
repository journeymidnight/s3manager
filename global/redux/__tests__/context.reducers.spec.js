import expect from 'expect';
import deepFreeze from 'deep-freeze';
import * as Reducer from '../reducers';
import * as ActionTypes from '../../../console-common/redux/reducers';

describe('RootReducer', () => {
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
