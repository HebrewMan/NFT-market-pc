import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import './index.scss'
import { getOrderEventPage } from 'Src/api/order'
import TradingList from "Src/components/TradingList"
export const Trading = (props: any) => {
  const { tokenId, contractAddr } = props || {}
  const _chainId = window?.provider?.chainId
  const chainId = !isMobile ? parseInt(_chainId, 16) : parseInt(_chainId)
  const [tradingHistoryData, setTradingHistoryData] = useState<any>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [type, setType] = useState(null)


  useEffect(() => {
    (String(tokenId) && contractAddr) && getTradingPageData()
  }, [tokenId, contractAddr, type, page])

  // useEffect(() => {
  //   getTradingPageData()
  // }, [page])
  // // 请求Trading History
  const getTradingPageData = async () => {
    const obj = {
      types: type,
      tokenId: tokenId,
      page: page,
      size: 20,
      contractAddr: contractAddr,
    }
    const res: any = await getOrderEventPage(obj)
    setTotal(res?.data.total)
    setTradingHistoryData(tradingHistoryData.concat(res?.data?.records))
  }
  const handleFilter = (list: any) => {
    setType(list)
    setTradingHistoryData([])
  }
  return (
    <div className='trading-history'>
      {<TradingList TradingData={tradingHistoryData} showTitle={true} handleMoreChange={() => setPage(page + 1)} total={total} handleFilter={(list: any) => handleFilter(list)} />}
    </div>
  )
}
