import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Menu, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import useWindowDimensions from '../../utils/layout';
import { useWeb3React } from '@web3-react/core';
import { MobileNavbar } from '../MobileNavbar';
import { SelectGroup } from '../HeaderSearch';
import { HeaderMenu } from '../Menu';
import { isMobile } from 'react-device-detect';
import { useQueryParam, StringParam } from 'use-query-params';
import useWallet from '../../providers';
import { getCookie, getLocalStorage } from '../../utils/utils';
import $web3js from '../../hooks/web3';
import './index.scss';

const getDefaultLinkActions = () => {
  return [<HeaderMenu key={1} />];
};

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
  );
};

export const MetaplexMenu = () => {
  const { deactivate } = useWeb3React();
  const history = useHistory();
  const { width } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const token = getCookie('web-token') || '';
  const walletAccount = localStorage.getItem('wallet') || '';
  const [isLogin, setIsLogin] = useState(false);
  const menuItem = [
    {
      id: '/primary',
      name: 'Primary',
      iconImg: '',
    },
    {
      id: '/marketplace',
      name: 'Marketplace',
      iconImg: '',
    },
    {
      id: '/helpcenter',
      name: 'HelpCenter',
      iconImg: '',
    },
    {
      id: token && walletAccount ? `/account/0/${walletAccount}` : `/login`,
      name: 'Account',
      iconImg: '',
    },
    {
      id: '/wallet',
      name: 'Wallet',
      iconImg: '',
    },
    {
      id: '/logOut',
      name: isLogin ? 'Log Out' : 'Log In',
      iconImg: '',
    },
  ];

  useEffect(() => {
    if (!walletAccount || !token) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [walletAccount, token]);
  const clickLogout = () => {
    $web3js.logOut(deactivate);
    setIsLogin(false);
  };
  if (isMobile || width < 768)
    return ( 
      <>
        <Modal
          title={
            <a href='/'>
              <img src={require('../../assets/logo.png')} alt='logo' />
              <span>DIFFGALAXY</span>
            </a>
          }
          visible={isModalVisible}
          footer={null}
          className={'mobile-menu-list'}
          closeIcon={<img alt='' onClick={() => setIsModalVisible(false)} src={require('../../assets/close.svg')} />}
        >
          <div className='site-card-wrapper mobile-menu-modal'>
            <Menu onClick={() => setIsModalVisible(false)}>
              {menuItem.map((item, idx) => (
                <Menu.Item key={idx}>
                  <div className='item'>
                    {item.id === '/logOut' ? (
                      <a onClick={clickLogout}>{item.name}</a>
                    ) : (
                      <Link to={item.id}>{item.name}</Link>
                    )}
                  </div>
                </Menu.Item>
              ))}
            </Menu>
          </div>
        </Modal>
        <MenuOutlined onClick={() => setIsModalVisible(true)} style={{ fontSize: '1.4rem' }} />
      </>
    );

  return <DefaultActions vertical={false} />;
};

export const LogoLink = () => {
  return (
    <>
      <Link to={`/`} className='logo-link'>
        <img src={require('../../assets/logo.png')} width={40} height={40} alt='' />
        <h1>DIFFGALAXY</h1>
      </Link>
    </>
  );
};

export const AppBar = () => {
  const { width } = useWindowDimensions();
  const wallet = useWallet();
  useEffect(() => {
    const walletData = getLocalStorage('wallet');
    if (walletData) {
      const chainName = 'aitd';
      wallet.connect(chainName);
    }
  }, []);
  return (
    <>
      {(isMobile || width < 768) && <MobileNavbar />}
      {!isMobile && width >= 768 && (
        <div id='desktop-navbar'>
          <div className='app-left'>
            <LogoLink />
          </div>
          <div className='app-right'>
            <MetaplexMenu />
          </div>
        </div>
      )}
    </>
  );
};
