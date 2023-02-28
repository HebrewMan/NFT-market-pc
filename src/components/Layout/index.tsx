import React, { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { useWeb3React } from '@web3-react/core'
import { AppBar } from '../AppBar'
import { Footer } from '../Footer'
import useWindowDimensions from '../../utils/layout'
const { Header, Content } = Layout
import { injected } from '../../utils/utils'
import WalletConnectProvider from "@walletconnect/web3-provider"
import { providers } from 'ethers'
import './index.scss'

export const AppLayout = React.memo((props: any) => {
  const { width } = useWindowDimensions()
  const { account, activate, active } = useWeb3React()


  useEffect(() => {
    connectWallet()
  }, [])

  const connectWallet = async () => {
    const walletName = localStorage.getItem('walletName')
    let web3Provider
    if (walletName === 'WalletConnect') {
      try {
        const wallet_conncet_provider = new WalletConnectProvider({
          rpc: {
            1320: "http://http-testnet.aitd.io", //aitd测试链
            1319: "https://walletrpc.aitd.io" // aitd主链
          },
        })
        await wallet_conncet_provider.enable()
        web3Provider = new providers.Web3Provider(wallet_conncet_provider)
      } catch (error) {

      }
    } else {
      let singer: any
      if ((window as any).ethereum.providers?.length) {
        (window as any).ethereum.providers.forEach(async (p: any) => {
          if (walletName == 'coinBase' && p.isCoinbaseWallet) singer = p
          if (walletName == 'MetaMask' && p.isMetaMask) singer = p
        })
      } else {
        singer = (window as any).ethereum
      }
      web3Provider = new providers.Web3Provider(singer)
    }
    window.provider = web3Provider?.provider
  }
  return (
    <div>
      <Layout id={'main-layout'}>
        <div className={`pc-App-Bar`}>
          <AppBar />
        </div>
        {/* <div className='lenheigth'></div> */}
        <Layout id={'width-layout'}>
          <Content>{props.children}</Content>
        </Layout>
        <Footer />
      </Layout>
    </div>
  )
})
