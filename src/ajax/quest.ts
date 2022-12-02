import request from './request';
import qs from 'qs';

export function get(url:string, parameter = {}, contentType = '', loading = true) {
  let headers: any = {};

  if (contentType === 'json') {
    headers = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
  }

  if (contentType === 'arraybuffer') {
    headers = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      responseType: 'arraybuffer',
    };
  }

  headers.loading = loading;

  return request({
    url,
    method: 'get',
    params: parameter,
    ...headers,
  });
}

export function post(url:string, parameter = {}, contentType = '', loading = true) {
  let headers: any = {};
  if (contentType === 'urlencoded') {
    parameter = qs.stringify(parameter);
  }

  if (contentType === 'json') {
    headers = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
  }

  if (contentType === 'form') {
    headers = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  }

  if (contentType === 'arraybuffer') {
    headers = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      responseType: 'arraybuffer',
    };
  }

  headers.loading = loading;

  return request({
    url,
    method: 'post',
    data: parameter,
    ...headers,
  });
}
