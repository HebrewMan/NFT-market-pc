import React, { useEffect } from 'react'
import { Trending } from './Trending'
import { SubjectInner } from './SubjectInner'
import { SetupDetails } from './SetupDetails'
import { DomainLink } from 'Src/components/DomainLink'
import { Ranking } from 'Src/components/Ranking'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

import './index.scss'
import { useHistory } from 'react-router-dom'
export const HsHome = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const jumpRankings = () => {
    history.push('/rankings')
  }

  return (
    <div className='home-container'>
      <DomainLink />
      <SubjectInner />
      <div className={`home-container-wrap`}>
        <Trending />
        <div className='home-ranking'>
          <div className='line-title'>{t("home.tradingRanking")}</div>
          <Ranking paginationBoolean={false} />
          <div className='SeeMore'>
            <Button onClick={() => jumpRankings()} type='default'>{t("home.viewAll")}</Button>
          </div>
        </div>
        <SetupDetails />
        <div className='homeTips'>
          <p>{t("home.hiSkyText")}</p>
          <Button type='text' size={'large'}>{t("home.startTrading")}</Button>
        </div>
        {/* <Resources /> */}
      </div>
    </div>
  )
}
