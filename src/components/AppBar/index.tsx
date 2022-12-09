import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Menu, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import useWindowDimensions from '../../utils/layout';
import { useWeb3React } from '@web3-react/core';
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

  useEffect(() => {
    if (!walletAccount || !token) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [walletAccount, token]);

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
     <div id='desktop-navbar'>
        <div className='app-left'>
          <LogoLink />
        </div>
        <div className='app-right'>
          <MetaplexMenu />
        </div>
      </div>
    </>
  );
};
