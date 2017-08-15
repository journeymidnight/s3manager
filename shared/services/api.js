import axios from 'axios';
import store from 'store';
import Promise from 'promise';
import cookie from 'js-cookie';
import i18n from '../../shared/i18n';

export const call = (method, url, payload, hook, yigapi) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token = cookie.get('plato_token') || store.get('plato_token');
  if (token) {
    headers['X-IAM-Token'] = token.token;
  }

  const region = store.get('region');
  if (region) {
    headers['X-Le-Endpoint'] = region.endpoint;
    headers['X-Le-Key'] = region.accessKey;
    headers['X-Le-Secret'] = region.accessSecret;
  }

  var newpayload = {}
  if (url === "/iamapi/ListAccounts") {
    url = "/iamapi";
    newpayload.token = token;
    newpayload.action = "ListAccounts";
    payload = newpayload;
  } else if (url === "/iamapi/DeleteAccount") {
    url = "/iamapi";
    newpayload.action = "DeleteAccount";

    //only support delete one account now
    newpayload.accountid = payload.userIds[0];
    newpayload.token = token;
    payload = newpayload;
  } else if (url === "/iamapi/CreateAccount") {
    url = "/iamapi";
    newpayload.action = "CreateAccount";

    newpayload.user = payload.username;
    newpayload.password = payload.password;
    newpayload.email = payload.email;
    newpayload.token = token;
    payload = newpayload;
  } else if (url === "/iamapi/DescribeAccount") {
    url = "/iamapi";
    newpayload.action = "DescribeAccount";
    newpayload.accountid = payload.userIds[0];
    newpayload.token = token;
    payload = newpayload;
  } else if (url === "/iamapi/ActivateAccount") {
    url = "/iamapi";
    newpayload.action = "ActivateAccount";
    newpayload.accountid = payload.userIds[0];
    newpayload.token = token;
    payload = newpayload;
  } else if (url === "/iamapi/DeactivateAccount") {
    url = "/iamapi";
    newpayload.action = "DeactivateAccount";
    newpayload.accountid = payload.userIds[0];
    newpayload.token = token;
    payload = newpayload;
  } else if (url === "/iamapi/DescribeAccessKeysWithToken") {
    url = "/iamapi";
    newpayload.action = "DescribeAccessKeysWithToken";
    newpayload.token = token;
    payload = newpayload;
  } else if (url === "/iamapi/CreateAccessKey") {
    url = "/iamapi";
    newpayload.action = "CreateAccessKey";
    newpayload.token = token;
    newpayload.keyname = payload.name;
    newpayload.description = payload.description;
    payload = newpayload;
  } else if (url === "/iamapi/DeleteAccessKey") {
    url = "/iamapi";
    newpayload.action = "DeleteAccessKey";
    newpayload.token = token;
    newpayload.AccessKey = payload.accessKeys[0];
    payload = newpayload;
  } else if (url === "/iamapi/ListProjects") {
    url = "/iamapi";
    newpayload.action = "ListProjects";
    newpayload.token = token;
    payload = newpayload;
  } else if (url === "/iamapi/CreateProject") {
    url = "/iamapi";
    newpayload.action = "CreateProject";
    newpayload.token = token;
    newpayload.projectname = payload.name;
    newpayload.description = payload.description;
    payload = newpayload;
  } else if (url === "/iamapi/DeleteProjects") {
    url = "/iamapi";
    newpayload.action = "DeleteProject";
    newpayload.token = token;
    newpayload.projectId = payload.projectIds[0];
    payload = newpayload;
  }

  if (!yigapi) {
    url = `/p${url}`;
  }

  const options = {
    url,
    method
  };

  if (method === 'post') {
    options.data = payload;
    options.headers = headers;
  }


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
              domain: !window.DEBUG ? 'console.s3manager.com' : undefined,
            });
            window.location = '/';
            return;
          } else if (data.retCode === -1) {
            window.console.log(data);
            if (window.DEBUG) {
              reject({
                retCode: -1,
                message: i18n.t('networkIssue'),
                data: null,
              });
            }
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
        if (window.DEBUG) {
          reject({
            retCode: -1,
            message: i18n.t('networkIssue'),
            data: null,
          });
        }
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
    return call('get', '/env', undefined, undefined, true);
  }
}

export default new API();
