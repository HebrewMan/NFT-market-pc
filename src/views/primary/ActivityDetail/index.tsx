import React from 'react'
import { Divider } from 'antd'
import { PHeader } from '../components/Header'
import { CommTimer } from '../components/Timer'
import './index.scss'
import { useTranslation } from 'react-i18next'

// 一级市场外部活动详情页
export const ActivityDetail = () => {
  const { t } = useTranslation()
  const details: string = localStorage.getItem('details') ?? ''
  const actityDetail: string = localStorage.getItem('actityDetail') ?? ''
  const primaryObj = JSON.parse(details)
  const activeInfo = JSON.parse(actityDetail)

  console.log(primaryObj, activeInfo, 'activeInfo')

  const handleBuy = () => {
    if (activeInfo?.buyUrl) {
      window.location.href = activeInfo.buyUrl
    }
  }

  const getTimer = (row: any) => {
    return row.status === 3 || row.status === 2 ? [] : row.countdown
  }

  return (
    <div className={`active-detail-container`}>
      <div className='banner'>
        <img src={activeInfo?.backgroundUrl} alt='detail-bg' />
      </div>
      <div className='timer-box'>
        {activeInfo && (
          <div className='timer'>
            <CommTimer activityStatus={Number(activeInfo?.status)} endTime={getTimer(activeInfo)} hiddenMore={true} />
          </div>
        )}
      </div>
      <PHeader primaryObj={primaryObj} />
      <div className='price-box'>
        <div>
          <p>{t('marketplace.price')}</p>
          <p className='num'>{activeInfo?.price}</p>
        </div>
        <Divider type='vertical' />
        <div>
          <p>{t('primary.TotalVolume')}</p>
          <p className='num'>{activeInfo?.totalNum || '-'}</p>
        </div>
      </div>
      <div className='btn-box'>
        <button onClick={handleBuy}>{t('common.buyNow')}</button>
      </div>
    </div>
  )
}
