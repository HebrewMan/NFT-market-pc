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
  const _chainId = window?.ethereum?.chainId
  const chainId = !isMobile ? parseInt(_chainId, 16) : parseInt(_chainId)
  const [tradingHistoryData, setTradingHistoryData] = useState<any>([])
  const deepTradingHistoryData = [...props.tradingHistoryData]
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
    // 请求Trading History
    setTradingHistoryData(props.tradingHistoryData)
  }, [props])


  const handleClearCurrent = (e: any, current: any) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    const currentList = eventBtn.filter((item: any) => item !== current)
    const currentFilterList = filterList.map((item) =>
      currentList.includes(item.label) ? { ...item, checked: true } : { ...item, checked: false },
    )
    setFilterList([...currentFilterList])
    setEventBtn(currentList)
    filterEventData(currentList)
  }
  const handleClearAll = () => {
    setEventBtn([])
    setFilterList(filterList.map((item: any) => ({ ...item, checked: false })))
    filterEventData([])
  }
  const showEventName = (method: any) => {
    switch (method) {
      case 8:
        return t('marketplace.details.mintTo')
      case 0:
        return t('marketplace.details.listings')
      case 1:
        return t('marketplace.details.cancel')
      case 2:
        return t('marketplace.details.trade')
      case 8:
        return t('marketplace.details.batchMintTo')
      case 5:
        return t('marketplace.details.updatePrcie')
      case 3:
      case 4:
      case 6:
      case 7:
      case 10:
        return t('marketplace.details.transfer')
    }
  }
  const iconClass = (item: any) => {
    switch (item.method) {
      case 8:
        return 'minto'
      case 0:
        return 'listing'
      case 1:
        return 'listing'
      case 2:
        return 'match'
      case 4:
        return 'minto'
      case 5:
        return 'listing'
      case 3:
      case 4:
      case 6:
      case 7:
      case 10:
        return 'transfer'
      default:
        return 'minto'
    }
  }
  const handleChangeFromRoute = (item: any) => {
    switch (item.method) {
      case 8:
        return false
      default:
        return history.push(`/account/0/${item?.fromAddr}`)
    }
  }
  const handleChangeToRoute = (item: any) => {
    return history.push(`/account/0/${item?.toAddr}`)
  }

  const handleChangeValue = (e: any, index: number) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    setFilterState(true)
    const deepList = [...filterList]
    deepList[index].checked = !deepList[index].checked
    const eventList: Array<string> = deepList
      .map((item) => (item.checked ? item.label : ''))
      .filter((item) => item.trim())
    setFilterList([...deepList])
    setEventBtn(eventList)
    filterEventData(eventList)
  }
  const filterEventData = (eventList: any) => {
    const elist = [...eventList]
    if (elist.length <= 0) {
      return setTradingHistoryData(deepTradingHistoryData)
    }
    const list = new Array()
    // 转移有多个状态, 搜索需过滤所有状态
    if (elist.includes('6')) {
      elist.push('3', '4', '7', '10')
    }
    deepTradingHistoryData.forEach((item) => {
      if (elist.includes(item.method.toString())) {
        list.push({ ...item })
      }
    })
    setTradingHistoryData([...list])
  }
  const Uli = () => (
    <div className='filter-checkbox'>
      {/* onClick={e => changeCheckbox(e)} */}
      <ul id='filter-checkbox-select'>
        {filterList.map((item: any, index) => {
          return (
            <label htmlFor={item.label} key={index} onClick={(e) => handleChangeValue(e, index)}>
              <li>
                <input type='checkbox' checked={item.checked} onClick={(e) => handleChangeValue(e, index)} />
                {item.name}
              </li>
            </label>
          )
        })}
      </ul>
    </div>
  )

  const fetchMoreData = () => {
    if (total <= 20) {
      setHasMore(false)
      return
    }
    setTimeout(() => {
      setPage(page + 1)
    }, 500)
  }
  const columns: any = [
    {
      width: 150,
      title: t('marketplace.details.transaction'),
      render: (r: string, t: any) => {
        return <>
          <img src={require(`Src/assets/marketPlace/${iconClass(t)}.png`)} className='svg-img-16' alt='' />
          <span>{showEventName(t.method)}</span>
        </>
      }
    },
    {
      width: 120,
      title: t('marketplace.price'),
      render: (r: string, t: any) => {
        return <>
          <img src={require('Src/assets/coin/aitd.svg')} alt='' className='svg-img' />
          {intlFloorFormat(t.price, 4)}
        </>
      }
    },
    {
      width: 120,
      title: t('marketplace.details.amount'),
      dataIndex: 'amount',
    },
    {
      width: 120,
      title: t('marketplace.from'),
      render: (r: string, t: any) => {
        return <a onClick={() => handleChangeFromRoute(t)}>{t?.fromAddr?.substr(2, 6)}</a>
      }
    },
    {
      width: 120,
      title: t('marketplace.to'),
      render: (r: string, t: any) => {
        return <a onClick={() => handleChangeToRoute(t)}>{t?.toAddr?.substr(2, 6)}</a>
      }
    },
    {
      width: 120,
      title: t('common.date'),
      render: (_: any, item: any) => {
        return (
          <a
            href={item.txHash ? linkEth + 'tx/' + item.txHash : ''}
            target={item.txHash ? '_blank' : ''}
            rel='noreferrer'
            className='dataTime'
          >
            {timeG(item.createDate)}
            {item.txHash && <img src={require('Src/assets//marketPlace/icon-link.png')} style={{ marginLeft: 10 }} alt='' />}
          </a>
        )
      },
    },

  ]

  const timeG = (createDate: string) => {
    return formatTime(createDate)
  }
  // const Content = () => (
  //   <div className='list-content'>
  //     <div className='trading-table'>
  //       {tradingHistoryData.length > 0 &&
  //         <ConfigProvider renderEmpty={() => <AEmpty style={{ heigth: '200px' }} />}>
  //           <Table
  //             columns={columns}
  //             dataSource={tradingHistoryData}
  //             size="small"
  //             pagination={false}
  //             className={'tradingTable'}
  //           />
  //         </ConfigProvider>
  //       }
  //     </div>
  //   </div>
  // )
  return (
    <div className='trading-history'>
      <div className='list-title title-point' onClick={() => setDetailsState(!detailsState)}>
        <img src={require('Src/assets/marketPlace/tradding.png')} alt='' className='svg-default-size' />
        <h2>{t('marketplace.details.history')}</h2>
        <div className='arrow-icon'>
          <img
            src={
              !detailsState
                ? require('Src/assets/marketPlace/arrow.png')
                : require('Src/assets/marketPlace/expand.png')
            }
            alt=''
          />
        </div>
      </div>
      {/* filter */}
      {!detailsState ? <TradingList TradingData={tradingHistoryData} /> : <></>}
    </div>
  )
}
