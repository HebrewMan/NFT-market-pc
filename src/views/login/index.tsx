import React, { useEffect, useState, useMemo, memo } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
// import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { removeCookie, removeLocalStorage, wallets, setCookie, setLocalStorage } from '../../utils/utils'
import $web3js from '../../hooks/web3'
import useWeb3 from '../../hooks/useWeb3'
import { SwitchChainRequest, SupportedChain, hasWallet } from '../../utils/walletUtils'
import Constants from '../../config/constants'
import { chainId } from '../../hooks/web3Utils'
import { isProd } from '../../config/constants'
import './index.scss'
import WalletConnectProvider from "@walletconnect/web3-provider"
import { providers } from 'ethers'
import { getNonce, login, logout } from 'Src/api/index'
import { message } from 'antd'
import Web3 from 'web3'
import { values } from 'lodash'
const { INIT_CHAIN, SUPPORTED_CHAINS } = Constants
import { useHistory } from 'react-router-dom'

export const Login = () => {
  const { t } = useTranslation()
  const history = useHistory()
  // connector
  const { active, account, activate, deactivate, library } = useWeb3React()
  const web3 = useWeb3()
  // eth 调用签名
  const connectMetaMask = () => {
    // $web3js.connectMetaMask().then(() => {
    // $web3js.connectWallet().finally(() => { })
    // })
  }

  // 清空localStorage和cookie
  const clearLocalAndCookie = () => {
    removeLocalStorage('wallet')
    removeCookie('web-token')
  }
  // const connectWallet = (walletInfo: any) => {
  //   const { name } = walletInfo
  //   const { connector }: { connector: AbstractConnector | undefined } = walletInfo
  //   // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
  //   // && connector.walletConnectProvider?.wc?.uri
  //   if (connector instanceof WalletConnectConnector) {
  //     connector.walletConnectProvider = undefined
  //   }
  //   // eth钱包连接
  //   if (connector && !account) {
  //     // activateInjectedProvider(name)
  //     activate(connector, undefined, true)
  //       .then(() => {
  //         clearLocalAndCookie()
  //         //查找钱包链ID 不是AITD主网 弹出小狐狸切换弹窗
  //         if (isProd && hasWallet() && chainId !== INIT_CHAIN) {
  //           SwitchChainRequest(INIT_CHAIN as SupportedChain)
  //             .then(() => {
  //               connectMetaMask()
  //             })
  //             .catch(() => {
  //               window.location.reload()
  //             })
  //         } else {
  //           connectMetaMask()
  //         }
  //       })
  //       .catch((error) => {
  //         console.log('error:::', error)
  //         // 链错了，重新连接
  //         if (error instanceof UnsupportedChainIdError) {
  //           activate(connector) // a little janky...can't use setError because the connector isn't set
  //         } else {
  //           // setPendingError(true)
  //         }
  //       })
  //   } else {
  //   }
  // }
  return (
    <div className='login-component'>
      <div className='login-inner'>
        <div className='inner-wrap'>
          <h1>{t('common.signIn')}</h1>
          <ul className='login-wallet'>
            {wallets.map((item) => {
              return (
                <li key={item.name}>
                  <button>
                    <img src={item.logoURI} alt={`${item.name} logo`} />
                    <div>{item.name}</div>
                  </button>
                  <img src={require('../../assets/icon-to.png')} alt='' />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
