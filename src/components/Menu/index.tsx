import React, { useEffect, useState } from 'react'
import { Link, useHistory, NavLink } from 'react-router-dom'
import { Button, MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'
import { SelectGroup } from '../HeaderSearch'
import { getCookie, removeCookie, removeLocalStorage } from '../../utils/utils'
import { useWeb3React } from '@web3-react/core'
import $web3js from '../../hooks/web3'
import { getAccountInfo } from '../../api/user'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { Language } from '../../utils/enum'
import { changeLanguage } from '../../utils/i18n'
import { showConnectModal } from "Src/components/ConnectModal"

export const HeaderMenu = () => {
  const { t, i18n } = useTranslation()
  const history = useHistory()
  const [dom, setDom] = useState('')
  const token = getCookie('web-token') || ''
  const walletAccount = localStorage.getItem('wallet') || ''
  const defaultImg = require('../../assets/account/default_header.png')
  const [accountImg, setAccountImg] = useState(defaultImg)
  const [isLogin, setIsLogin] = useState(false)
  const [lang, setLang] = useState('简体中文')


  const items: MenuProps['items'] = [
    { key: Language.zh, label: '中文简体' },
    { key: Language.tw, label: '中文繁體' },
    { key: Language.en, label: 'English' },
    { key: Language.jp, label: '日本語' },
    { key: Language.tk, label: 'T ürkiye dili' },
  ]

  useEffect(() => {
    const Lang = localStorage.getItem('NFT_LANG_KEY')
    items.map((option: any) => {
      if (Lang === option.key) {
        setLang(option.label)
      }
    })
  }, [])

  const showMenu = (selector: any) => {
    clearInterval(window.menuTimer)
    setDom(selector)
  }
  const hideMenu = () => {
    window.menuTimer = setTimeout(() => {
      setDom('')
    }, 300)
  }
  const handleMenuClick: MenuProps['onClick'] = (item: any) => {
    changeLanguage(item?.key)
    items.map((option: any) => {
      if (item?.key === option.key) {
        setLang(option.label)
      }
    })
    /**
      有的路由要刷新当前页面，因为页面里用了ui组件 必须要刷新 文案才会更新
    */
    const listPath = [
      "/marketplace",
      "/helpcenter",
      '/activityDetail',
    ]
    const product = window.location.pathname.indexOf('/asset') != -1
    const account = window.location.pathname.indexOf('/account') != -1
    if (listPath.indexOf(window.location.pathname) != -1 || product || account) {
      window.location.reload()
    }
  }
  const clearLogin = async () => {
    removeLocalStorage('wallet')
    removeCookie('web-token')
    removeLocalStorage('walletName')
    removeLocalStorage('provider')
    if (localStorage.walletName == 'WalletConnect') await (window?.provider?.disconnect())
    history.push('/')
    location.reload()
  }

  // t退出
  const getLogOut = () => {
    $web3js.logOut()
    setTimeout(() => {
      clearLogin()
    }, 200)
  }

  // 登录
  const getLogin = () => {
    showConnectModal(true)
  }
  // 获取用户信息
  useEffect(() => {
    if (!walletAccount || !token) {
      setIsLogin(false)
      setAccountImg(defaultImg)

      // clearLogin()
    } else {
      const getLoginUserInfo = async () => {
        const res: any = await getAccountInfo(walletAccount)
        if (res.data) {
          localStorage.setItem('userInfo', JSON.stringify(res.data))
        }
        const imageUrl = res?.data?.imageUrl
        setIsLogin(true)
        if (!!imageUrl) {
          setAccountImg(imageUrl)
        } else {
          setAccountImg(defaultImg)
        }
      }
      getLoginUserInfo()
    }
  }, [walletAccount, token])

  const menuProps = {
    items,
    onClick: handleMenuClick,
  }

  return (
    <div className='navbar--items'>
      <div className='navbar--items-left'>
        {/* <div className='item' onMouseOver={() => showMenu('js-hone')} onMouseLeave={() => hideMenu()}>
          <NavLink exact activeClassName='current' className={dom === 'js-hone' ? 'active' : ''} to={`/`}>
            {t('nav.home')}
          </NavLink>
        </div> */}
        <div className='item' onMouseOver={() => showMenu('js-stats')} onMouseLeave={() => hideMenu()}>
          <NavLink activeClassName='current' className={dom === 'js-stats' ? 'active' : ''} to={`/primary`}>
            {t('nav.primary')}
          </NavLink>
        </div>
        <div className='item' onMouseOver={() => showMenu('js-market')} onMouseLeave={() => hideMenu()}>
          <NavLink activeClassName='current' className={dom === 'js-market' ? 'active' : ''} to={`/marketplace`}>
            {t('nav.market')}
          </NavLink>
        </div>
        <div className='item' onMouseOver={() => showMenu('js-market')} onMouseLeave={() => hideMenu()}>
          <NavLink activeClassName='current' className={dom === 'js-market' ? 'active' : ''} to={`/rankings`}>
            {t('nav.ranking')}
          </NavLink>
        </div>
        {/* <div className='item' onMouseOver={() => showMenu('js-helpcenter')} onMouseLeave={() => hideMenu()}>
          <NavLink activeClassName='current' to={`/helpcenter`} className={dom === 'js-helpcenter' ? 'active' : ''}>
            {t('nav.help')}
          </NavLink>
        </div> */}
      </div>
      <div className='navbar--items-right'>
        <div className='search-com'>
          <SelectGroup></SelectGroup>
        </div>
        {/* 多语言 */}
        <div className='langWaper'>
          <Dropdown menu={menuProps} overlayClassName='langDrodown' placement='bottom'>
            <Space>
              <img className='language-img' src={require('Src/assets/home/icon-lang.svg')} alt='language' />
              {/* {lang} */}
            </Space>
          </Dropdown>
        </div>
        {/* 已登录显示菜单 */}
        {
          !token && !walletAccount ? (
            <Button type='primary' className='linkWallet' onClick={getLogin}>
              {t('nav.cnnectWallet')}
            </Button>
          ) :
            (
              <div className='' onMouseOver={() => showMenu('js-account')} onMouseLeave={() => hideMenu()}>
                <Link
                  to={token && walletAccount ? `/account/0/${walletAccount}` : `/`}
                  className={`account-menu ${dom === 'js-account' ? 'active' : ''}`}
                >
                  <img src={accountImg} className='account-active' alt='' />
                </Link>

                {dom === 'js-account' ? (
                  <div
                    id='js-account'
                    className={`tippy-box ${dom === 'js-account' ? 'opacity' : 'opacity'}`}
                    onMouseLeave={() => hideMenu()}
                    onMouseOver={() => showMenu('js-account')}
                  >
                    <div className='tippy-content'>
                      <ul>
                        <li>
                          <Link to={`/account/0/${walletAccount}`}>
                            <img src={require('Src/assets/common/account-my-NFTs.png')} alt='' />
                            <div className='txt'>
                              <span>{t('nav.myNft')}</span>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link to={`/account/collection`}>
                            <img src={require('Src/assets/common/account-my-collection.png')} alt='' />
                            <div className='txt'>
                              <span>{t('nav.myCollection')}</span>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link to={`/user-settings/${walletAccount}`}>
                            <img src={require('Src/assets/common/account-setting.png')} alt='' />
                            <div className='txt'>
                              <span>{t('nav.setting')}</span>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <a onClick={getLogOut}>
                            <img src={require('Src/assets/common/account-log-out.png')} alt='' />
                            <div className='txt'>
                              <span>{t('nav.loginOut')}</span>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )
        }
      </div>
    </div >
  )
}
