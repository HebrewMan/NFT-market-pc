import React, { useEffect } from 'react'
import { Trending } from './Trending'
import { SubjectInner } from './SubjectInner'
import { SetupDetails } from './SetupDetails'
import { Resources } from './Resources'
import { DomainLink } from 'Src/components/DomainLink'
import { Ranking } from 'Src/components/Ranking'
import { Button } from 'antd'

import './index.scss'
export const HsHome = () => {
  return (
    <div className='home-container'>
      <DomainLink />
      <SubjectInner />
      <div className={`home-container-wrap`}>
        <Trending />
        <div className='home-ranking'>
          <div className='line-title'>交易排行</div>
          <Ranking paginationBoolean={false} />
          <div className='SeeMore'>
            <Button type='default'>查看更多</Button>
          </div>
        </div>
        <SetupDetails />
        <div className='homeTips'>
          <p>从 Diffgalaxy 开始，链接 GameFi 的未来。</p>
          <Button type='text' size={'large'}>开始交易</Button>
        </div>
        {/* <Resources /> */}
      </div>
    </div>
  )
}
