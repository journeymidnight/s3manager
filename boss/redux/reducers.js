import store from 'store';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import * as ActionTypes from './constants';

export const constReducer = (state = {}) => {
  return state;
};

export const authReducer = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_LOGIN:
      store.set('token', action.token);
      return action.context.auth;

    case ActionTypes.AUTH_LOGOUT:
      store.remove('token');
      return null;

    default:
      return state;
  }
};

const reducers = combineReducers({
  env: constReducer,
  auth: authReducer,
  routing: routerReducer,
  form: formReducer,
  context: constReducer,
});

export function rootReducer(state = {}, action) {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      newState.context = {};
      return reducers(newState, action);

    case ActionTypes.EXTEND_CONTEXT:
      if (action.routerKey && action.routerKey !== state.routing.locationBeforeTransitions.key) {
        return newState;
      }
      newState.context = Object.assign({}, newState.context);
      newState.context = Object.assign(newState.context, action.payload);
      return newState;

    default:
      return reducers(state, action);
  }
}

export default rootReducer;
