import axios from 'axios';
import store from 'store';
import Promise from 'promise';

export const call = (method, url, payload, hook) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token = store.get('token');
  if (token) {
    headers['X-Le-Token'] = token.token;
  }

  const region = store.get('region');
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
            store.remove('token');
            window.location.reload();
            return;
          }
          reject(data);
        }
      }
    })
    .catch((error) => {
      if (error.data.retCode) {
        reject(error.data);
      } else {
        reject({
          retCode: -1,
          message: error.data,
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
