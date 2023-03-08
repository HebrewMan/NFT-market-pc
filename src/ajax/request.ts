import axios from 'axios';
import { message as messageAntd } from 'antd';
import history from '../utils/history';
import { getCookie, removeCookie, removeLocalStorage } from '../utils/utils';
import instanceLoading from '../utils/loading';
import config from '../config/constants';
// 当前正在请求的数量
let requestCount = 0;
// 显示loading
function showLoading() {
  if (requestCount === 0) {
    // store.dispatch(openLoading())
    instanceLoading.service();
  }
  requestCount++;
}

// 隐藏loading
function hideLoading() {
  if (requestCount <= 0) return;
  requestCount--;
  if (requestCount === 0) {
    // store.dispatch(closeLoading())
    instanceLoading.close();
  }
}

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: 'http://192.168.1.59:4000',
  // baseURL: 'https://nft-web-test.helios-a.com/',
  // baseURL: 'http://nft-pre.aitd.io',
  baseURL: (config as any)?.BASE_URL,
  timeout: 30000, // 请求超时时间
});
// 异常拦截处理器
const errorHandler = (error: any) => {
  hideLoading();
  messageAntd.error(error);
  return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config: any) => {
  if (config.loading) {
    showLoading();
  }

  const token = getCookie('web-token') || '';

  if (token) {
    config.headers.token = token;
  }

  return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response: any) => {
  hideLoading();
  const { data } = response;
  const { message } = data;
  let { code } = data;
  const codeNum = Number(code);
  if (codeNum === 0 && data) {
    return response.data;
  } else {
    // 登录不正常 或者 token校验不通过
    if (codeNum === 10003 || codeNum === 1008) {
      removeCookie('web-token');
      removeLocalStorage('wallet');
      messageAntd.error(data?.message)
      setTimeout(() => {
        history.push('/');
        window.location.reload()
      }, 2500)
    }else if(codeNum === 500){
      messageAntd.error('Server request exception')
    }
    else{
      messageAntd.error(message)
      return response?.data // 返回接口返回的错误信息
    }
  }
}, errorHandler);

export default request;
