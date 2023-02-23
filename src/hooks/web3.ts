import React from 'react';
import { getNonce, login, logout } from '../api/index';
import Web3 from 'web3';
import { setLocalStorage, setCookie, removeCookie, removeLocalStorage } from '../utils/utils';
import { message } from 'antd';
import history from '../utils/history';
import { injected } from '../utils/utils';
import { isProd } from '../config/constants';
import i18n from 'i18next';
declare global {
  interface Window {
    ethereum: any;
    web3: any;
    menuTimer: any;
  }
}

let web3: any;
let currWalletAddress: string | undefined;
let connectedMainNetwork = false;
let connectedNetwork = '';
let connectedChainId: any = null;
// let currWalletType;

const getNetwork = () => {
  if (!web3 || !web3.eth) {
    connectedMainNetwork = false;
    connectedNetwork = '';
    connectedChainId = null;
    return;
  }
  web3?.eth?.net?.getId().then((res: any) => {
    connectedChainId = res;
    if (res === 1) {
      connectedMainNetwork = true;
      connectedNetwork = 'Main';
    } else if (res === 3) {
      connectedNetwork = 'Ropsten';
    } else if (res === 4) {
      connectedNetwork = 'Rinkeby';
    } else if (res === 5) {
      connectedNetwork = 'Goerli';
    } else if (res === 42) {
      connectedNetwork = 'Kovan';
    } else if (res === 128) {
      connectedNetwork = 'HECO Main';
    } else if (res === 256) {
      connectedNetwork = 'HECO TEST';
    } else {
      connectedMainNetwork = false;
      connectedNetwork = '';
    }
  });
};

// 连接网络链路
const connectMetaMask = () => {
  return new Promise((resolve, reject) => {
    const ethereum = window?.ethereum;
    if (ethereum) {
      try {
        // user auth
        if (ethereum.request != undefined) {
          ethereum.request({ method: 'eth_requestAccounts' });
        } else {
          ethereum.enable();
        }
        resolve(true);
      } catch (error) {
        // user not auth
        reject(error);
      }
    } else {
      reject('No Ethereum');
    }
    if (typeof ethereum !== 'undefined') {
      web3 = new Web3(ethereum);
      // getNetwork();
      // if (ethereum.isMetaMask) {
      //   currWalletType = 'MetaMask';
      // } else {
      //   currWalletType = 'Ethereum';
      // }
    }
  });
};

const connectWallet = () => {
  return new Promise((resolve, reject) => {
    if (web3 === undefined) {
      currWalletAddress = undefined;
      const error = 'no wallet';
      reject(error);
      return;
    }
    web3?.eth
      ?.getAccounts()
      .then((accounts: string[]) => {
        if (accounts.length > 0) {
          currWalletAddress = accounts[0].toLowerCase();
          useSignature(currWalletAddress);
        } else {
          currWalletAddress = undefined;
        }
        resolve(currWalletAddress);
      })
      .catch((err: any) => {
        currWalletAddress = undefined;
        console.error('getAccounts error :' + err);
        reject(err);
      });
  });
};

// 签名
const useSignature = (account: string) => {
  const _web3 = web3 || new Web3(window?.ethereum);
  if (!account) {
    return;
  }
  return new Promise(() => {
    getNonce(account)
      .then((sign: any) => {
        _web3?.eth?.personal
          ?.sign(sign.data, account)
          .then((value: string) => {
            login(account, value).then((token: any) => {
              if (token?.data) {
                message.success(i18n.t('hint.loginSuccess'));
                setLocalStorage('wallet', account);
                removeCookie('web-token');
                setCookie('web-token', token.data, 1);
                history.push('/marketplace');
              }
            });
          })
          .catch((err: any) => {
            console.log('signature error: ', err, account);
            removeLocalStorage('wallet');
            removeCookie('web-token');
            history.push('/');
          });
      })
      .catch((err: any) => {
        console.log('nonce error: ', err);
      });
  });
};

const onEthereumEvent = (deactivate?: any) => {
  // const { t} = useTranslation()
  const ethereum = window?.ethereum;
  if (ethereum?.isMetaMask) {
    ethereum.on('accountsChanged', (accounts: string[]) => {
      // "accounts" will always be an array, but it can be empty.
      const account = accounts[0]?.toLowerCase();
      if (!account) return;
      removeLocalStorage('wallet');
      removeCookie('web-token');
      // 切换账号跳转登录页
      // useSignature(account);
      window.location.reload();
      history.push('/login');
    });

    ethereum.on('chainChanged', (chainId: string) => {
      // Handle the new chain.
      // getNetwork();
      const _chainId = parseInt(chainId);
      const supportedChainIds = injected.supportedChainIds;
      if (_chainId !== 1319 && isProd) {
        message.success(i18n.t('hint.switchMainnet'));
        logOut(deactivate);
      }
      // if (supportedChainIds?.includes(_chainId)) {
      //   logOut(deactivate);
      // }
    });
  }
};

const logOut = (deactivate?: any) => {
  logout()
    .then((res: any) => {
      if (res?.message === 'success') {
        removeLocalStorage('wallet');
        removeCookie('web-token');
        if (!!deactivate) {
          deactivate(); // 退出时eth的wallet断开连接
        }
        history.push('/');
        // window.location.reload();
      }
    })
    .catch((err: any) => {
      console.log('signature error: ', err);
      if (!!deactivate) {
        deactivate(); // 退出时eth的wallet断开连接
      }
      removeLocalStorage('wallet');
      removeCookie('web-token');
      history.push('/login');
      // window.location.reload();
    });
};

export default {
  onEthereumEvent,
  connectMetaMask,
  connectWallet,
  useSignature,
  logOut,
};
