import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import useWeb3 from '../../hooks/useWeb3'
import { setCookie, setLocalStorage } from 'Utils/utils'
import { SwitchChainRequest, SupportedChain, hasWallet } from '../../utils/walletUtils'
import WalletConnectProvider from "@walletconnect/web3-provider"
import { providers } from 'ethers'
import { getNonce, login } from 'Src/api/index'
import { message } from 'antd'
import { isProd } from '../../config/constants'
import Constants from '../../config/constants'

const { INIT_CHAIN } = Constants
const walletList = [
  {
    name: 'MetaMask',
    logo: require('Src/assets/coin/metaMask.png'),
  },
  {
    name: 'coinBase',
    logo: require('Src/assets/coin/coinbase.png'),
  },
  {
    name: 'WalletConnect',
    logo: require('Src/assets/coin/wallectConnect.png'),
  },
]

const ConnectModal: React.FC<any> = (props) => {
  const { onCancel } = props
  const { t } = useTranslation()
  const web3 = useWeb3()
  const history = useHistory()


  const onCancelClick = () => {
    onCancel && onCancel()
  }

  const connectWallets = async (walletName: string) => {
    if (!(window as any).ethereum && walletName != 'WalletConnect') {
      walletName == 'MetaMask' ? window.open('https://metamask.io/download') : window.open('https://www.coinbase.com/wallet')
      return
    }

    if (!(window as any).ethereum?.providers && walletName != 'WalletConnect') {
      if (!(window as any).ethereum.isMetaMask && walletName == 'MetaMask') {
        window.open('https://metamask.io/download')
        return
      };
      if (!(window as any).ethereum.isCoinbaseWallet && walletName == 'coinBase') {
        window.open('https://www.coinbase.com/wallet')
        return
      };
    }

    let web3Provider
    let singer: any
    if (walletName == 'WalletConnect') {
      try {
        const wallet_conncet_provider = new WalletConnectProvider({
          rpc: {
            1320: "http://http-testnet.aitd.io", //aitd测试链
            1319: "https://walletrpc.aitd.io" // aitd主链
          },
        })
        await wallet_conncet_provider.enable()
        web3Provider = new providers.Web3Provider(wallet_conncet_provider)
        singer = web3Provider.getSigner()
        const addr = await singer.getAddress()
        signs(walletName, addr, singer)

      } catch (error) {

      }


    } else {
      //check providers length
      if ((window as any).ethereum.providers?.length) {
        (window as any).ethereum.providers.forEach(async (p: any) => {
          (window as any).ethereum.providers.forEach(async (p: any) => {
            if (walletName == 'coinBase' && p.isCoinbaseWallet) singer = p
            if (walletName == 'MetaMask' && p.isMetaMask) singer = p
          })
        })
      } else {
        singer = (window as any).ethereum
      }
      await singer.request({ method: "eth_requestAccounts" })
        .then(async (accounts: string) => {
          // 查找钱包链ID 不是AITD主网 弹出小狐狸切换弹窗
          if (isProd && hasWallet() && singer.chainId !== INIT_CHAIN) {
            SwitchChainRequest(INIT_CHAIN as SupportedChain)
              .then(() => {
                signs(walletName, accounts[0], singer)
              })
              .catch(() => {
                window.location.reload()
              })
          } else {
            signs(walletName, accounts[0], singer)
          }
        }

        )
        .catch((err: any) => console.log(err))

      web3Provider = new providers.Web3Provider(singer)

    }
    // (window as any).provider = web3Provider?.provider
    (window as any).provider = web3Provider?.getSigner()
    const addr = await (window as any).provider.getAddress()
    localStorage.setItem('accountAddress', addr)
  }

  const signs = async (walletName: string, accounts: string, providers: any) => {
    // 获取签名
    const getNonces: any = await getNonce(accounts)
    let signature = ''
    if (walletName == 'WalletConnect') {
      signature = await providers.signMessage(getNonces.data)
    } else {
      signature = await providers.request({
        method: "personal_sign",
        params: [
          web3.utils.fromUtf8(getNonces.data),
          accounts
        ]
      })
    }
    setLocalStorage('walletName', walletName)
    login(accounts, signature).then((token: any) => {
      if (token?.data) {
        // debugger
        console.log((window as any).provider, '(window as any).provider')

        message.success(t('hint.loginSuccess'))
        onCancelClick()
        setLocalStorage('wallet', accounts)
        setCookie('web-token', token.data, 1)
        location.reload()
        // history.push('/marketplace')
      }
    })
  }
  return (
    <Modal title='' open={props?.visible} footer={null} onCancel={onCancelClick} closable={true}>
      <div className='contentWaper'>
        <div className='content-title'>
          <h3>欢迎来到 Diffgalaxy</h3>
          <p>连接你的钱包，开始使用</p>
        </div>
        {walletList.map((item: any, index) => {
          return (
            <div className='connectItem' key={index} onClick={() => connectWallets(item.name)}>
              <img src={item.logo} alt="" />
              <p>{item.name}</p>
            </div>
          )
        })
        }
      </div>
    </Modal>
  )
}
export default ConnectModal