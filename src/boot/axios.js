import Vue from 'vue';
import axios from 'axios';
// import { Platform } from 'quasar';
import { Notify } from 'quasar';
import config from '../config';

const Mocks = [];

const { baseUrl } = config;
// if (Platform.is.capacitor) {
//   baseUrl = `${config.backendURL}${baseUrl}`;
// }

axios.defaults.timeout = 3000 * 1000;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 3000 * 1000,
});

axiosInstance.interceptors.request.use((cfg) => {
  cfg.cancelToken = new axios.CancelToken((tk) => {
    cfg.cancelTokenFunc = tk;
  });
  return cfg;
});

// respone interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config && response.config.shouldCancelRequest
      && ((typeof response.config.shouldCancelRequest === 'function')
        ? response.config.shouldCancelRequest() : true)) {
      response.config.cancelTokenFunc();
      throw new Error('request canceled');
    } else {
      return response.data;
    }
  },
  (error) => {
    if (error && error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${window.location.pathname}`;
      }
    } else if (error && error.response && error.response.status === 403 && error.response.data && error.response.data.msg === 'RSTPWD') {
      if (window.location.pathname !== '/recover') {
        window.location.href = `/recover?redirect=${window.location.pathname}`;
      }
    } else if (error && error.response && error.response.status !== 404) {
      if (error.response.data && error.response.data.msg) {
        Notify.create(error.response.data.msg || error.response.data.msg.message);
      }
    }
  },
);

const mockIt = (url, method) => {
  const theMock = Mocks.find(
    (mk) => mk.method === method && new RegExp(mk.url).test(url),
  );
  if (theMock && theMock.func) {
    return new Promise((resolve) => {
      resolve(typeof theMock.func === 'function' ? theMock.func() : theMock.func);
    });
  }
  return undefined;
};

const getQueryKVPare = (o, parent = '') => {
  let kv = [];
  if (typeof o === 'object') {
    for (let i = 0; i < Object.keys(o).length; i += 1) {
      const ok = Object.keys(o)[i];

      const kvl = getQueryKVPare(o[ok], parent ? `${parent}_DOT_${ok}` : ok);
      kv = kv.concat(kvl);
    }
  } else if (parent && o) {
    kv.push(`${encodeURI(parent)}=${encodeURI(o)}`);
  }

  return kv;
};

const getRequest = (url, options, newWin = false) => {
  let queryString = '';

  const shouldCancel = { shouldCancelRequest: options && options.cancel_request };
  if (options) delete options.cancel_request;

  if (options && Object.keys(options).length) {
    if (url.indexOf('?') > 0) {
      queryString += '&';
    } else {
      queryString += '?';
    }

    queryString += getQueryKVPare(options).join('&') || '';
  }

  if (newWin) {
    return window.open(`${config.baseUrl}/${encodeURI(url)}${queryString}`);
  }

  return mockIt(`${url}${queryString}`, 'get') || axiosInstance.get(encodeURI(url) + queryString, shouldCancel);
};

const postRequest = (url, data) => {
  // replace password with encrypted
  if (data
    && data.Password
    && Vue.prototype.ctx
    && Vue.prototype.ctx.modules
    && Vue.prototype.ctx.modules.passport) {
    data.Password = Vue.prototype.ctx.modules.passport.utils.encryptPwd(
      data.Password,
    );
  }

  if (data && data.pwdConfirm) delete data.pwdConfirm;

  return mockIt(url, 'post', data) || axiosInstance.post(url, data);
};

const putRequest = (url, data) => {
  // replace password with encrypted
  if (data
    && data.Password
    && Vue.prototype.ctx
    && Vue.prototype.ctx.modules
    && Vue.prototype.ctx.modules.passport) {
    data.Password = Vue.prototype.ctx.modules.passport.utils.encryptPwd(
      data.Password,
    );
  }

  if (data && data.pwdConfirm) delete data.pwdConfirm;

  return mockIt(url, 'put', data) || axiosInstance.put(url, data);
};

const deleteRequest = (url, data) => mockIt(url, 'delete', { data }) || axiosInstance.delete(url, { data });

const requests = {
  $axios: axiosInstance,
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
  nothingRequest: () => axiosInstance.get('/nothing'),
  Mock: {
    mock: (url, method = 'get', func) => {
      Mocks.push({
        url,
        method,
        func,
      });
    },
  },
};

Object.assign(Vue.prototype, requests);

export default requests;
