import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import { browserHistory } from 'react-router';
import { routerMiddleware as routerMiddlewareFactory } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import DevTools from '../components/DevTools';

const routerMiddleware = routerMiddlewareFactory(browserHistory);
const loggerMiddleware = createLogger();

export const initialState = {};

export default function configureStore(rootReducer, _initialState = initialState) {
  let finalCreateStore;

  if (process.env.NODE_ENV !== 'production') {
    finalCreateStore = compose(
      applyMiddleware(thunkMiddleware, routerMiddleware, loggerMiddleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else {
    finalCreateStore = compose(
      applyMiddleware(thunkMiddleware, routerMiddleware)
    )(createStore);
  }

  const store = finalCreateStore(rootReducer, _initialState);
  return store;
}
