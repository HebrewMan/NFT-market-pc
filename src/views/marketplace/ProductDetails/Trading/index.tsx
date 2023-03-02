import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { formatTime } from '../../utils'
import config from 'Src/config/constants'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { intlFloorFormat } from 'Utils/bigNumber'
import { getOrderEventPage } from 'Src/api/order'
import InfiniteScroll from "react-infinite-scroll-component"
import { Table, ConfigProvider } from 'antd'
import AEmpty from "Src/components/Empty"
import TradingList from "Src/components/TradingList"

export const Trading = (props: any) => {
  const { t } = useTranslation()
  const { tokenId, contractAddr } = props || {}
  const _chainId = window?.provider?.chainId
  const chainId = !isMobile ? parseInt(_chainId, 16) : parseInt(_chainId)
  const [tradingHistoryData, setTradingHistoryData] = useState<any>([])
  const deepTradingHistoryData = tradingHistoryData
  const [detailsState, setDetailsState] = useState(false)
  const [filterState, setFilterState] = useState(false)
  const linkEth = (config as any)[chainId]?.BLOCKCHAIN_LINK
  const [eventBtn, setEventBtn] = useState<any>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [filterList, setFilterList] = useState([
    { label: '8', name: t('marketplace.details.mintTo'), checked: false },
    { label: '0', name: t('marketplace.details.listings'), checked: false },
    { label: '1', name: t('marketplace.details.cancel'), checked: false },
    { label: '2', name: t('marketplace.details.trade'), checked: false },
    { label: '6', name: t('marketplace.details.transfer'), checked: false },
  ])
  const history = useHistory()


  useEffect(() => {
    (String(tokenId) && contractAddr) && getTradingPageData()
  }, [tokenId, contractAddr, page])

  // // 请求Trading History
  const getTradingPageData = async () => {
    const obj = {
      tokenId: tokenId,
      page: page,
      size: 20,
      contractAddr: contractAddr,
    }
    const res: any = await getOrderEventPage(obj)
    setTotal(res?.data.total)
    setTradingHistoryData(tradingHistoryData.concat(res?.data?.records))
  }
  return (
    <div className='trading-history'>
      {<TradingList TradingData={tradingHistoryData} showTitle={true} handleMoreChange={() => setPage(page + 1)} total={total} />}
    </div>
  )
}
