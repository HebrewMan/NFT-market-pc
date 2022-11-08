import React, { useEffect, useState } from 'react';
import { Link, useHistory, NavLink } from 'react-router-dom';
import { Slider } from '../Slider';
import { SelectGroup } from '../HeaderSearch';
import { getCookie, removeCookie, removeLocalStorage } from '../../utils/utils';
import { useWeb3React } from '@web3-react/core';
import $web3js from '../../hooks/web3';
import { getAccountInfo } from '../../api/user';
import './index.scss';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

export const HeaderMenu = () => {
  const { account, active, deactivate } = useWeb3React();
  const history = useHistory();
  const [dom, setDom] = useState('');
  const token = getCookie('web-token') || '';
  const walletAccount = localStorage.getItem('wallet') || '';
  const [showDropper, setShowDropper] = useState(false);
  const defaultImg = require('../../assets/default_header.png');
  const [accountImg, setAccountImg] = useState(defaultImg);
  const [isLogin, setIsLogin] = useState(false);
  const showMenu = (selector: any) => {
    clearInterval(window.menuTimer);
    setDom(selector);
  };
  const enum Language {
    en = 'en-US',
    zh = 'zh-CN',
    tw = 'zh-TW',
    jp = 'zh-JP',
    tk = 'tr-TK',
  }
  const items: MenuProps['items'] = [
    { key: Language.en, label: 'English' },
    { key: Language.zh, label: '简体中文' },
    { key: Language.tw, label: '繁體中文' },
    { key: Language.jp, label: '日本語' },
    { key: Language.tk, label: 'Türkçe, Türk dil' },
  ];
  const hideMenu = () => {
    window.menuTimer = setTimeout(() => {
      setDom('');
    }, 300);
  };

  const clearLogin = () => {
    removeLocalStorage('wallet');
    removeCookie('web-token');
    /**一定要加已登录的判断，因为此处“点击登录”之后会请求一遍，而后台登录代码会在此处代码之后执行，
     * 导致walletAccount和token为空，然而此时却连接了钱包，使得!!deactivate为true,就会断开连接
     */
    if (!!deactivate && isLogin) {
      deactivate(); // 退出时eth的wallet断开连接
    }
    // 取消强制跳转login
    // history.push('/login');
  };
  const getLogOut = () => {
    // 已登录，点击退出
    if (isLogin) {
      $web3js.logOut(deactivate);
    } else {
      clearLogin();
      if (!!deactivate) {
        deactivate(); // 退出时eth的wallet断开连接
      }
      history.push('/login');
    }
  };
  useEffect(() => {
    if (!walletAccount || !token) {
      setIsLogin(false);
      setAccountImg(defaultImg);
      clearLogin();
    } else {
      const getLoginUserInfo = async () => {
        const res: any = await getAccountInfo(account?.toLocaleLowerCase() || walletAccount);
        if (res.data) {
          localStorage.setItem('userInfo', JSON.stringify(res.data));
        }

        const imageUrl = res?.data?.imageUrl;
        setIsLogin(true);
        if (!!imageUrl) {
          setAccountImg(imageUrl);
        } else {
          setAccountImg(defaultImg);
        }
      };
      getLoginUserInfo();
    }
  }, [walletAccount, token, account?.toLocaleLowerCase()]);
  return (
    <div className='navbar--items'>
      <div className='navbar--items-left'>
        <div className='item' onMouseOver={() => showMenu('js-hone')} onMouseLeave={() => hideMenu()}>
          <NavLink exact activeClassName='current' className={dom === 'js-hone' ? 'active' : ''} to={`/`}>
            Home
          </NavLink>
        </div>
        <div className='item' onMouseOver={() => showMenu('js-stats')} onMouseLeave={() => hideMenu()}>
          <NavLink activeClassName='current' className={dom === 'js-stats' ? 'active' : ''} to={`/primary`}>
            Primary
          </NavLink>
        </div>
        <div className='item' onMouseOver={() => showMenu('js-market')} onMouseLeave={() => hideMenu()}>
          <NavLink activeClassName='current' className={dom === 'js-market' ? 'active' : ''} to={`/marketplace`}>
            Marketplace
          </NavLink>
        </div>

        <div className='item' onMouseOver={() => showMenu('js-helpcenter')} onMouseLeave={() => hideMenu()}>
          <NavLink activeClassName='current' to={`/helpcenter`} className={dom === 'js-helpcenter' ? 'active' : ''}>
            HelpCenter
          </NavLink>
        </div>
      </div>
      <div className='navbar--items-right'>
        <div className='search-com'>
          <SelectGroup></SelectGroup>
        </div>
        <Dropdown menu={{ items }}>
            <a onClick={e => e.preventDefault()}>
              <>
                中文简体
                <DownOutlined />
              </>
            </a>
          </Dropdown>
        <div className='item' onMouseOver={() => showMenu('js-account')} onMouseLeave={() => hideMenu()}>
          <Link
            to={token && walletAccount ? `/account/0/${walletAccount}` : `/login`}
            className={`account-menu ${dom === 'js-account' ? 'active' : ''}`}
          >
            <img src={accountImg} className='account-active' alt='' />
          </Link>

          {dom === 'js-account' ? (
            <div
              id='js-account'
              className={`tippy-box ${dom === 'js-account' ? 'opacity' : ''}`}
              onMouseLeave={() => hideMenu()}
              onMouseOver={() => showMenu('js-account')}
            >
              <div className='tippy-content'>
                <ul>
                  {token && walletAccount && (
                    <li>
                      <Link to={`/account/0/${walletAccount}`}>
                        <img src={require('../../assets/account-my-NFTs.png')} alt='' />
                        <div className='txt'>
                          <span>My NFTs</span>
                        </div>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to={`/user-settings`}>
                      <img src={require('../../assets/account-setting.png')} alt='' />
                      <div className='txt'>
                        <span>Settings</span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <a onClick={getLogOut}>
                      <img src={require('../../assets/account-log-out.png')} alt='' />
                      <div className='txt'>
                        <span>{isLogin ? 'Log Out' : 'Log In'}</span>
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

        {/* <div className='item'>
          <button className='wallet-menu' type='button' onClick={() => setShowDropper(!showDropper)}>
            <img src={require('../../assets/wallet-active.svg')} className='wallet-active' alt='' />
          </button>
        </div>

        <div
          className={`dropper ${showDropper ? 'dropper-actived' : 'dropper-none'}`}
          onClick={() => setShowDropper(false)}
        >
          <Slider showDropper={showDropper} />
        </div> */}
      </div>
    </div>
  );
};
