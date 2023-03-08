import React from 'react';
import { getNonce, login, logout } from '../api/index';
import Web3 from 'web3';
import { setLocalStorage, setCookie, removeCookie, removeLocalStorage } from '../utils/utils';
import { message } from 'antd';
import history from '../utils/history';
import { injected } from '../utils/utils';
import { isProd } from '../config/constants';
import i18n from 'i18next';
import { useHistory, useParams } from 'react-router-dom'
declare global {
  interface Window {
    ethereum: any;
    web3: any;
    menuTimer: any;
    provider: any;
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
    const ethereum = window?.provider;
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

// 监听切换账号 ，链切换 账号切换
const onEthereumEvent = () => {
  const ethereum = window?.provider;
  if (ethereum) {
    ethereum.on('accountsChanged', (accounts: string[]) => {
      // "accounts" will always be an array, but it can be empty.
      const account = accounts[0]?.toLowerCase();
      if (!account) return;
      removeLocalStorage('wallet');
      removeCookie('web-token');
      logOut()
      history.push(`/marketplace`)
      window.location.reload();
      // 如果当前路由是 用户中心页面
      // 获取路由参数，更新参数
      // 刷新页面
      // if(window.location.pathname.indexOf('/account') != -1){
      //    history.push('/')
      //   //  const history = useHistory()
      //   //  history.push(`/account/0/${accounts}`)

      // }
      // window.location.reload();
    });

    ethereum.on('chainChanged', (chainId: string) => {
      const _chainId = parseInt(chainId);
      const supportedChainIds = injected.supportedChainIds;
      if (_chainId !== 1319 && isProd) {
        message.success(i18n.t('hint.switchMainnet'));
        logOut();
      }
      // if (supportedChainIds?.includes(_chainId)) {
      //   logOut(deactivate);
      // }
    });
  }
};

// 退出登录
const logOut = () => {
  logout()
    .then((res: any) => {
      if (res?.message === 'success') {
        removeLocalStorage('wallet');
        removeCookie('web-token');
        history.push('/');
      }
    })
};

export default {
  onEthereumEvent,
  connectMetaMask,
  logOut,
};
