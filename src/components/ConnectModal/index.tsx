import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import $web3js from '../../hooks/web3'
// import { connectors } from "Utils/connectors"

const ConnectModal: React.FC<any> = (props) => {
  const { onCancel } = props
  const { t } = useTranslation()
  const history = useHistory()
  const walletAccount: string = localStorage.getItem('wallet') || ''
  const { account, active, deactivate, activate } = useWeb3React()


  const onCancelClick = () => {
    onCancel && onCancel()
  }

  const setProvider = (type: string) => {
    window.localStorage.setItem("provider", type)
  }

  const connectWallet = (walletInfo: any) => {
    console.log(walletInfo, 'walletInfo')

    // const { connector }: { connector: AbstractConnector | undefined } = walletInfo
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    // && connector.walletConnectProvider?.wc?.uri
    // if (connector instanceof WalletConnectConnector) {
    //   connector.walletConnectProvider = undefined
    // }

    // eth钱包连接
    // if (connector && !account) {
    //   activate(connector, undefined, true)
    //     .then(() => {
    //       clearLocalAndCookie()
    //       //查找钱包链ID 不是AITD主网 弹出小狐狸切换弹窗
    //       if (isProd && hasWallet() && chainId !== INIT_CHAIN) {
    //         SwitchChainRequest(INIT_CHAIN as SupportedChain)
    //           .then(() => {
    //             connectMetaMask()
    //           })
    //           .catch(() => {
    //             window.location.reload()
    //           })
    //       } else {
    //         connectMetaMask()
    //       }
    //     })
    //     .catch((error) => {
    //       console.log('error:::', error)
    //       // 链错了，重新连接
    //       if (error instanceof UnsupportedChainIdError) {
    //         activate(connector) // a little janky...can't use setError because the connector isn't set
    //       } else {
    //         // setPendingError(true)
    //       }
    //     })
    // }
  }
  return (
    <Modal title='' open={props?.visible} footer={null} onCancel={onCancelClick} closable={true}>
      <div className='contentWaper'>
        <div className='content-title'>
          <h3>欢迎来到 Diffgalaxy</h3>
          <p>连接你的钱包，开始使用</p>
        </div>
        <div className='connectItem'
          onClick={() => {
            // activate(connectors.coinbaseWallet)
            setProvider("coinbaseWallet")
            onCancelClick()
          }}>
          <img src={require("Src/assets/coin/coinbase.png")} alt="" />
          <p>Coinbase Wallet</p>
        </div>
        <div className='connectItem'
          onClick={() => {
            // activate(connectors.walletConnect)
            setProvider("coinbaseWallet")
            onCancelClick()
          }}>
          <img src={require("Src/assets/coin/wallectConnect.png")} alt="" />
          <p>Wallet Connect</p>
        </div>
        <div className='connectItem'
          onClick={() => {
            // connectWallet(connectors.injected)
            // activate(connectors.injected)
            setProvider("coinbaseWallet")
            onCancelClick()
          }}>
          <img src={require("Src/assets/coin/metaMask.png")} alt="" />
          <p>Metamask</p>
        </div>
      </div>
    </Modal>
  )
}
export default ConnectModal