import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import { browserHistory } from 'react-router';
import { routerMiddleware as routerMiddlewareFactory } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers';
import DevTools from '../../shared/components/DevTools';

const routerMiddleware = routerMiddlewareFactory(browserHistory);
const loggerMiddleware = createLogger();

export const initialState = {};

export default function configureStore(_initialState = initialState) {
  const finalCreateStore = compose(
    applyMiddleware(thunkMiddleware, routerMiddleware, loggerMiddleware),
    DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);

  const store = finalCreateStore(rootReducer, _initialState);
  return store;
}
