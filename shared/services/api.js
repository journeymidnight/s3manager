import axios from 'axios';
import store from 'store';
import Promise from 'promise';
import cookie from 'js-cookie';
import i18n from '../../shared/i18n';

export const call = (method, url, payload, hook) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token = cookie.get('plato_token') || store.get('plato_token');
  if (token) {
    headers['X-Le-Token'] = token.token;
  }

  const region = cookie.get('region') || store.get('region');
  if (region) {
    headers['X-Le-Endpoint'] = region.endpoint;
    headers['X-Le-Key'] = region.accessKey;
    headers['X-Le-Secret'] = region.accessSecret;
  }

  const options = {
    url: `/p${url}`,
    method,
    data: payload,
    headers,
  };

  if (hook) {
    hook(options);
  }

  const promise = axios(options);

  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
    .then((val) => {
      if (hasCanceled) {
        reject({
          retCode: -2,
          message: 'Have canceled.',
          data: null,
        });
      } else {
        const data = val.data;
        const dt = data.data;
        if (data.retCode === 0) {
          resolve(dt);
        } else {
          const _ = require('lodash');
          if (data.retCode === 4101 && !_.endsWith(url, 'authorize')) {
            store.remove('plato_token');
            cookie.remove('plato_token', {
              path: '/',
              domain: !window.DEBUG ? 'console.lecloud.com' : undefined,
            });
            window.location = '/';
            return;
          } else if (data.retCode === -1) {
            window.console.log(data);
            reject({
              retCode: -1,
              message: i18n.t('networkIssue'),
              data: null,
            });
          } else {
            reject(data);
          }
        }
      }
    })
    .catch((error) => {
      if (error.data.retCode) {
        reject(error.data);
      } else {
        window.console.log(error);
        reject({
          retCode: -1,
          message: i18n.t('networkIssue'),
          data: null,
        });
      }
    });
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
};

class API {
  fetchEnv() {
    return call('get', '/env');
  }
}

export default new API();
