import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Ranking } from 'Src/components/Ranking'
import './index.scss'
export const RankingView = () => {
  const { t } = useTranslation()

  return (
    <div className='content-wrap-top'>
      <div className='ranKing-waper'>
        <div className='ranKing-title'>{t('ranking.title')}</div>
        <div className='ranKing-tips'>{t('ranking.subTitle')}</div>
        <div className='ranking-list'>
          <Ranking paginationBoolean={true} />
        </div>
      </div>
    </div>
  )
}

