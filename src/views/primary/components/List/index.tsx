import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { CommTimer } from '../Timer'
import { Spin } from 'antd'
import { useTouchBottom } from '../../../../hooks'
import { getPrimaryActivityList } from '../../../../api/primary'
import useWindowDimensions from '../../../../utils/layout'
import './index.scss'
import { useTranslation } from "react-i18next"
import { getViewLang } from "../../../../utils/i18n"
import { LoadingOutlined } from '@ant-design/icons'
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
export const MaskImage = (props: any) => {
  const { t } = useTranslation()
  // eslint-disable-next-line react/prop-types
  const { width, status } = props
  const maskTitle = (status: any) => {
    if (status === 3 || status === null) {
      return t('primary.soldOut')
    } else if (status === 2) {
      return t('primary.end')
    } else if (status === 0) {
      return t('primary.waitStarted')
    } else {
      return ''
    }
  }
  return (
    <div className='spring-logo' style={{ width: width }}>
      <span>{maskTitle(status)}</span>
    </div>
  )
}

export const PList = () => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const [activityList, setActivityList] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [isMore, setIsMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const size = 20
  useEffect(() => {
    initList()
  }, [page])
  const initList = async () => {
    setLoading(true)
    const res: any = await getPrimaryActivityList({ page, size })
    const list: any = []
    // 暂时屏蔽内部活动
    res.data.records.map((item: any) => {
      if (item?.type == 1) {
        list.push(item)
      }
    })
    res?.data.records && setLoading(false)
    setActivityList([...activityList, ...list])
    setPage(res?.data?.current)
    if (page >= Math.ceil(res.data.total / size)) {
      setIsMore(false)
    }
  }
  // 触底加载
  const handleLoadMore = () => {
    if (isMoreRef.current) {
      const newPage = pageRef.current + 1
      setPage(newPage)
    }
  }
  const { isMoreRef, pageRef } = useTouchBottom(handleLoadMore, page, isMore)
  const ListItem = ({ activityList }: any) => {
    const history = useHistory()
    const handleToMarket = (item: any) => {

      // type 0.内部 1.外部
      if (item?.type == 1) {
        history.push({
          pathname: "/activityDetail",
          state: { id: item.id }
        })
      } else {
        history.push(`/marketlist/${item.id}/${item.status}`)
      }
    }
    const getTimer = (row: any) => {
      return row.status === 3 || row.status === 2 ? [] : row.countdown
    }
    return activityList.map((item: any, index: number) => {
      return (
        <li className='wrap-box-li' key={index} onClick={() => handleToMarket(item)}>
          <div className='wrap-box-left'>
            <div className='wrap-box-logo'>
              <img src={item.coverUrl} alt='' />
            </div>
            {item.status !== 1 ? <MaskImage status={item.status} width={'100%'} /> : <></>}
          </div>
          <div className='wrap-box-right'>
            <h2>{getViewLang(item.inName)}</h2>
            <p>{getViewLang(item.inRemark)}</p>
            <CommTimer activityStatus={Number(item.status)} endTime={getTimer(item)} />
            {width > 1024 && (
              <div className='box-more'>
                <a> {t('primary.more')} → </a>
              </div>
            )}
          </div>
        </li>
      )
    })
  }
  return (
    <div className={`primary-list-wrap ${isMobile ? 'mobile-primary-list-wrap' : ''}`}>
      <div className='list-wrap-box'>
        <ul>
          {loading && <Spin indicator={antIcon} />}
          <ListItem activityList={activityList} />
        </ul>
      </div>
    </div>
  )
}
