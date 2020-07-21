import Vue from 'vue';
import axios from 'axios';
import config from '../config';

const bus = new Vue();

const axiosInstance = axios.create({
  baseURL: config.backendURL + config.baseUrl,
  timeout: 6000,
});

// respone interceptor
axiosInstance.interceptors.response.use(
  response => response.data,
  (error) => {
    if (error && error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') { window.location.pathname = '/login'; }
    } else if (error && error.response && error.response.status !== 404) {
      if (error.response.data && error.response.data.msg) {
        bus.$q.notify(error.response.data.msg || error.response.data.msg.message);
      }
    }
  },
);

const getQueryKVPare = (o, parent = '') => {
  let kv = [];
  if (typeof o === 'object') {
    for (let i = 0; i < Object.keys(o).length; i += 1) {
      const ok = Object.keys(o)[i];

      const kvl = getQueryKVPare(o[ok], parent ? `${parent}_DOT_${ok}` : ok);
      kv = kv.concat(kvl);
    }
  } else if (parent && o) {
    kv.push(`${parent}=${o}`);
  }

  return kv;
};

const getRequest = (url, options) => {
  let queryString = '';
  if (options && Object.keys(options).length) {
    if (url.indexOf('?') > 0) {
      queryString += '&';
    } else {
      queryString += '?';
    }

    queryString += getQueryKVPare(options).join('&') || '';
  }

  return axiosInstance.get(url + queryString);
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

  return axiosInstance.post(url, data);
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

  return axiosInstance.put(url, data);
};

const deleteRequest = (url, data) => axiosInstance.delete(url, { data });

const requests = {
  $axios: axiosInstance,
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
  nothingRequest: () => axiosInstance.get('/nothing'),
};

Object.assign(Vue.prototype, requests);

export default requests;
