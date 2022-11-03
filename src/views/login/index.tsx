import React, { useEffect, useState, useMemo, memo } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
// import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { removeCookie, removeLocalStorage } from '../../utils/utils';
import $web3js from '../../hooks/web3';
import { wallets } from '../../../src/utils/utils';
import useWeb3 from '../../hooks/useWeb3';
import { SwitchChainRequest, SupportedChain, hasWallet } from '../../utils/walletUtils';
import Constants from '../../config/constants';
import { chainId } from '../../hooks/web3Utils';
import { isProd } from '../../config/constants';
import './index.scss';

const { INIT_CHAIN } = Constants;

export const Login = () => {
  // connector
  const { active, account, activate, deactivate } = useWeb3React();
  const web3 = useWeb3();
  // eth 调用签名
  const connectMetaMask = () => {
    $web3js.connectMetaMask().then(() => {
      $web3js.connectWallet().finally(() => {});
    });
  };

  useEffect(() => {
    console.log(account, '-----account');
  }, [account]);

  // 清空localStorage和cookie
  const clearLocalAndCookie = () => {
    removeLocalStorage('wallet');
    removeCookie('web-token');
  };
  const connectWallet = (walletInfo: any) => {
    const { connector }: { connector: AbstractConnector | undefined } = walletInfo;
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    // && connector.walletConnectProvider?.wc?.uri
    if (connector instanceof WalletConnectConnector) {
      connector.walletConnectProvider = undefined;
    }

    // eth钱包连接
    if (connector && !account) {
      activate(connector, undefined, true)
        .then(() => {
          clearLocalAndCookie();
          //查找钱包链ID 不是AITD主网 弹出小狐狸切换弹窗
          if (isProd && hasWallet() && chainId !== INIT_CHAIN) {
            SwitchChainRequest(INIT_CHAIN as SupportedChain)
              .then(() => {
                connectMetaMask();
              })
              .catch(() => {
                window.location.reload();
              });
          } else {
            connectMetaMask();
          }
        })
        .catch((error) => {
          console.log('error:::', error);
          // 链错了，重新连接
          if (error instanceof UnsupportedChainIdError) {
            activate(connector); // a little janky...can't use setError because the connector isn't set
          } else {
            // setPendingError(true)
          }
        });
    }
  };
  return (
    <div className='login-component'>
      <div className='login-inner'>
        <div className='inner-wrap'>
          <h1>Sign in to your wallet</h1>
          <ul className='login-wallet'>
            {wallets.map((item) => {
              return (
                <li key={item.name} onClick={() => connectWallet(item)}>
                  <button>
                    <img src={item.logoURI} alt={`${item.name} logo`} />
                    <div>{item.name}</div>
                  </button>
                  <img src={require('../../assets/icon-to.png')} alt='' />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
