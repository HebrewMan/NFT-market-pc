import React, { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import useWindowDimensions from '../../utils/layout'
import { useWeb3React } from '@web3-react/core'
import { HeaderMenu } from '../Menu'
import useWallet from '../../providers'
import { getCookie, getLocalStorage } from '../../utils/utils'
import './index.scss'

const getDefaultLinkActions = () => {
  return [<HeaderMenu key={1} />]
}

const DefaultActions = ({ vertical = false }: { vertical?: boolean }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        width: '100%'
      }}
    >
      {getDefaultLinkActions()}
    </div>
  )
}

export const MetaplexMenu = () => {
  // const { deactivate } = useWeb3React();
  // const history = useHistory();
  // const { width } = useWindowDimensions();
  // const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const token = getCookie('web-token') || ''
  const walletAccount = localStorage.getItem('wallet') || ''
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    if (!walletAccount || !token) {
      setIsLogin(false)
    } else {
      setIsLogin(true)
    }
  }, [walletAccount, token])

  return <DefaultActions vertical={false} />
}

export const LogoLink = () => {
  return (
    <>
      <Link to={`/`} className='logo-link'>
        <img src={require('Src/assets/home/logo.svg')} width={132} height={40} alt='' />
        {/* <h1>DIFFGALAXY</h1> */}
      </Link>
    </>
  )
}

export const AppBar = () => {
  const { width } = useWindowDimensions()
  const wallet = useWallet()
  useEffect(() => {
    const walletData = getLocalStorage('wallet')
    if (walletData) {
      const chainName = 'aitd'
      wallet.connect(chainName)
    }
    // 监听屏幕滚动
    window.addEventListener('scroll', handleScroll, true)
  }, [])

  const handleScroll = (event: any) => {
    const mainContentEl: any = document.documentElement.scrollTop
    const headerEl: any = document.getElementById('desktop-navbar')
    const headerLink: any = document.getElementById('main-link')
    if (mainContentEl > 10) {
      headerEl.style.background = '#0E102B'
      headerLink != null ? headerLink.style.display = 'none' : null
    } else {
      headerEl.style.background = 'transparent'
      headerLink != null ? headerLink.style.display = 'block' : null
    }
  }
  return (
    <>
      <div id='desktop-navbar'>
        <div className='app-left'>
          <LogoLink />
        </div>
        <div className='app-right'>
          <MetaplexMenu />
        </div>
      </div>
    </>
  )
}
