import * as types from 'Src/store/mutation-types';

// * setToken
export const setToken = (token: string) => ({
  type: types.SET_TOKEN,
  token,
});

// * setToken
export const setWallet = (wallet: string) => ({
  type: types.SET_WALLET,
  wallet,
});

// * setLanguage
export const setLanguage = (language: string) => ({
  type: types.SET_LANGUAGE,
  language,
});

// 设置登录钱包
export const setConnectModal = (connectMoadl: boolean) => ({
  type: types.SET_CONNECTMODAL,
  connectMoadl,
});
