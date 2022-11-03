import { InjectedConnector } from '@web3-react/injected-connector';
import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
import BigNumber from 'bignumber.js';
import { isMobile } from 'react-device-detect';
import { message } from 'antd';

// dayjs.extend(utc);
export const cleanName = (name?: string): string | undefined => {
  if (!name) {
    return undefined;
  }

  return name.replace(/\s+/g, '-');
};

export const getLast = <T>(arr: T[]) => {
  if (arr.length <= 0) {
    return undefined;
  }

  return arr[arr.length - 1];
};
/*
 *存储 Localstorage
 */
export const setLocalStorage = (name: string, value: string) => {
  if (!name) return;
  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  }
  window.localStorage.setItem(name, value);
};
/**
 * 获取localStorage
 */
export const getLocalStorage = (name: string) => {
  if (!name) return;
  return window.localStorage.getItem(name);
};
/*
 * 删除LocalStorage
 */
export const removeLocalStorage = (name: string) => {
  if (!name) return;
  window.localStorage.removeItem(name);
};
/**
 * 获取 Cookies
 */
export const getCookie = (name: string) => {
  let start;
  let end;
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(`${name}=`);
    if (start !== -1) {
      start = start + name.length + 1;
      end = document.cookie.indexOf(';', start);
      if (end === -1) end = document.cookie.length;
      return decodeURI(document.cookie.substring(start, end));
    }
  }
  return '';
};
/*
 *存储 Cookies
 */
export const setCookie = (name: string, value: string, expireDays: number) => {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expireDays);
  // const exdate = new Date(expireDays);
  const exdateString = expireDays === null ? '' : `;expires=${exdate.toString()}`;
  document.cookie = `${name}=${encodeURI(value)}${exdateString}`;
};
/*
 * 删除Cookies
 */
export const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

/**
 *截取字符串中间显示省略号
 *
 */
export const getSubstr = function (chainAddress: string) {
  const str1 = chainAddress.substr(0, 12);
  const str2 = chainAddress.substr(chainAddress.length - 12, 12);
  const subStr = str1 + '...' + str2;
  return subStr;
};
export const formatAdd = function (add: string) {
  if (!add || add.length < 10) {
    return add;
  }
  return add.substring(0, 6) + '****' + add.substring(add.length - 4);
};

/**
 *时间
 *
 */
export const formatTime = (time: string) => {
  const now = dayjs();
  // const unix = dayjs.utc(time).unix();
  const unix = dayjs(time).unix();
  const timestamp = unix * 1000;
  const inSeconds = now.diff(timestamp, 'second');
  const inMinutes = now.diff(timestamp, 'minute');
  const inHours = now.diff(timestamp, 'hour');
  const inDays = now.diff(timestamp, 'day');
  const inMonths = now.diff(timestamp, 'month');
  const getStr = (num: number, mark: string) => {
    return `${num} ${mark}${num === 1 ? '' : 's'} ago`;
  };
  if (inMonths > 0) {
    return getStr(inMonths, 'day');
  } else if (inHours >= 24) {
    return getStr(inDays, 'day');
  } else if (inMinutes >= 60) {
    return getStr(inHours, 'hour');
  } else if (inSeconds >= 60) {
    return getStr(inMinutes, 'minute');
  } else {
    return getStr(inSeconds, 'second');
  }
};
export const countDownTime = (startTime: string, endTime: string) => {
  const now = dayjs().unix();
  const start = dayjs(startTime).unix();
  const end = dayjs(endTime).unix();
  const isStarting = now > start ? now - start : start - now;
  const countDownTime = now > start ? end - now : isStarting;
  const days = isStarting >= 0 && countDownTime > 0 ? Math.floor(countDownTime / 86400) : 0; // 天
  const hours = isStarting >= 0 && countDownTime > 0 ? Math.floor((countDownTime / 3600) % 24) : 0; // 小时
  const minutes = isStarting >= 0 && countDownTime > 0 ? Math.floor((countDownTime / 60) % 60) : 0; // 分钟
  const seconds = isStarting >= 0 && countDownTime > 0 ? Math.floor(countDownTime % 60) : 0; // 秒
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

// 防抖debounce
export const debounce = (fn: any, delay = 800, immediate = false) => {
  let timer: any;
  return (...rest: any) => {
    //箭头函数是没有arguments的 所以用...rest 来代替
    const args = rest;
    if (immediate) {
      fn.apply(this, args);
      immediate = false;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 19, 239, 1320, 1319],
});

export const wallets = [
  {
    connector: injected,
    name: isMobile ? 'Connect Wallet' : 'MetaMask',
    logoURI: isMobile ? require('../assets/usdt.png') : require('../assets/metamask.png'),
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
];

export const toPriceDecimals = (price: number, decimals = 6) => {
  return new BigNumber(price).multipliedBy(new BigNumber(10).pow(decimals)).toFixed();
};

export const fromPriceDecimals = (price: string, decimals = 6) => {
  return new BigNumber(price).dividedBy(new BigNumber(10).pow(new BigNumber(decimals)));
};

// 上传文件（图片）检验：格式、大小
export const uploadFileCheck = (file: File, fileTypes: Array<string>, maxSize: number, typeTips: string, sizeTips: string) => {
  const type = file?.name?.split('.')[1]?.toLowerCase()
  if (fileTypes && fileTypes.length && fileTypes.indexOf(type) === -1) {
    message.error(typeTips);
    return false
  }
  if (file.size >= maxSize) {
    message.error(sizeTips);
    return false
  }
  return true
}