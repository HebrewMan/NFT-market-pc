import React, { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { useWeb3React } from '@web3-react/core'
import { AppBar } from '../AppBar'
import { Footer } from '../Footer'
import useWindowDimensions from '../../utils/layout'
const { Header, Content } = Layout
import { injected } from '../../utils/utils'

import './index.scss'

export const AppLayout = React.memo((props: any) => {
  const { width } = useWindowDimensions()
  const { account, activate, active } = useWeb3React()


  useEffect(() => {
    if (!active) {
      activate(injected)
    }
  }, [])
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
