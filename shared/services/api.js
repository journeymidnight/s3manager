import axios from 'axios';
import store from 'store';
import Promise from 'promise';

export const call = (method, url, payload) => {
  const token = store.get('token');
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['X-Le-Token'] = token.token;
  }

  const promise = axios({
    url: `/api${url}`,
    method,
    data: payload,
    headers,
  });

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
        if (data.retCode === 0) {
          resolve(data.data);
        } else {
          reject(data);
        }
      }
    })
    .catch((error) => {
      reject({
        retCode: -1,
        message: error.toString(),
        data: null,
      });
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
