import { ReactNode } from 'react';
import Constants from '../config/constants';

const { CHAIN_CACHE_KEY, INIT_CHAIN, SUPPORTED_CHAINS, CHAIN_INFO } = Constants;
const WalletCacheKey = '_WALLET_TYPE';

export type SupportedChain = 1319 | 1320;
export interface WalletConnectorType {
  title: string;
  icon: JSX.Element | ReactNode;
  status: boolean;
}

export enum WalletList {
  Metamask = 'Metamask',
  WalletConnect = 'WalletConnect',
}

export const Supported_Wallets: WalletConnectorType[] = [
  {
    title: WalletList.Metamask,
    icon: '../assets/images/login/aitd.png',
    status: true,
  },
];

export const IgnoredConnectErrors = ['NoEthereumProviderError', 't', 'UserRejectedRequestError'];

export const hasWallet = () => Boolean(window?.provider);

export const WalletCache = {
  setType(value: WalletList) {
    localStorage.setItem(WalletCacheKey, value);
  },
  getType() {
    return localStorage.getItem(WalletCacheKey) || '';
  },
  removeType() {
    localStorage.removeItem(WalletCacheKey);
  },
  getChain: () => {
    const walletChain = parseInt(window?.provider?.chainId);
    const cache = Number(localStorage.getItem(CHAIN_CACHE_KEY));
    let correctChain = INIT_CHAIN;
    // 连接了钱包 => 当前钱包链ID是否是项目支持的链 ? 取钱包iD : 到缓存里面找
    // 没连接钱包 直接到缓存找
    if (hasWallet()) {
      if (SUPPORTED_CHAINS.includes(walletChain)) {
        correctChain = walletChain;
      } else if (SUPPORTED_CHAINS.includes(cache)) {
        correctChain = cache;
      }
    } else {
      if (SUPPORTED_CHAINS.includes(cache)) {
        correctChain = cache;
      }
    }
    localStorage.setItem(CHAIN_CACHE_KEY, correctChain + '');
    return correctChain;
  },
  getChainCache: () => {
    return Number(localStorage.getItem(CHAIN_CACHE_KEY));
  },
  setChain: (chainId: number | string | undefined | null) => {
    localStorage.setItem(CHAIN_CACHE_KEY, (chainId || INIT_CHAIN) + '');
  },
};

export const monitorAccountsChanged = (cb: (data: any) => void) => {
  window?.provider?.on('accountsChanged', (accounts: any) => {
    cb(accounts);
    window.location.reload();
  });
};

export const monitorChainChange = (cb?: () => void) => {
  window?.provider?.on('chainChanged', (chain: any) => {
    if (chain) {
      const chainId = parseInt(chain);
      if (SUPPORTED_CHAINS.includes(chainId)) {
        WalletCache.setChain(chainId);
      }
    }
    WalletCache.removeType();
    cb?.();
    window.location.reload();
  });
};

export const SwitchChainRequest = (certainChain: SupportedChain, errorCB?: () => void) => {
  return new Promise(async (reslove, reject) => {
    console.log('deee: ', certainChain);
    try {
      await window?.provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + certainChain.toString(16) }],
      });
      WalletCache.setChain(certainChain);
      reslove(true);
    } catch (e: any) {
      if (e?.code === 4902) {
        try {
          await window?.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x' + certainChain.toString(16),
                chainName: (CHAIN_INFO as any)?.[certainChain + '']?.chainName,
                rpcUrls: (CHAIN_INFO as any)?.[certainChain + '']?.rpcUrl,
              },
            ],
          });

          WalletCache.setChain(certainChain);
          reslove(true);
        } catch (addError: any) {
          console.log('catch2: ', certainChain, addError);
          reject();
        }
      }
      console.log('catch1: ', certainChain, e);
      reject();
    }
  });
};
