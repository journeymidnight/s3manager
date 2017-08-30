import store from 'store';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import * as ActionTypes from './constants';

export const constReducer = (state = {}) => {
  return state;
};

export const consoleheadeReducer = (state = {}, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case ActionTypes.REGIONSET:
      newState.regionSet = action.regionSet
      return newState

    case ActionTypes.CURRENT_PROJECT:
      newState.projectId= action.projectId
      return newState

    default:
      return state;
  }
};

export const authReducer = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_LOGIN:
      store.set('plato_token', action.token);
      return action.context.auth;

    case ActionTypes.AUTH_LOGOUT:
      store.remove('plato_token');
      return null;

    default:
      return state;
  }
};


export const serviceReducer = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_SERVICE:
      if (action.service) {
        store.set('region', action.service.region);
        action.service.servicePath = '';
      }

      return action.service;

    default:
      return state;
  }
};

const reducers = combineReducers({
  env: constReducer,
  global: constReducer,
  auth: authReducer,
  routing: routerReducer,
  form: formReducer,
  context: constReducer,
  service: serviceReducer,
  consoleheader: consoleheadeReducer
});

export function rootReducer(state = {}, action) {
  let newState = Object.assign({}, state);

  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      if (state.routing.locationBeforeTransitions && action.payload.pathname === state.routing.locationBeforeTransitions.pathname) {
        return reducers(state, action);
      }
      newState.context = {};
      return reducers(newState, action);

    case ActionTypes.EXTEND_CONTEXT:
      if (action.routerKey && action.routerKey !== state.routing.locationBeforeTransitions.key) {
        return newState;
      }
      newState.context = Object.assign({}, newState.context);
      newState.context = Object.assign(newState.context, action.payload);
      return newState;
    
    case ActionTypes.SET_FOLDER_LOCATION:
      newState.global.folderLocation = action.folderLocation;
      return newState;

    case ActionTypes.REMOVE_FOLDER_LOCATION:
      delete newState.global.folderLocation;
      return newState;

    default:
      return reducers(state, action);
  }
}

export default rootReducer;
