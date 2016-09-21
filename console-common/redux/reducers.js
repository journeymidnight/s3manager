import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import cookie from 'js-cookie';
import * as ActionTypes from '../../console-common/redux/constants';

export const constReducer = (state = {}) => {
  return state;
};

export const serviceReducer = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_SERVICE:
      if (action.service) {
        cookie.set('region', action.service.region, {
          path: '/',
          domain: !window.DEBUG ? 'console.lecloud.com' : undefined,
        });
        action.service.servicePath = '';
      }

      return action.service;

    default:
      return state;
  }
};

export const globalReducer = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_LOGIN:
      cookie.set('token', action.token, {
        path: '/',
        domain: !window.DEBUG ? 'console.lecloud.com' : undefined,
      });
      return action.context;

    case ActionTypes.AUTH_LOGOUT:
      cookie.remove('lecloud_uc_jsessionid', {
        path: '/',
        domain: 'lecloud.com',
      });
      cookie.remove('token', {
        path: '/',
        domain: !window.DEBUG ? 'console.lecloud.com' : undefined,
      });
      return null;

    default:
      return state;
  }
};

const reducers = combineReducers({
  env: constReducer,
  global: globalReducer,
  routing: routerReducer,
  form: formReducer,
  service: serviceReducer,
  header: constReducer,
  context: constReducer,
});

export function rootReducer(state = {}, action) {
  let newState;
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      if (state.routing.locationBeforeTransitions && action.payload.pathname === state.routing.locationBeforeTransitions.pathname) {
        return reducers(state, action);
      }
      newState = Object.assign({}, state);
      newState.context = {};
      return reducers(newState, action);

    case ActionTypes.EXTEND_CONTEXT:
      newState = Object.assign({}, state);
      if (action.routerKey && action.routerKey !== state.routing.locationBeforeTransitions.key) {
        return newState;
      }
      newState.context = Object.assign({}, newState.context);
      newState.context = Object.assign(newState.context, action.payload);
      return newState;

    case ActionTypes.SET_BUCKET:
      newState = Object.assign({}, state);
      newState.global.bucketName = action.data.bucketName;
      newState.global.bucketCreationDate = action.data.bucketCreationDate;
      return newState;

    case ActionTypes.REMOVE_BUCKET:
      newState = Object.assign({}, state);
      delete newState.global.bucketName;
      delete newState.global.bucketCreationDate;
      return newState;

    default:
      return reducers(state, action);
  }
}

export default rootReducer;
