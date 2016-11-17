import cookie from 'js-cookie';
import store from 'store';
import moment from 'moment';

export function performS3Action(cb) {
  const token = cookie.get('plato_token') || store.get('plato_token');
  if (token && moment(token.expired).isAfter(moment())) {
    cb();
    return true;
  }
  window.location = '/';
  return false;
}
