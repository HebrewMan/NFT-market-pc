import React from 'react';
import { Layout } from 'antd';
import { AppBar } from '../AppBar';
import { Footer } from '../Footer';
import { DomainLink } from '../DomainLink';
import { isMobile } from 'react-device-detect';
import useWindowDimensions from '../../utils/layout';
const { Header, Content } = Layout;
import './index.scss';

export const AppLayout = React.memo((props: any) => {
  const { width } = useWindowDimensions();
  return (
    <div>
      <Layout id={'main-layout'}>
        <span id={'main-bg'}></span>
        <span id={'bg-gradient'}></span>
        <span id={'static-header-gradient'}></span>
        <span id={'static-end-gradient'}></span>
        <Header className={`App-Bar ${!isMobile && width > 767 ? 'pc-App-Bar' : 'mobile-App-Bar'}`}>
          <AppBar />
        </Header>
        <DomainLink />
        <Layout id={'width-layout'}>
          <Content>{props.children}</Content>
        </Layout>
        {(!isMobile && width > 767) && <Footer />}
      </Layout>
    </div>
  );
});
