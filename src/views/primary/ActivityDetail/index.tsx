import React, { useEffect, useState } from 'react'
import { Divider } from 'antd'
import { PHeader } from '../components/Header'
import { CommTimer } from '../components/Timer'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { getPrimaryActivityDetail } from 'Src/api/primary'
import { useHistory } from 'react-router-dom'
// 一级市场外部活动详情页
export const ActivityDetail = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [actityDetail, setActityDetail] = useState<any>({})
  const [primaryObj, setPrimaryObj] = useState<any>({})
  const localActityDetail: string = localStorage.getItem('actityDetail') ?? actityDetail
  const activeInfo = JSON.parse(localActityDetail)

  // 获取活动详情
  useEffect(() => {
    const state: any = history.location.state
    getDetail(state?.id)
  }, [history.location.state])

  const getDetail = async (id: string) => {
    const res: any = await getPrimaryActivityDetail(id)
    const info = {
      name: res.data.inName,
      description: res.data.inRemark,
    }
    setActityDetail(res.data)
    setPrimaryObj(info)
  }
  const handleBuy = () => {
    if (actityDetail?.buyUrl) {
      window.location.href = actityDetail.buyUrl
    }
  }

  const getTimer = (row: any) => {
    return row?.status === 3 || row?.status === 2 ? [] : row?.countdown
  }

  return (
    <div className='content-wrap-top'>
      <div className={`active-detail-container`}>
        <div className='banner'>
          <img src={actityDetail?.backgroundUrl} alt='detail-bg' />
        </div>
        <div className='timer-box'>
          {actityDetail && (
            <div className='timer'>
              <CommTimer activityStatus={Number(actityDetail?.status)} endTime={getTimer(activeInfo)} hiddenMore={true} />
            </div>
          )}
        </div>
        <PHeader primaryObj={primaryObj} />
        <div className='price-box'>
          <div>
            <p>{t('marketplace.price')}</p>
            <p className='num'>{actityDetail?.price}</p>
          </div>
          <Divider type='vertical' />
          <div>
            <p>{t('primary.TotalVolume')}</p>
            <p className='num'>{actityDetail?.totalNum || '-'}</p>
          </div>
        </div>
        <div className='btn-box'>
          <button onClick={handleBuy}>{t('common.buyNow')}</button>
        </div>
      </div>
    </div>
  )
}
